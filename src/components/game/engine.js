/* ─────────────────────────────────────────────────────────────
   Code Frontier: Core Run — pure simulation (no DOM, testable in Node).

   A finite campaign of 30 short rounds. Each round is generated from
   a fixed seed (so it is the same every time) out of hand‑designed
   segments that are always passable. Every 5 rounds adds a mechanic:
     01–05 gaps & crumbling planks     06–10 corrupted code blocks
     11–15 rockfall zones              16–20 patrol drones
     21–25 moving platforms            26–30 final extraction route
   A round is cleared by reaching the exit with the required data
   cores before the timer runs out.
   ───────────────────────────────────────────────────────────── */

export const W = 960;
export const H = 440;
export const T = 40;
export const ROWS = 11;
export const ROUNDS = 30;
export const STEP = 1000 / 60;
export const SAVE_KEY = 'cf-corerun-campaign';

export const PHYS = { accel: 0.62, airAccel: 0.44, max: 4.6, friction: 0.78, gravity: 0.6, jump: -12.8, cut: -4, maxFall: 13, coyote: 6, buffer: 8 };
export const PW = 24; // hitbox
export const PH = 44;
const GROUND_Y = 9 * T - PH; // player y when standing on the ground row

export const COL = {
  skyTop: '#2b333b',
  skyLow: '#6b6250',
  far: '#46525e',
  mid: '#36412f',
  grass: '#5d6b3f',
  soil: '#5a4632',
  soilDark: '#46372a',
  brick: '#8a3d33',
  brickDark: '#6b2f28',
  mortar: '#3e2a22',
  plank: '#9a7a48',
  plankDark: '#6e5532',
  core: '#c9a45c',
  coreLight: '#efe4cc',
  corrupt: '#2a1d1a',
  corruptBit: '#a8473a',
  ink: '#211b17',
  cream: '#e9dcc0',
  gate: '#5a4632',
  gateField: '#5d6f82',
  rock: '#6d6458',
  steel: '#56636f',
  steelDark: '#3e4a57',
};

export const MECHANICS = [
  { name: 'Gaps & timing', note: 'Leap the gaps and climb the ledges. From round 3, wooden planks crumble a moment after you land.' },
  { name: 'Corrupted code', note: 'Red glitch blocks hurt on touch. Jump clean over them.' },
  { name: 'Rockfall', note: 'Rocks drop in marked zones. A red marker flashes where each will land.' },
  { name: 'Patrol drones', note: 'Drones sweep the route. Land on top of one to disable it.' },
  { name: 'Moving platforms', note: 'Wide chasms. Time your jump onto the steel lifts and ride them across.' },
  { name: 'Final extraction', note: 'Every hazard at once. Reach the extraction tower with the cores.' },
];
export const tierOf = (round) => Math.min(6, Math.ceil(round / 5));

export const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/* ───────────── round generator ───────────── */
export function buildRound(round) {
  const rand = seeded(round * 7919 + 101);
  const tier = tierOf(round);
  const d = (round - 1) / (ROUNDS - 1); // 0 → 1 difficulty
  const target = Math.round(34 + round * 1.8 + (tier === 6 ? 10 : 0));
  const MAXC = target + 40;
  const g = Array.from({ length: ROWS }, () => new Array(MAXC).fill(0));
  const fill = (c0, c1, r0 = 9, r1 = 10, v = 1) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1 && c < MAXC; c++) g[r][c] = v;
  };
  const crumbles = [];
  const movers = [];
  const cores = [];
  const drones = [];
  const debrisZones = [];
  let extraTime = 0;
  const core = (c, r, path = true) => cores.push({ x: c * T + T / 2, y: r * T + T / 2, taken: false, path });

  // segment builders: each starts on ground at column c and returns the next column
  const seg = {
    flat(c) {
      const len = 5 + Math.floor(rand() * 4);
      fill(c, c + len - 1);
      core(c + 1, 8);
      core(c + len - 2, 8);
      if (rand() < 0.5) {
        fill(c + 2, c + 4, 6, 6, 2);
        core(c + 3, 5, false);
      }
      return c + len;
    },
    gap(c) {
      const w = Math.min(3, 2 + Math.floor(rand() * (1.2 + d * 1.6)));
      fill(c, c + 1);
      core(c + 2 + (w - 1) / 2, 6);
      fill(c + 2 + w, c + 3 + w);
      return c + 4 + w;
    },
    crumble(c) {
      fill(c, c + 1);
      crumbles.push({ x: (c + 3) * T, y: 7 * T, w: 2 * T, h: 16, state: 'idle', t: 0, dy: 0, vy: 0, delay: Math.round(32 - d * 8) });
      crumbles.push({ x: (c + 6) * T, y: 7 * T, w: 2 * T, h: 16, state: 'idle', t: 0, dy: 0, vy: 0, delay: Math.round(32 - d * 8) });
      core(c + 4, 6);
      core(c + 7, 6);
      fill(c + 9, c + 10);
      extraTime += 1;
      return c + 11;
    },
    stairs(c) {
      fill(c, c + 7);
      fill(c + 1, c + 2, 8, 8, 1);
      fill(c + 4, c + 5, 6, 6, 2);
      core(c + 5, 5, false);
      core(c + 7, 8);
      return c + 8;
    },
    corrupt(c) {
      const two = rand() < 0.35 + d * 0.5;
      const len = two ? 9 : 6;
      fill(c, c + len - 1);
      g[8][c + 2] = 4;
      core(c + 2, 5);
      if (two) {
        g[8][c + 6] = 4;
        core(c + 6, 5);
      }
      core(c + len - 1, 8);
      return c + len;
    },
    debris(c) {
      const len = 10 + Math.floor(rand() * 4);
      fill(c, c + len - 1);
      debrisZones.push([c * T, (c + len) * T]);
      core(c + 2, 8);
      core(c + 6, 8);
      core(c + len - 2, 8);
      return c + len;
    },
    drone(c) {
      const len = 10;
      fill(c, c + len - 1);
      drones.push({ x0: (c + 2) * T, x1: (c + 8) * T, x: (c + 5) * T, y: 7.6 * T, baseY: 7.6 * T, dir: rand() < 0.5 ? 1 : -1, ph: rand() * 6, alive: true, speed: 1 + d * 0.8 });
      core(c + 1, 8);
      core(c + 5, 5, false);
      core(c + 9, 8);
      return c + len;
    },
    mover(c) {
      const gap = 7 + Math.floor(rand() * 2);
      fill(c, c + 1);
      const x0 = (c + 2) * T;
      const x1 = (c + gap) * T;
      movers.push({ x: x0, y: 8 * T, w: 2 * T, h: 16, x0, x1, dir: 1, speed: 1.1 + d * 0.6, dx: 0 });
      core(c + 2 + gap / 2, 6);
      fill(c + 2 + gap, c + 3 + gap);
      extraTime += 4;
      return c + 4 + gap;
    },
  };

  // which segments this round may use; the newest mechanic is favoured
  const pools = {
    1: [['flat', 1], ['gap', 3], ['crumble', round >= 3 ? 2 : 0], ['stairs', 1]],
    2: [['flat', 1], ['gap', 2], ['crumble', 1], ['stairs', 1], ['corrupt', 4]],
    3: [['flat', 1], ['gap', 2], ['crumble', 1], ['corrupt', 2], ['debris', 4]],
    4: [['flat', 1], ['gap', 2], ['crumble', 1], ['corrupt', 1], ['debris', 1], ['drone', 4]],
    5: [['flat', 1], ['gap', 1], ['corrupt', 1], ['debris', 1], ['drone', 1], ['mover', 4]],
    6: [['gap', 2], ['crumble', 2], ['corrupt', 2], ['debris', 2], ['drone', 2], ['mover', 2]],
  }[tier].filter(([, wt]) => wt > 0);
  const total = pools.reduce((a, [, wt]) => a + wt, 0);
  const pick = () => {
    let x = rand() * total;
    for (const [name, wt] of pools) if ((x -= wt) < 0) return name;
    return pools[0][0];
  };

  fill(0, 4);
  let c = 5;
  let last = '';
  while (c < target) {
    let name = pick();
    if (name === last && name !== 'flat') name = 'flat';
    c = seg[name](c);
    last = name;
  }
  // run-out to the exit: always flat, safe ground
  const cols = c + 10;
  fill(c, cols - 1);
  g.forEach((row, r) => (g[r] = row.slice(0, cols)));
  const gate = { x: (cols - 5) * T, y: 6 * T, w: 2 * T, h: 3 * T };

  const pathCores = cores.filter((k) => k.path).length;
  const required = Math.max(2, Math.min(pathCores, Math.round(pathCores * (0.45 + 0.25 * d))));
  const runSeconds = (cols * T) / (PHYS.max * 60);
  const timeLimit = Math.ceil(runSeconds * (2.3 - 0.8 * d) + extraTime + 7);

  return { round, tier, cols, g, crumbles, movers, cores, drones, debrisZones, gate, required, timeLimit, debrisEvery: Math.round(110 - d * 40) };
}

export function makeWorld(round) {
  const lvl = buildRound(round);
  return {
    ...lvl,
    levelW: lvl.cols * T,
    p: { x: 2 * T, y: GROUND_Y, vx: 0, vy: 0, onGround: false, coyote: 0, buffer: 0, face: 1, inv: 0, dist: 0, jumpHeld: false, ride: null },
    spawn: { x: 2 * T, y: GROUND_Y },
    cam: 0,
    debris: [],
    debrisTimer: 60,
    parts: [],
    score: 0,
    stomps: 0,
    lives: 3,
    frame: 0,
    shake: 0,
    gateMsg: 0,
  };
}

export const coresTaken = (w) => w.cores.reduce((n, c) => n + (c.taken ? 1 : 0), 0);
export const timeLeft = (w) => Math.max(0, w.timeLimit - w.frame / 60);

/** Advance one fixed 60 Hz step. Returns 'cleared' | 'time' | 'lives' | null. */
export function stepWorld(w, k) {
  const p = w.p;
  w.frame++;
  const cols = w.cols;

  // moving platforms first, so riders can be carried
  w.movers.forEach((m) => {
    const prev = m.x;
    m.x += m.dir * m.speed;
    if (m.x <= m.x0) {
      m.x = m.x0;
      m.dir = 1;
    } else if (m.x >= m.x1) {
      m.x = m.x1;
      m.dir = -1;
    }
    m.dx = m.x - prev;
  });
  if (p.ride && p.onGround) p.x += p.ride.dx;

  const solids = (box) => {
    const out = [];
    const c0 = Math.max(0, Math.floor(box.x / T) - 1);
    const c1 = Math.min(cols - 1, Math.floor((box.x + box.w) / T) + 1);
    const r0 = Math.max(0, Math.floor(box.y / T) - 1);
    const r1 = Math.min(ROWS - 1, Math.floor((box.y + box.h) / T) + 1);
    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++) {
        const v = w.g[r][c];
        if (v === 1 || v === 2) out.push({ x: c * T, y: r * T, w: T, h: T });
      }
    w.crumbles.forEach((cr) => {
      if (cr.state === 'idle' || cr.state === 'shaking') out.push({ x: cr.x, y: cr.y, w: cr.w, h: cr.h, cr });
    });
    w.movers.forEach((m) => out.push({ x: m.x, y: m.y, w: m.w, h: m.h, mv: m }));
    return out;
  };

  // horizontal input
  const dir = (k.right ? 1 : 0) - (k.left ? 1 : 0);
  if (dir) {
    p.vx += dir * (p.onGround ? PHYS.accel : PHYS.airAccel);
    p.face = dir;
  } else if (p.onGround) p.vx *= PHYS.friction;
  else p.vx *= 0.96;
  p.vx = Math.max(-PHYS.max, Math.min(PHYS.max, p.vx));
  if (Math.abs(p.vx) < 0.05) p.vx = 0;

  // jump: buffer + coyote time, variable height
  if (p.buffer > 0) p.buffer--;
  if (p.onGround) p.coyote = PHYS.coyote;
  else if (p.coyote > 0) p.coyote--;
  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = PHYS.jump;
    p.buffer = 0;
    p.coyote = 0;
    p.onGround = false;
    p.jumpHeld = true;
  }
  if (!k.jump && p.jumpHeld && p.vy < PHYS.cut) p.vy = PHYS.cut;
  if (!k.jump) p.jumpHeld = false;
  p.vy = Math.min(PHYS.maxFall, p.vy + PHYS.gravity);

  // resolve X then Y
  p.x = Math.max(0, Math.min(w.levelW - PW, p.x + p.vx));
  let box = { x: p.x, y: p.y, w: PW, h: PH };
  for (const s of solids(box)) {
    if (!overlap(box, s) || s.mv) continue;
    if (p.vx > 0) p.x = s.x - PW;
    else if (p.vx < 0) p.x = s.x + s.w;
    p.vx = 0;
    box.x = p.x;
  }
  p.y += p.vy;
  box = { x: p.x, y: p.y, w: PW, h: PH };
  p.onGround = false;
  p.ride = null;
  for (const s of solids(box)) {
    if (!overlap(box, s)) continue;
    if (p.vy >= 0) {
      if (s.mv && p.y + PH - p.vy > s.y + 6) continue; // only land on lifts from above
      p.y = s.y - PH;
      p.onGround = true;
      if (s.mv) p.ride = s.mv;
      if (s.cr && s.cr.state === 'idle') {
        s.cr.state = 'shaking';
        s.cr.t = s.cr.delay;
      }
    } else if (!s.mv) p.y = s.y + s.h;
    else continue;
    p.vy = 0;
    box.y = p.y;
  }
  if (p.onGround) p.dist += Math.abs(p.vx);
  if (p.inv > 0) p.inv--;

  const hurt = (fromX) => {
    if (p.inv > 0) return;
    w.lives--;
    p.inv = 100;
    p.vy = -7;
    p.vx = (p.x + PW / 2 < fromX ? -1 : 1) * 4;
    w.shake = 10;
    burst(w, p.x + PW / 2, p.y + PH / 2, COL.corruptBit, 10);
  };

  // fell into a gap: lose a life, back to the last safe spot
  if (p.y > H + 60) {
    w.lives--;
    w.shake = 12;
    Object.assign(p, { x: w.spawn.x, y: w.spawn.y, vx: 0, vy: 0, inv: 100, ride: null });
  }
  // remember a safe respawn point whenever standing on solid ground
  if (p.onGround && !p.ride && w.g[9][Math.floor((p.x + PW / 2) / T)] === 1 && p.y === GROUND_Y && p.x > w.spawn.x + 4 * T) {
    const c = Math.floor((p.x + PW / 2) / T);
    if (w.g[9][c - 1] === 1 && w.g[9][c + 1] === 1 && w.g[8][c] !== 4 && w.g[8][c - 1] !== 4 && w.g[8][c + 1] !== 4) w.spawn = { x: c * T + 8, y: GROUND_Y };
  }

  // corrupted blocks
  const hb = { x: p.x + 3, y: p.y + 4, w: PW - 6, h: PH - 6 };
  const c0 = Math.floor(hb.x / T);
  const c1 = Math.floor((hb.x + hb.w) / T);
  for (let r = Math.max(0, Math.floor(hb.y / T)); r <= Math.min(ROWS - 1, Math.floor((hb.y + hb.h) / T)); r++)
    for (let c = c0; c <= c1; c++) if (w.g[r]?.[c] === 4 && overlap(hb, { x: c * T + 5, y: r * T + 8, w: T - 10, h: T - 8 })) hurt(c * T + T / 2);

  // crumbling planks
  w.crumbles.forEach((cr) => {
    if (cr.state === 'shaking' && --cr.t <= 0) {
      cr.state = 'falling';
      cr.vy = 0;
    } else if (cr.state === 'falling') {
      cr.vy += 0.5;
      cr.dy += cr.vy;
      if (cr.dy > H) {
        cr.state = 'gone';
        cr.t = 200;
      }
    } else if (cr.state === 'gone' && --cr.t <= 0) {
      cr.state = 'idle';
      cr.dy = 0;
    }
  });

  // cores
  w.cores.forEach((c) => {
    if (!c.taken && overlap(box, { x: c.x - 12, y: c.y - 12, w: 24, h: 24 })) {
      c.taken = true;
      w.score += 100;
      burst(w, c.x, c.y, COL.core, 8);
    }
  });

  // drones
  w.drones.forEach((d) => {
    if (!d.alive) return;
    d.x += d.dir * d.speed;
    if (d.x < d.x0 || d.x > d.x1) d.dir *= -1;
    d.y = d.baseY + Math.sin(w.frame / 22 + d.ph) * 10;
    const db = { x: d.x, y: d.y, w: 36, h: 22 };
    if (!overlap(box, db)) return;
    if (p.vy > 0 && p.y + PH - d.y < 18) {
      d.alive = false;
      p.vy = -8.5;
      w.score += 150;
      w.stomps++;
      burst(w, d.x + 18, d.y + 10, '#8a9298', 12);
    } else hurt(d.x + 18);
  });

  // rockfall
  const cx = p.x + PW / 2;
  const zone = w.debrisZones.find(([a, b]) => cx > a - 120 && cx < b);
  if (zone && --w.debrisTimer <= 0) {
    const tx = Math.max(zone[0], Math.min(zone[1] - 22, cx + p.vx * 26 + (Math.random() * 260 - 100)));
    w.debris.push({ x: tx, y: -40, vy: 0, warn: 48 });
    w.debrisTimer = w.debrisEvery + Math.random() * 40;
  }
  w.debris = w.debris.filter((d) => {
    if (d.warn > 0) {
      d.warn--;
      return true;
    }
    d.vy = Math.min(11, d.vy + 0.45);
    d.y += d.vy;
    if (overlap(box, { x: d.x, y: d.y, w: 22, h: 22 })) {
      hurt(d.x + 11);
      burst(w, d.x + 11, d.y + 11, COL.rock, 8);
      return false;
    }
    const r = Math.floor((d.y + 22) / T);
    const c = Math.floor((d.x + 11) / T);
    if (d.y > H || (r >= 0 && r < ROWS && (w.g[r][c] === 1 || w.g[r][c] === 2))) {
      burst(w, d.x + 11, d.y + 18, COL.rock, 6);
      return false;
    }
    return true;
  });

  // particles + camera
  w.parts = w.parts.filter((q) => {
    q.x += q.vx;
    q.y += q.vy;
    q.vy += 0.2;
    return --q.life > 0;
  });
  if (w.shake > 0) w.shake--;
  if (w.gateMsg > 0) w.gateMsg--;
  const vw = w.viewW || W;
  const target = Math.max(0, Math.min(w.levelW - vw, p.x - vw * 0.38));
  w.cam += (target - w.cam) * 0.12;

  if (w.lives <= 0) return 'lives';
  if (overlap(box, w.gate)) {
    if (coresTaken(w) >= w.required) return 'cleared';
    w.gateMsg = 90;
  }
  if (w.frame / 60 >= w.timeLimit) return 'time';
  return null;
}

/** Points for a cleared round: cores and stomps are already counted live. */
export function roundBonus(w) {
  return Math.round(timeLeft(w)) * 10 + w.lives * 100;
}

export function burst(w, x, y, c, n) {
  for (let i = 0; i < n; i++) w.parts.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1, life: 24 + Math.random() * 14, c });
}
