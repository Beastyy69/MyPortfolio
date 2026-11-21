import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { profile } from '../../data/profile.js';

/* ─────────────────────────────────────────────────────────────
   "Scattered identities become one signature." — the opening film.

   The SVG covers the whole viewport (viewBox = window size in px), and
   the HS is drawn in a group translated to the exact screen centre, so
   the composition stays centred on any screen.

   0–12%    12 named identity nodes (AIML Developer, Python Engineer,
            Backend Builder, Web Developer, Coder, Gamer, Biker, Roaster,
            Creator, Builder, Problem Solver, Learner) appear across the
            screen, each with its own collision-aware label; 12 tiny
            unnamed particles are clearly smaller background texture
   14–40%   related identities connect (Python Engineer ↔ Backend Builder…)
   36–64%   convergence: every node travels on a calm curve to its anchor
            on the HS; each label follows its node and dissolves into a
            small fragment on the way
   60–68%   the precise letter skeleton draws
   67–82%   the skeleton thickens (mask) and merges into solid,
            variable-width letters: H pillars, bridge, then the S
   80–86%   brass joins and a sage hairline settle inside the mark
   84–100%  the mark holds and breathes; name, role, status line
   exit     a few connection paths extend outward into the hero and
            the background lifts away

   Progress follows time but is gated by real asset loading. Plays once
   per browser session; reduced motion gets a short fade of the final mark.
   ───────────────────────────────────────────────────────────── */

const SEEN_KEY = 'hs-intro-seen';
const DURATION = 5000; // ms for the film on a normal connection
const ASSET_CAP = 6500; // never wait longer than this for assets
const SKIP_AFTER = 1000;

const clamp = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const soft = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const NAME = profile.name;

/* ── the monogram, in local units (≈ 372 × 330, centred on 0,0) ── */

// S centreline (Catmull–Rom through these stations)
const S_PTS = [
  [168, -112], [132, -146], [78, -150], [36, -122], [32, -76], [66, -40], [110, -14],
  [150, 16], [174, 62], [162, 114], [118, 148], [62, 150], [18, 120],
];
// H: two pillars and a bridge with a gentle rise‑to‑fall slant that echoes the S
const PILLAR_W = 52;
const PILLARS = [
  { x: -180, y: -150, w: PILLAR_W, h: 300 },
  { x: -60, y: -150, w: PILLAR_W, h: 300 },
];
const BRIDGE = 'M-132 -24 L-56 -10 L-56 24 L-132 10 Z';

function crPoint(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  const g = (a, b, c, d) => 0.5 * (-a + c + 2 * (2 * a - 5 * b + 4 * c - d) * t + 3 * (-a + 3 * b - 3 * c + d) * t2);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), g(p0[0], p1[0], p2[0], p3[0]), g(p0[1], p1[1], p2[1], p3[1])];
}

// variable-width S outline: thick verticals and spine, finer horizontals
function buildS() {
  const left = [];
  const right = [];
  const n = S_PTS.length;
  const STEPS = 14;
  for (let i = 0; i < n - 1; i++) {
    const p0 = S_PTS[i - 1] ?? S_PTS[i];
    const p1 = S_PTS[i];
    const p2 = S_PTS[i + 1];
    const p3 = S_PTS[i + 2] ?? p2;
    for (let k = 0; k <= STEPS; k++) {
      if (i > 0 && k === 0) continue;
      const t = k / STEPS;
      const [x, y, dx, dy] = crPoint(p0, p1, p2, p3, t);
      const len = Math.hypot(dx, dy) || 1;
      const u = (i + t) / (n - 1);
      const vertical = Math.pow(Math.abs(dy / len), 0.85);
      const spine = Math.exp(-Math.pow((u - 0.5) / 0.12, 2));
      const taper = 0.84 + 0.16 * Math.min(1, Math.min(u, 1 - u) / 0.08);
      const w = (24 + 32 * vertical + 9 * spine) * taper;
      const nx = (-dy / len) * (w / 2);
      const ny = (dx / len) * (w / 2);
      left.push([x + nx, y + ny]);
      right.push([x - nx, y - ny]);
    }
  }
  const pts = [...left, ...right.reverse()];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
}
function smoothPath(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const S_SHAPE = buildS();
const S_LINE = smoothPath(S_PTS);
// visual centre of the mark (measured: H −180…−8, S reaches ≈ 203; ≈ ±162 tall)
const MARK_CX = 11.5;
const MARK_W = 372;
const MARK_H = 330;

// skeleton strokes, in the order they thicken (left → right)
const SKELETON = [
  { id: 'hl', d: 'M-154 -150 L-154 150', w: 66, t: [0.67, 0.73] },
  { id: 'hb', d: 'M-140 -8.5 L-48 8.5', w: 58, t: [0.69, 0.75] },
  { id: 'hr', d: 'M-34 -150 L-34 150', w: 66, t: [0.71, 0.77] },
  { id: 's', d: S_LINE, w: 84, t: [0.73, 0.82], along: true },
];

// 24 anchors on the skeleton — where the scattered nodes land
const ANCHORS = [
  [-154, -150], [-154, -50], [-154, 50], [-154, 150], //   0–3   left pillar
  [-34, -150], [-34, -50], [-34, 50], [-34, 150], //       4–7   right pillar
  [-128, -6], [-94, 0], [-60, 6], //                    8–10  bridge (joins + middle)
  ...S_PTS, //                                             11–23 the S
];
/* 12 named identity nodes form the HS's key points (corners, joins, curve
   stations); 12 tiny unnamed particles fill the remaining anchors. */
const MAJOR = [0, 3, 4, 7, 8, 10, 11, 13, 15, 17, 19, 23];
const MINOR = ANCHORS.map((_, i) => i).filter((i) => !MAJOR.includes(i));
// placed around the screen in this order, so related identities sit near each other
const IDENTITIES = ['AIML Developer', 'Python Engineer', 'Backend Builder', 'Web Developer', 'Coder', 'Gamer', 'Biker', 'Roaster', 'Creator', 'Builder', 'Problem Solver', 'Learner'];
// meaningful connections only (indices into IDENTITIES)
const RELATIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], // AIML → Python → Backend → Web → Coder → Gamer → Biker
  [7, 8], [8, 9], [9, 10], [10, 11], [11, 0], // Roaster → Creator → Builder → Problem Solver → Learner → AIML
  [4, 10], // Coder ↔ Problem Solver
];
const ID_STYLE = IDENTITIES.map((_, i) => (i % 3 === 1 ? 'brass' : i % 3 === 2 ? 'sage' : 'ivory'));
const LABEL_CW = 8.6; // ≈ px per character at 11px mono with 0.2em tracking

function useViewport() {
  const [v, setV] = useState(() => ({ W: window.innerWidth, H: window.innerHeight }));
  useEffect(() => {
    const r = () => setV({ W: window.innerWidth, H: window.innerHeight });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  return v;
}

// size of the mark on screen: 280–420px wide on desktop, ~62% of a phone
function markScale(W, H) {
  const target = W < 700 ? W * 0.62 : Math.min(420, Math.max(280, W * 0.21));
  return Math.min(target / MARK_W, (H * 0.36) / MARK_H);
}

function useGeometry(W, H) {
  return useMemo(() => {
    const s = markScale(W, H);
    const cx = W / 2 - MARK_CX * s;
    const cy = H / 2;
    const toScreen = ([x, y]) => [cx + x * s, cy + y * s];
    const targets = ANCHORS.map(toScreen);

    const ang = ([x, y]) => Math.atan2(y - H / 2, x - W / 2);
    const top = Math.max(64, H * 0.11);
    const clampPt = ([x, y]) => [Math.min(W - 40, Math.max(40, x)), Math.min(H - 50, Math.max(top, y))];

    // identity nodes: one per angular sector around the screen, at varied depths —
    // scattered, not a ring
    const idStart = IDENTITIES.map((_, i) => {
      const a = ((-160 + i * 30 + (hash(i + 3) - 0.5) * 14) * Math.PI) / 180;
      const r = 0.5 + 0.45 * hash(i + 29);
      return clampPt([W / 2 + Math.cos(a) * W * 0.47 * r, H / 2 + Math.sin(a) * H * 0.45 * r]);
    });
    // tiny particles: a loose jittered grid, centre kept clear
    const minorStart = MINOR.map((_, i) => {
      let x = W * (0.06 + 0.88 * hash(i + 101));
      let y = H * (0.12 + 0.8 * hash(i + 151));
      const dx = x - W / 2;
      const dy = y - H / 2;
      const clear = Math.hypot(dx / W, dy / H);
      if (clear < 0.22) {
        const k = 0.22 / (clear || 0.01);
        x = W / 2 + dx * k;
        y = H / 2 + dy * k;
      }
      return clampPt([x, y]);
    });

    // pair each group with its anchors by angle, so paths converge without crossing
    const pair = (starts, anchorIds) => {
      const so = starts.map((pt, i) => [i, ang(pt)]).sort((a, b) => a[1] - b[1]);
      const ao = anchorIds.map((ai) => [ai, ang(targets[ai])]).sort((a, b) => a[1] - b[1]);
      const out = {};
      ao.forEach(([ai], k) => (out[ai] = so[k][0]));
      return out; // anchor → start index
    };
    const idFor = pair(idStart, MAJOR);
    const minorFor = pair(minorStart, MINOR);

    const nodes = ANCHORS.map((_, ai) => {
      const major = MAJOR.includes(ai);
      const idx = major ? idFor[ai] : minorFor[ai];
      const a = major ? idStart[idx] : minorStart[idx];
      const b = targets[ai];
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      // a gentle, consistent swirl toward the centre
      const ctrl = [(a[0] + b[0]) / 2 + (-(b[1] - a[1]) / (dist || 1)) * dist * 0.22, (a[1] + b[1]) / 2 + ((b[0] - a[0]) / (dist || 1)) * dist * 0.22];
      return {
        ai,
        major,
        id: major ? idx : null,
        a,
        b,
        ctrl,
        dist,
        appear: major ? 0.01 + idx * 0.007 : 0.04 + hash(ai + 7) * 0.08,
        drift: hash(ai + 13) * Math.PI * 2,
      };
    });
    const maxD = Math.max(...nodes.map((n) => n.dist));
    nodes.forEach((n) => {
      // the farthest nodes leave first; everyone arrives by ~63%
      n.go = 0.36 + (1 - n.dist / maxD) * 0.1 + hash(n.ai * 9.7) * 0.02;
      n.land = n.go + 0.15;
    });
    const byIdentity = [];
    nodes.forEach((n) => n.major && (byIdentity[n.id] = n));

    // collision-aware labels: try right, left, above, below; never overlap another
    // label or node, never leave the viewport
    const boxes = [];
    const PAD = 7; // room for the gentle drift
    const nodeBoxes = nodes.map((n) => [n.a[0] - 6, n.a[1] - 6, n.a[0] + 6, n.a[1] + 6]);
    const hit = (b, list) => list.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const labels = IDENTITIES.map((text, i) => {
      const n = byIdentity[i];
      const w = text.length * LABEL_CW;
      const [x, y] = n.a;
      const tries = [
        { dx: 12, dy: 4, anchor: 'start', box: [x + 10, y - 9, x + 12 + w, y + 7] },
        { dx: -12, dy: 4, anchor: 'end', box: [x - 12 - w, y - 9, x - 10, y + 7] },
        { dx: 0, dy: -13, anchor: 'middle', box: [x - w / 2, y - 26, x + w / 2, y - 9] },
        { dx: 0, dy: 22, anchor: 'middle', box: [x - w / 2, y + 9, x + w / 2, y + 26] },
      ];
      const inView = (b) => b[0] >= 8 && b[2] <= W - 8 && b[1] >= top - 8 && b[3] <= H - 8;
      const grow = (b) => [b[0] - PAD, b[1] - PAD / 2, b[2] + PAD, b[3] + PAD / 2];
      const others = nodeBoxes.filter((_, k) => nodes[k] !== n);
      let pick = tries.find((t) => inView(t.box) && !hit(grow(t.box), boxes) && !hit(t.box, others));
      if (!pick) pick = tries.find((t) => inView(t.box)) ?? tries[0];
      boxes.push(grow(pick.box));
      return { text, ...pick };
    });
    const fragments = Array.from({ length: 6 }, (_, i) => {
      const x = W * (0.1 + 0.8 * hash(i + 71));
      const y = H * (0.12 + 0.76 * hash(i + 91));
      const a = hash(i + 5) * Math.PI;
      return { x, y, dx: Math.cos(a) * 18, dy: Math.sin(a) * 18 };
    });
    // paths that extend outward into the hero on exit
    const rays = [0, 3, 4, 7, 11, 23].map((ai) => {
      const [x, y] = targets[ai];
      const dx = x - W / 2;
      const dy = y - H / 2;
      const k = Math.max(W, H) / (Math.hypot(dx, dy) || 1);
      return `M${x.toFixed(1)} ${y.toFixed(1)} L${(W / 2 + dx * k).toFixed(1)} ${(H / 2 + dy * k).toFixed(1)}`;
    });
    return { s, cx, cy, nodes, fragments, rays, byIdentity, labels };
  }, [W, H]);
}

const qpt = (n, k) => {
  const u = 1 - k;
  return [u * u * n.a[0] + 2 * u * k * n.ctrl[0] + k * k * n.b[0], u * u * n.a[1] + 2 * u * k * n.ctrl[1] + k * k * n.b[1]];
};

function Film({ p, still }) {
  const { W, H } = useViewport();
  const g = useGeometry(W, H);

  const pos = g.nodes.map((n, i) => {
    const k = ease(seg(p, n.go, n.land));
    const sway = still ? 0 : (1 - k) * 5;
    const [x, y] = qpt(n, k);
    return [x + Math.cos(p * 7 + n.drift) * sway, y + Math.sin(p * 6 + n.drift) * sway, k, i];
  });
  const shown = g.nodes.map((n) => soft(seg(p, n.appear, n.appear + 0.06)));
  const skeleton = ease(seg(p, 0.6, 0.68));
  const settle = ease(seg(p, 0.8, 0.86));
  const nodeFade = 1 - seg(p, 0.74, 0.84);
  const breathing = p >= 0.86 && !still;

  return (
    <motion.svg className="sig__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" exit={{ opacity: 0, transition: { delay: 0.3, duration: 0.55 } }}>
      {/* line fragments: quiet texture of the scattered phase */}
      {g.fragments.map((f, i) => {
        const o = soft(seg(p, 0.03 + i * 0.012, 0.1 + i * 0.012)) * (1 - seg(p, 0.3, 0.42));
        return o > 0 ? <line key={`f${i}`} x1={f.x - f.dx} y1={f.y - f.dy} x2={f.x + f.dx} y2={f.y + f.dy} className="sig__frag-line" style={{ opacity: o }} /> : null;
      })}

      {/* connections between related identities, then pulled inward */}
      {RELATIONS.map(([ia, ib], i) => {
        const A = g.byIdentity[ia];
        const B = g.byIdentity[ib];
        const t = ease(seg(p, 0.14 + i * 0.016, 0.26 + i * 0.016));
        const o = Math.min(shown[A.ai], shown[B.ai]) * (1 - seg(p, 0.6, 0.68));
        if (t <= 0 || o <= 0) return null;
        const pa = pos[A.ai];
        const pb = pos[B.ai];
        return <line key={`e${i}`} x1={pa[0]} y1={pa[1]} x2={pa[0] + (pb[0] - pa[0]) * t} y2={pa[1] + (pb[1] - pa[1]) * t} className="sig__edge" style={{ opacity: o }} />;
      })}

      {/* exit: a few paths reach outward and become the hero's environment */}
      {g.rays.map((d, i) => (
        <motion.path
          key={`r${i}`}
          d={d}
          className="sig__ray"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 0, opacity: 0 }}
          exit={{ pathLength: 1, opacity: [0, 0.8, 0], transition: { duration: 0.9, delay: i * 0.03, ease: [0.65, 0, 0.35, 1] } }}
        />
      ))}

      {/* the mark, exactly centred */}
      <g transform={`translate(${g.cx.toFixed(1)} ${g.cy.toFixed(1)}) scale(${g.s.toFixed(4)})`}>
        <motion.g exit={{ scale: 1.08, opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}>
          <g className={`sig__mono ${breathing ? 'is-breathing' : ''}`}>
            <defs>
              <filter id="hs-depth" filterUnits="userSpaceOnUse" x="-260" y="-240" width="520" height="500">
                <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#04060a" floodOpacity="0.6" />
              </filter>
              <filter id="hs-grain" filterUnits="userSpaceOnUse" x="-220" y="-190" width="440" height="380">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.28  0 0 0 0.2 0" result="g" />
                <feComposite in="g" in2="SourceGraphic" operator="in" result="gi" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="gi" />
                </feMerge>
              </filter>
              <linearGradient id="hs-ivory" gradientUnits="userSpaceOnUse" x1="0" y1="-165" x2="0" y2="165">
                <stop offset="0" stopColor="#f7f2e8" />
                <stop offset="1" stopColor="#e3dac8" />
              </linearGradient>
              {/* the skeleton thickens into the letters: strokes in a mask over the solid forms */}
              <mask id="hs-form" maskUnits="userSpaceOnUse" x="-260" y="-240" width="520" height="500">
                {SKELETON.map((k) => {
                  const t = ease(seg(p, k.t[0], k.t[1]));
                  if (t <= 0) return null;
                  return (
                    <path
                      key={k.id}
                      d={k.d}
                      pathLength={k.along ? 1 : undefined}
                      fill="none"
                      stroke="#fff"
                      strokeWidth={lerp(1, k.w, t)}
                      style={k.along ? { strokeDasharray: '1 1', strokeDashoffset: 1 - Math.min(1, t * 1.25) } : undefined}
                    />
                  );
                })}
              </mask>
            </defs>

            {/* precise skeleton */}
            {skeleton > 0 &&
              SKELETON.map((k) => (
              <path
                key={`sk-${k.id}`}
                d={k.d}
                pathLength="1"
                className="sig__skel"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: '1 1', strokeDashoffset: 1 - skeleton, opacity: 1 - seg(p, 0.78, 0.84) }}
              />
            ))}

            {/* solid letters, revealed by the thickening skeleton */}
            <g filter="url(#hs-depth)">
              <g className="sig__letters" mask="url(#hs-form)" filter="url(#hs-grain)">
                {PILLARS.map((r, i) => (
                  <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="7" className="sig__letter" />
                ))}
                <path d={BRIDGE} className="sig__letter" />
                <path d={S_SHAPE} className="sig__letter" />
              </g>
            </g>

            {/* restrained details inside selected joins */}
            {settle > 0 && (
              <g style={{ opacity: settle }}>
                <path d={S_LINE} pathLength="1" className="sig__hair" style={{ strokeDasharray: '0 0.38 0.24 1' }} />
                {[ANCHORS[8], ANCHORS[10]].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="7.5" className="sig__join" />
                    <circle cx={x} cy={y} r="3.4" className="sig__join-dot" />
                  </g>
                ))}
                <rect x="-158" y="-138" width="8" height="8" className="sig__join-sq" />
              </g>
            )}
          </g>
        </motion.g>
      </g>

      {/* nodes (screen space): named identities, and tiny unnamed particles */}
      {pos.map(([x, y, k, i]) => {
        const n = g.nodes[i];
        const o = shown[i] * nodeFade;
        if (o <= 0) return null;
        if (!n.major) return <circle key={`n${i}`} cx={x} cy={y} r="1.6" className="sig__n is-dust" style={{ opacity: o * 0.5 }} />;
        const st = ID_STYLE[n.id];
        return st === 'sage' ? (
          <rect key={`n${i}`} x={x - 3.5} y={y - 3.5} width="7" height="7" className="sig__n is-sage" style={{ opacity: o }} />
        ) : (
          <circle key={`n${i}`} cx={x} cy={y} r={(st === 'ivory' ? 4 : 3.4) * lerp(1, 1.15, k)} className={`sig__n ${st === 'brass' ? 'is-brass' : ''}`} style={{ opacity: o }} />
        );
      })}
      {/* every identity's label rides with its node and dissolves on the way in */}
      {g.labels.map((l, j) => {
        const n = g.byIdentity[j];
        const [x, y, k] = pos[n.ai];
        const appear = soft(seg(p, n.appear + 0.02, n.appear + 0.08));
        const dissolve = seg(k, 0, 0.55);
        const o = appear * (1 - dissolve);
        if (o <= 0) return null;
        return (
          <text
            key={l.text}
            x={x + l.dx * (1 - dissolve * 0.5)}
            y={y + l.dy * (1 - dissolve * 0.5)}
            textAnchor={l.anchor}
            className="sig__word-id"
            style={{ opacity: o * 0.78, fontSize: `${lerp(11, 7, dissolve)}px`, letterSpacing: `${lerp(0.2, 0.04, dissolve)}em` }}
          >
            {l.text.toUpperCase()}
          </text>
        );
      })}
    </motion.svg>
  );
}

function Wordmark({ p }) {
  const name = soft(seg(p, 0.84, 0.9));
  const role = soft(seg(p, 0.88, 0.93));
  return (
    <motion.div className="sig__word" exit={{ y: -30, opacity: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }}>
      <p className="sig__name" style={{ opacity: name, transform: `translateY(${(1 - name) * 12}px)` }}>
        {NAME.toUpperCase()}
      </p>
      <p className="sig__role" style={{ opacity: role, transform: `translateY(${(1 - role) * 8}px)` }}>
        AIML Developer <i>·</i> Backend Engineer <i>·</i> Builder
      </p>
    </motion.div>
  );
}

export default function Preloader({ onDone }) {
  const { reduceMotion } = useMode();
  const [mode] = useState(() => {
    if (import.meta.env.DEV && new URLSearchParams(location.search).get('intro')) return 'film';
    if (reduceMotion) return 'reduced';
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1' ? 'seen' : 'film';
    } catch {
      return 'film';
    }
  });
  const [p, setP] = useState(mode === 'film' ? 0 : 1);
  const [waiting, setWaiting] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const finished = useRef(false);
  const startedAt = useRef(performance.now());
  const { W, H } = useViewport();
  const markH = MARK_H * markScale(W, H);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    doneRef.current();
  };

  // short paths: already seen this session, or reduced motion (a brief look at the final mark)
  useEffect(() => {
    if (mode === 'film') return undefined;
    const t = setTimeout(finish, mode === 'seen' ? 120 : 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // the film: time‑driven progress, gated by real asset loading
  useEffect(() => {
    if (mode !== 'film') return undefined;
    // dev only: ?intro=hold keeps the film on screen; ?intro=60 jumps to and holds 60%
    const hold = import.meta.env.DEV ? new URLSearchParams(location.search).get('intro') : null;
    const sources = [profile.photo].filter(Boolean);
    const total = sources.length + 1;
    let loaded = 0;
    const bump = () => (loaded = Math.min(total, loaded + 1));
    sources.forEach((src) => {
      const im = new Image();
      im.onload = bump;
      im.onerror = bump;
      im.src = src;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(bump, bump);

    let raf = 0;
    let shown = 0;
    let doneAt = 0;
    const tick = (now) => {
      const elapsed = now - startedAt.current;
      const time = clamp(elapsed / DURATION);
      const assets = elapsed > ASSET_CAP ? 1 : loaded / total;
      // time alone can carry the film to 72%; the rest waits for real assets
      const gate = assets >= 1 ? 1 : 0.72 + 0.26 * assets;
      const target = Math.min(time, gate);
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0015) shown = target;
      if (hold && hold !== 'hold') shown = Number(hold) / 100; // dev: jump straight to the frame
      setP(shown);
      setWaiting(time > gate + 0.02);
      if (shown >= 1 && !doneAt) doneAt = now;
      if (doneAt && now - doneAt > 220 && !hold) return finish();
      raf = requestAnimationFrame(tick);
      return undefined;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // skip after the first second: click, Enter or Escape
  useEffect(() => {
    if (mode !== 'film') return undefined;
    const key = (e) => {
      if ((e.key === 'Enter' || e.key === 'Escape') && performance.now() - startedAt.current > SKIP_AFTER) finish();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onClick = () => performance.now() - startedAt.current > SKIP_AFTER && finish();
  const pct = Math.round(p * 100);
  const intro = soft(seg(p, 0.02, 0.1)) * (1 - seg(p, 0.5, 0.6));
  const ready = soft(seg(p, 0.9, 0.96));

  if (mode === 'seen') return <motion.div className="sig sig--quick" exit={{ opacity: 0, transition: { duration: 0.3 } }} />;

  return (
    <motion.div
      className={`sig ${mode === 'reduced' ? 'sig--reduced' : ''}`}
      style={{ '--mh': `${markH.toFixed(1)}px` }}
      onClick={onClick}
      initial={mode === 'reduced' ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={
        mode === 'reduced'
          ? { opacity: 0, transition: { duration: 0.3 } }
          : { backgroundColor: 'rgba(12, 16, 24, 0)', transition: { duration: 0.8, delay: 0.2, ease: [0.65, 0, 0.35, 1] } }
      }
      transition={{ duration: mode === 'reduced' ? 0.4 : 0.25 }}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${NAME}'s portfolio, ${pct} percent`}
    >
      {mode === 'film' && (
        <motion.p className="sig__intro" style={{ opacity: intro }} exit={{ opacity: 0 }}>
          SCATTERED IDENTITIES <i>·</i> ONE SIGNATURE
        </motion.p>
      )}
      <Film p={mode === 'film' ? p : 1} still={mode !== 'film'} />
      <Wordmark p={mode === 'film' ? p : 1} />
      {mode === 'film' && (
        <motion.div className="sig__ready" style={{ opacity: ready }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
          <p>{waiting ? 'Loading the last pieces…' : 'Building intelligent systems.'}</p>
          <div className="sig__line" aria-hidden="true">
            <i style={{ transform: `scaleX(${p})` }} />
          </div>
          <span className="sig__pct">{pct}%</span>
        </motion.div>
      )}
      {mode === 'film' && (
        <motion.button type="button" className="sig__skip" onClick={finish} style={{ opacity: p > 0.2 ? 0.55 : 0 }} exit={{ opacity: 0 }} tabIndex={p > 0.2 ? 0 : -1}>
          Skip
        </motion.button>
      )}
    </motion.div>
  );
}
