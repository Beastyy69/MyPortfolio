import { COL, H, T, ROWS, W, coresTaken } from './engine.js';
import { DRONE, HERO, drawMap } from './sprites.jsx';

/* Core Run — canvas renderer (all art drawn procedurally; original). */

const SKYLINE = (() => {
  const far = [];
  const mid = [];
  for (let x = 0; x <= 2600; x += 16) {
    far.push(Math.round((150 + 60 * Math.sin(x / 190) + 40 * Math.sin(x / 71 + 1)) / 8) * 8);
    mid.push(Math.round((90 + 36 * Math.sin(x / 130 + 2) + 20 * Math.cos(x / 47)) / 8) * 8);
  }
  return { far, mid };
})();

// each tier gets its own sky and hill tone so the campaign visibly travels
const BIOMES = [
  { top: '#2b333b', low: '#6b6250', far: '#46525e', mid: '#36412f' }, // frontier dusk
  { top: '#2a2a30', low: '#5e4a42', far: '#4a4450', mid: '#3a3330' }, // corrupted ruins
  { top: '#33383a', low: '#6d6655', far: '#55585a', mid: '#4a4436' }, // rockfall canyon
  { top: '#262d33', low: '#4f5a5e', far: '#3e4a55', mid: '#2f3a36' }, // drone highlands
  { top: '#2c2f38', low: '#5a5a62', far: '#474e5c', mid: '#363d48' }, // chasm lifts
  { top: '#231d1d', low: '#6a4630', far: '#4a3a36', mid: '#33281f' }, // extraction night
];

export function drawWorld(ctx, w, canvasWidth) {
  const VW = w.viewW || W;
  const dpr = canvasWidth / VW;
  const biome = BIOMES[w.tier - 1];
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, biome.top);
  sky.addColorStop(1, biome.low);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VW, H);
  ctx.fillStyle = 'rgba(233,220,192,0.16)';
  ctx.fillRect(VW - 200 - ((w.cam * 0.04) % 40), 70, 56, 56);

  const band = (arr, factor, base, color) => {
    ctx.fillStyle = color;
    const off = (w.cam * factor) % 16;
    const i0 = Math.floor((w.cam * factor) / 16);
    for (let i = 0; i <= VW / 16 + 1; i++) {
      const hgt = arr[(i0 + i) % arr.length];
      ctx.fillRect(i * 16 - off, base - hgt, 16, H - base + hgt);
    }
  };
  band(SKYLINE.far, 0.15, 330, biome.far);
  band(SKYLINE.mid, 0.4, 380, biome.mid);

  const sx = Math.round(w.shake > 0 ? (Math.random() - 0.5) * w.shake * 0.6 : 0);
  ctx.save();
  ctx.translate(-Math.round(w.cam) + sx, 0);
  ctx.textAlign = 'center';
  ctx.font = '10px "Press Start 2P", monospace';

  // rockfall warning signs
  w.debrisZones.forEach(([a]) => {
    ctx.fillStyle = COL.ink;
    ctx.fillRect(a - 3, 9 * T - 56, 5, 56);
    ctx.fillStyle = COL.gate;
    ctx.beginPath();
    ctx.moveTo(a, 9 * T - 100);
    ctx.lineTo(a + 22, 9 * T - 60);
    ctx.lineTo(a - 22, 9 * T - 60);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COL.cream;
    ctx.fillText('!', a, 9 * T - 66);
  });

  // extraction tower behind the exit (final tier)
  const gt = w.gate;
  if (w.tier === 6) {
    ctx.strokeStyle = COL.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(gt.x - 10, 9 * T);
    ctx.lineTo(gt.x + gt.w / 2, 40);
    ctx.lineTo(gt.x + gt.w + 10, 9 * T);
    ctx.moveTo(gt.x, 200);
    ctx.lineTo(gt.x + gt.w, 200);
    ctx.moveTo(gt.x + 14, 120);
    ctx.lineTo(gt.x + gt.w - 14, 120);
    ctx.stroke();
    ctx.fillStyle = Math.floor(w.frame / 30) % 2 ? COL.brick : COL.brickDark;
    ctx.fillRect(gt.x + gt.w / 2 - 5, 30, 10, 10);
  }

  // tiles
  const cStart = Math.max(0, Math.floor(w.cam / T) - 1);
  const cEnd = Math.min(w.cols - 1, Math.ceil((w.cam + VW) / T) + 1);
  for (let r = 0; r < ROWS; r++)
    for (let c = cStart; c <= cEnd; c++) {
      const v = w.g[r][c];
      if (!v) continue;
      const x = c * T;
      const y = r * T;
      if (v === 1) {
        const top = r === 0 || w.g[r - 1][c] !== 1;
        ctx.fillStyle = COL.soil;
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = COL.soilDark;
        ctx.fillRect(x + ((c * 7 + r * 13) % 28) + 4, y + 14 + ((c * 3 + r * 5) % 14), 6, 4);
        ctx.fillRect(x + ((c * 17 + r * 3) % 30) + 2, y + 4 + ((c * 11) % 10), 4, 4);
        if (top) {
          ctx.fillStyle = COL.grass;
          ctx.fillRect(x, y, T, 8);
          ctx.fillRect(x + ((c * 11) % 30), y - 4, 4, 4);
        }
      } else if (v === 2) {
        ctx.fillStyle = COL.brick;
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = COL.mortar;
        ctx.fillRect(x, y + 19, T, 2);
        ctx.fillRect(x + (c % 2 ? 10 : 28), y, 2, 19);
        ctx.fillRect(x + (c % 2 ? 28 : 10), y + 21, 2, 19);
        ctx.fillStyle = COL.brickDark;
        ctx.fillRect(x, y + T - 4, T, 4);
      } else if (v === 4) {
        ctx.fillStyle = COL.corrupt;
        ctx.fillRect(x + 2, y + 6, T - 4, T - 6);
        ctx.fillStyle = COL.corruptBit;
        const seed = Math.floor(w.frame / 12);
        for (let i = 0; i < 7; i++) {
          const hx = (i * 13 + seed * 7 + c * 5) % 30;
          const hy = (i * 17 + seed * 3) % 26;
          ctx.fillRect(x + 5 + hx, y + 9 + hy, 4 + (i % 3) * 2, 3);
        }
        ctx.fillStyle = COL.cream;
        ctx.globalAlpha = 0.55;
        ctx.fillText('</>', x + T / 2, y + 30);
        ctx.globalAlpha = 1;
        ctx.fillStyle = COL.corruptBit;
        for (let i = 0; i < 5; i++) ctx.fillRect(x + 2 + i * 8, y + 2, 4, 4);
      }
    }

  // crumbling planks
  w.crumbles.forEach((cr) => {
    if (cr.state === 'gone') return;
    const jx = cr.state === 'shaking' ? Math.round(Math.sin(w.frame * 1.7) * 2) : 0;
    const x = cr.x + jx;
    const y = cr.y + cr.dy;
    ctx.fillStyle = COL.plank;
    ctx.fillRect(x, y, cr.w, cr.h);
    ctx.fillStyle = COL.plankDark;
    for (let i = 0; i < cr.w; i += 20) ctx.fillRect(x + i, y, 2, cr.h);
    ctx.fillRect(x, y + cr.h - 4, cr.w, 4);
    if (cr.state === 'shaking') {
      ctx.fillStyle = COL.ink;
      ctx.fillRect(x + cr.w / 2 - 1, y + 2, 2, cr.h - 6);
    }
  });

  // moving lifts (steel, with a guide rail)
  w.movers.forEach((m) => {
    ctx.fillStyle = 'rgba(33,27,23,0.35)';
    ctx.fillRect(m.x0 + 6, m.y + 6, m.x1 + m.w - m.x0 - 12, 3);
    ctx.fillStyle = COL.steel;
    ctx.fillRect(m.x, m.y, m.w, m.h);
    ctx.fillStyle = COL.steelDark;
    ctx.fillRect(m.x, m.y + m.h - 5, m.w, 5);
    ctx.fillStyle = COL.ink;
    for (let i = 8; i < m.w; i += 18) ctx.fillRect(m.x + i, m.y + 4, 3, 3);
    ctx.fillStyle = COL.core;
    ctx.fillRect(m.x + m.w / 2 - 6, m.y - 3, 12, 3);
  });

  // exit gate (locked until enough cores)
  const locked = coresTaken(w) < w.required;
  ctx.fillStyle = COL.gate;
  ctx.fillRect(gt.x - 14, gt.y - 18, gt.w + 28, 18);
  ctx.fillRect(gt.x - 14, gt.y, 14, gt.h);
  ctx.fillRect(gt.x + gt.w, gt.y, 14, gt.h);
  ctx.fillStyle = COL.gateField;
  ctx.globalAlpha = locked ? 0.3 : 0.6;
  ctx.fillRect(gt.x, gt.y, gt.w, gt.h);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = COL.cream;
  if (!locked) for (let i = 0; i < 6; i++) ctx.fillRect(gt.x + 6, gt.y + ((w.frame * 0.8 + i * 20) % gt.h), gt.w - 12, 2);
  ctx.globalAlpha = 1;
  if (locked) {
    ctx.fillStyle = COL.ink;
    for (let i = 8; i < gt.w; i += 16) ctx.fillRect(gt.x + i, gt.y, 5, gt.h);
  }
  ctx.fillStyle = COL.cream;
  ctx.fillText(w.tier === 6 ? 'EXTRACT' : 'EXIT', gt.x + gt.w / 2, gt.y - 4);
  if (w.gateMsg > 0) {
    const need = w.required - coresTaken(w);
    const msg = `NEED ${need} MORE CORE${need === 1 ? '' : 'S'}`;
    const tw = ctx.measureText(msg).width + 16;
    ctx.fillStyle = 'rgba(27,21,18,0.85)';
    ctx.fillRect(gt.x + gt.w / 2 - tw / 2, gt.y - 52, tw, 24);
    ctx.fillStyle = COL.cream;
    ctx.fillText(msg, gt.x + gt.w / 2, gt.y - 35);
  }

  // cores
  w.cores.forEach((c, i) => {
    if (c.taken) return;
    const bob = Math.sin(w.frame / 14 + i) * 3;
    const sq = Math.max(0.25, Math.abs(Math.cos(w.frame / 20 + i)));
    ctx.save();
    ctx.translate(c.x, c.y + bob);
    ctx.scale(sq, 1);
    ctx.fillStyle = COL.core;
    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 11);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COL.coreLight;
    ctx.fillRect(-2, -6, 4, 6);
    ctx.restore();
  });

  w.drones.forEach((d) => {
    if (d.alive) drawMap(ctx, Math.floor(w.frame / 4) % 2 ? DRONE.a : DRONE.b, d.x, d.y, 3, d.dir < 0);
  });

  w.debris.forEach((d) => {
    if (d.warn > 0) {
      if (Math.floor(d.warn / 6) % 2) {
        ctx.fillStyle = COL.corruptBit;
        ctx.beginPath();
        ctx.moveTo(d.x + 11, 22);
        ctx.lineTo(d.x + 1, 6);
        ctx.lineTo(d.x + 21, 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(33,27,23,0.35)';
      ctx.fillRect(d.x - 4, 9 * T - 4, 30, 4);
      return;
    }
    ctx.fillStyle = COL.ink;
    ctx.fillRect(d.x - 2, d.y - 2, 26, 26);
    ctx.fillStyle = COL.rock;
    ctx.fillRect(d.x, d.y, 22, 22);
    ctx.fillStyle = '#857b6c';
    ctx.fillRect(d.x + 4, d.y + 4, 8, 6);
  });

  const p = w.p;
  if (!(p.inv > 0 && Math.floor(p.inv / 5) % 2)) {
    const frame = !p.onGround ? HERO.jump : Math.abs(p.vx) > 0.4 ? (Math.floor(p.dist / 14) % 2 ? HERO.run1 : HERO.run2) : HERO.idle;
    drawMap(ctx, frame, Math.round(p.x - 6), Math.round(p.y - 4), 3, p.face < 0);
  }

  w.parts.forEach((q) => {
    ctx.globalAlpha = Math.min(1, q.life / 20);
    ctx.fillStyle = q.c;
    ctx.fillRect(q.x, q.y, 4, 4);
  });
  ctx.globalAlpha = 1;
  ctx.restore();

  // route strip (screen space)
  const prog = Math.min(1, p.x / gt.x);
  ctx.fillStyle = 'rgba(27,21,18,0.6)';
  ctx.fillRect(16, 14, VW - 32, 6);
  ctx.fillStyle = COL.core;
  ctx.fillRect(16, 14, (VW - 32) * prog, 6);
  ctx.fillStyle = COL.cream;
  ctx.fillRect(16 + (VW - 32) * prog - 3, 10, 6, 14);
}
