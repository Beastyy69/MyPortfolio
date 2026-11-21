import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { journey } from '../../data/journey.js';
import { HERO, SpriteSVG } from './sprites.jsx';

/* ─────────────────────────────────────────────────────────────
   Campaign Trail — the learning journey as a side‑view adventure map
   (2400 × 720 units, three parallax layers).

   One trail joins every stage:
     2020  Foundation Village          (first quest)
     2024  Algorithm Mountain          (the C programming trail climbs it)
           …a timber bridge over the river…
     2025  Builder Workshop            (React Town · Unreal Garage)
     2026  AI Observatory · Backend Outpost

   Movement is logical: the explorer follows the SAME curve the road and
   bridge are drawn from (arc‑length sampled), so the feet always stay on
   the visible trail. Height follows the terrain; climbs are slower than
   descents; the sprite faces its direction of travel and leans a little
   with the slope; the walk cycle only plays while travelling; every
   building's door sits on the trail, so the explorer stops at the
   entrance instead of walking through walls.
   ───────────────────────────────────────────────────────────── */

const MW = 2400;
const MH = 720;
const INK = '#2a2119';
const C = {
  far: '#5b6874',
  farDark: '#4b5762',
  snow: '#d9d2bd',
  hill: '#56643f',
  hillDark: '#47532f',
  ground: '#6a5236',
  groundDark: '#4e3c28',
  road: '#c9b48a',
  cream: '#e9dcc0',
  paper: '#d8c9a3',
  brick: '#8a3d33',
  gold: '#b8954a',
  water: '#5d6f82',
  olive: '#5d6b3f',
  stone: '#bfae88',
  wood: '#6e5232',
};

// the trail (road surface); the bridge deck spans 1260 → 1420
const ROAD = [
  [-40, 560], [150, 552], [300, 545], [430, 548], [540, 528], [640, 474], [740, 404], [830, 346], [920, 318],
  [1000, 330], [1080, 384], [1160, 452], [1260, 500], [1340, 500], [1420, 500], [1500, 507], [1650, 514],
  [1770, 504], [1870, 466], [1970, 420], [2060, 394], [2140, 388], [2260, 398], [2440, 412],
];
// the ground follows the road, except where it drops into the river bed
const GROUND = [
  [-40, 560], [150, 552], [300, 545], [430, 548], [540, 528], [640, 474], [740, 404], [830, 346], [920, 318],
  [1000, 330], [1080, 384], [1160, 452], [1250, 504], [1280, 560], [1310, 632], [1370, 636], [1400, 566], [1430, 508],
  [1500, 507], [1650, 514], [1770, 504], [1870, 466], [1970, 420], [2060, 394], [2140, 388], [2260, 398], [2440, 412],
];
const BRIDGE = [1250, 1432];
// where each stage stands on the trail (x); y comes from the trail itself
const STOP_X = [300, 920, 1650, 2140];

function crSample(points, perSeg = 40) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}
const pathOf = (pts) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;

// arc‑length table of the trail, so travel speed is even along the curve
function buildTrail() {
  const pts = crSample(ROAD);
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const at = (s) => {
    const L = Math.max(0, Math.min(len[len.length - 1], s));
    let lo = 0;
    let hi = len.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (len[mid] < L) lo = mid;
      else hi = mid;
    }
    const k = (L - len[lo]) / (len[hi] - len[lo] || 1);
    const [x0, y0] = pts[lo];
    const [x1, y1] = pts[hi];
    return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, slope: (y1 - y0) / (x1 - x0 || 1) };
  };
  const sAtX = (x) => {
    let best = 0;
    pts.forEach((p, i) => {
      if (Math.abs(p[0] - x) < Math.abs(pts[best][0] - x)) best = i;
    });
    return len[best];
  };
  return { road: pathOf(pts), at, sAtX };
}

function Pine({ x, y, s = 1, fill = C.hillDark }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -64 L-16 -30 L-8 -32 L-22 -4 L22 -4 L8 -32 L16 -30 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M-2 -4 h4 v10 h-4 Z" fill={INK} />
    </g>
  );
}

/* ───────────── background layers (behind the trail, never crossed) ───────────── */
function FarLayer() {
  const d = 'M0 470 L120 360 L200 410 L320 300 L420 380 L560 290 L700 330 L840 210 L980 170 L1120 260 L1260 300 L1400 330 L1560 280 L1700 360 L1860 280 L2000 320 L2160 250 L2300 330 L2400 300 V720 H0 Z';
  return (
    <g>
      <path d={d} fill={C.far} opacity="0.75" />
      <path d="M840 210 l-24 28 l12 -3 l10 9 l10 -10 l12 3 Z M980 170 l-28 34 l14 -4 l14 12 l12 -12 l16 4 Z M2160 250 l-22 26 l12 -3 l10 8 l10 -9 l12 3 Z" fill={C.snow} opacity="0.75" />
      <path d="M0 520 Q300 460 600 500 T1200 480 T1800 500 T2400 470 V720 H0 Z" fill={C.farDark} opacity="0.8" />
    </g>
  );
}
function MidLayer() {
  const pines = [80, 140, 470, 1180, 1230, 1480, 1540, 1990, 2050, 2280, 2340];
  return (
    <g>
      <path d="M0 600 Q200 540 420 570 T860 560 T1300 560 T1760 570 T2200 540 T2400 560 V720 H0 Z" fill={C.hill} opacity="0.85" />
      {pines.map((x, i) => (
        <Pine key={x} x={x} y={570 + (i % 3) * 8} s={0.7 + (i % 2) * 0.2} />
      ))}
    </g>
  );
}

/* ───────────── places (doors on the trail) ───────────── */
function Village({ y }) {
  // 2020 — Foundation Village: small houses and a community notice board
  return (
    <g transform={`translate(300 ${y})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
      <g transform="translate(-170 0)">
        <rect x="0" y="-56" width="70" height="56" fill="#d4c39d" />
        <path d="M-6 -56 L35 -88 L76 -56 Z" fill={C.brick} />
        <rect x="26" y="-30" width="18" height="30" fill={INK} />
        <rect x="8" y="-46" width="12" height="10" fill={C.gold} opacity="0.7" />
      </g>
      {/* community hall — its door is on the trail at the stop */}
      <rect x="-50" y="-72" width="100" height="72" fill="#d8c9a3" />
      <path d="M-58 -72 L0 -108 L58 -72 Z" fill={C.olive} />
      <path d="M-12 0 V-34 h24 V0" fill={INK} />
      <rect x="-40" y="-56" width="16" height="14" fill={C.gold} opacity="0.7" />
      <rect x="24" y="-56" width="16" height="14" fill={C.gold} opacity="0.7" />
      {/* notice board: "learn together" sheets */}
      <g transform="translate(78 0)">
        <path d="M0 0 V-52 M40 0 V-52" />
        <rect x="-6" y="-60" width="52" height="30" fill={C.paper} />
        <path d="M2 -52 h14 M2 -46 h20 M24 -52 h14 M24 -44 h10" strokeWidth="1.2" />
      </g>
    </g>
  );
}

function MountainTrail({ at }) {
  // 2024 — Algorithm Mountain: trail markers for C, DSA and DAA on the climb, a summit hut
  const markers = [
    [610, 'C'],
    [720, 'DSA'],
    [820, 'DAA'],
  ];
  const top = at(920);
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      {/* switchback hints carved into the slope */}
      <path d="M560 560 q40 -14 80 -6 M650 520 q40 -16 70 -4 M740 470 q30 -14 60 -2" fill="none" opacity="0.45" />
      {markers.map(([x, label]) => {
        const p = at(x);
        return (
          <g key={label} transform={`translate(${x + 26} ${p.y + 2})`}>
            <path d="M0 0 V-46" strokeWidth="2.2" />
            <path d="M0 -46 h30 l-6 9 l6 9 h-30 Z" fill={C.cream} />
            <text x="13" y="-33" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill={INK} stroke="none">
              {label}
            </text>
          </g>
        );
      })}
      {/* summit hut — door on the trail at the stop */}
      <g transform={`translate(920 ${top.y})`}>
        <rect x="-34" y="-50" width="68" height="50" fill="#cbb991" />
        <path d="M-42 -50 L0 -84 L42 -50 Z" fill="#a68f62" />
        <path d="M-10 0 V-28 h20 V0" fill={INK} />
        <path d="M24 -84 V-120" strokeWidth="2.2" />
        <path className="cm-anim cm-flag" d="M24 -120 L50 -113 L24 -105 Z" fill={C.brick} />
        <text x="37" y="-110" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" fill={C.cream} stroke="none">
          C
        </text>
      </g>
    </g>
  );
}

function River() {
  return (
    <g>
      <path d="M1262 520 Q1300 640 1340 640 Q1380 640 1420 520 V720 H1262 Z" fill={C.water} opacity="0.9" />
      <path className="cm-anim cm-river" d="M1280 600 h120 M1290 624 h100 M1300 650 h80" fill="none" stroke={C.cream} strokeWidth="2" opacity="0.55" />
    </g>
  );
}

function Bridge({ at }) {
  // timber bridge: the deck IS the trail between the two banks
  const [x0, x1] = BRIDGE;
  const deck = [];
  for (let x = x0; x <= x1; x += 6) deck.push([x, at(x).y]);
  const d = pathOf(deck);
  const posts = [];
  for (let x = x0 + 12; x < x1; x += 30) posts.push([x, at(x).y]);
  return (
    <g stroke={INK} strokeWidth="1.8">
      {posts.map(([x, y]) => (
        <path key={`p${x}`} d={`M${x} ${y + 4} V${660}`} stroke={C.wood} strokeWidth="6" />
      ))}
      <path d={d} fill="none" stroke={C.wood} strokeWidth="12" strokeLinecap="round" />
      <path d={d} fill="none" strokeWidth="1.4" transform="translate(0 6)" />
      {/* railing */}
      <path d={d} fill="none" transform="translate(0 -30)" />
      {posts.map(([x, y]) => (
        <path key={`r${x}`} d={`M${x} ${y - 4} V${y - 30}`} strokeWidth="1.6" />
      ))}
    </g>
  );
}

function Workshop({ y }) {
  // 2025 — Builder Workshop with React Town's sign and the Unreal Garage (a race car inside)
  return (
    <g transform={`translate(1650 ${y})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
      {/* workshop: door on the trail */}
      <rect x="-60" y="-70" width="120" height="70" fill="#cbb991" />
      <path d="M-60 -70 l24 -24 v24 l24 -24 v24 l24 -24 v24 l24 -24 v24 l24 -24 v24" fill="#a68f62" />
      <path d="M-12 0 V-36 h24 V0" fill={INK} />
      <g transform="translate(-38 -40)" className="cm-anim cm-spin">
        <circle r="10" fill={C.gold} />
        <circle r="4" fill={C.paper} />
      </g>
      <rect x="30" y="-52" width="20" height="16" fill={C.gold} opacity="0.6" />
      {/* React Town sign */}
      <g transform="translate(-150 0)">
        <path d="M0 0 V-58 M56 0 V-58" />
        <rect x="-8" y="-82" width="72" height="26" fill={C.cream} />
        <text x="28" y="-65" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill={INK} stroke="none">
          REACT TOWN
        </text>
      </g>
      {/* Unreal Garage: open door, a race car inside */}
      <g transform="translate(110 0)">
        <rect x="0" y="-62" width="110" height="62" fill="#b9a780" />
        <path d="M-6 -62 h122 v-10 h-122 Z" fill={C.brick} />
        <text x="55" y="-64.5" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700" fill={C.cream} stroke="none">
          UNREAL GARAGE
        </text>
        <rect x="12" y="-46" width="86" height="46" fill={INK} opacity="0.85" />
        <path d="M24 -12 q6 -16 26 -16 h14 q10 0 20 10 v8 h-60 Z" fill={C.brick} strokeWidth="1.4" />
        <circle cx="36" cy="-6" r="6" fill={C.paper} />
        <circle cx="76" cy="-6" r="6" fill={C.paper} />
      </g>
    </g>
  );
}

function ObservatoryOutpost({ y }) {
  // 2026 — AI Observatory (door at the stop) with the Backend Outpost beside it
  return (
    <g transform={`translate(2140 ${y})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
      <rect x="-48" y="-54" width="96" height="54" fill="#d4c39d" />
      <path d="M-50 -54 a50 46 0 0 1 100 0 Z" fill="#c4b38c" />
      <path d="M-6 -98 V-54 M6 -98 V-54" strokeWidth="1.2" />
      <g transform="translate(0 -72)">
        <g className="cm-anim cm-scope">
          <path d="M-4 0 L42 -30 L48 -22 L2 8 Z" fill="#5d6f82" strokeWidth="1.5" />
        </g>
      </g>
      <path d="M-12 0 V-30 h24 V0" fill={INK} />
      {/* Backend Outpost: server racks behind slit windows */}
      <g transform="translate(90 0)">
        <rect x="0" y="-66" width="120" height="66" fill="#cbb991" />
        <path d="M0 -66 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10" fill="none" strokeWidth="1.4" />
        {[14, 46, 78].map((x, i) => (
          <g key={x}>
            <rect x={x} y="-54" width="22" height="34" fill={INK} opacity="0.8" />
            <rect className={`cm-anim cm-led ${i % 2 ? 'cm-led--b' : ''}`} x={x + 6} y="-48" width="10" height="3" fill={C.gold} stroke="none" />
            <rect className="cm-anim cm-led cm-led--b" x={x + 6} y="-38" width="10" height="3" fill={C.olive} stroke="none" />
          </g>
        ))}
        <text x="60" y="-80" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" fill={INK} stroke="none">
          BACKEND OUTPOST
        </text>
      </g>
    </g>
  );
}

const ROCKS = [[120, 640, 10], [380, 660, 12], [980, 600, 9], [1180, 560, 8], [1560, 650, 11], [1820, 640, 10], [2060, 660, 12], [2290, 640, 9], [260, 690, 8]];

function NearLayer({ trail }) {
  const groundPts = crSample(GROUND);
  const ground = `${pathOf(groundPts)} L${MW + 40} ${MH} L-40 ${MH} Z`;
  const y = (x) => trail.at(trail.sAtX(x)).y;
  const pines = [[60, 548], [130, 540], [470, 548], [1110, 420], [1500, 506], [1960, 422], [2350, 412]];
  return (
    <g>
      <path d={ground} fill={C.ground} stroke={INK} strokeWidth="2" />
      <path d={ground} fill={C.groundDark} transform="translate(0 70)" opacity="0.55" />
      <path d={ground} fill="#3e3020" transform="translate(0 135)" opacity="0.6" />
      <path d={ground} fill="url(#cm-soil)" />
      {ROCKS.map(([x, yy, r], i) => (
        <ellipse key={i} cx={x} cy={yy} rx={r * 1.5} ry={r} fill="#8b7656" stroke={INK} strokeWidth="1.4" />
      ))}
      <River />
      {/* places stand on the trail, behind it */}
      <Village y={y(300)} />
      <MountainTrail at={(x) => trail.at(trail.sAtX(x))} />
      <Workshop y={y(1650)} />
      <ObservatoryOutpost y={y(2140)} />
      {pines.map(([x, yy], i) => (
        <Pine key={i} x={x} y={yy + 4} s={0.9 + (i % 3) * 0.12} fill={i % 2 ? C.olive : C.hillDark} />
      ))}
      {/* grass lip and the trail itself (drawn from the same curve the explorer walks) */}
      <path d={trail.road} fill="none" stroke={C.olive} strokeWidth="22" strokeLinecap="round" transform="translate(0 12)" clipPath="url(#cm-banks)" />
      <path d={trail.road} fill="none" stroke={C.road} strokeWidth="12" strokeLinecap="round" clipPath="url(#cm-banks)" />
      <path d={trail.road} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="10 12" opacity="0.5" transform="translate(0 2)" clipPath="url(#cm-banks)" />
      <Bridge at={(x) => trail.at(trail.sAtX(x))} />
      <g className="cm-anim cm-birds" fill="none" stroke={INK} strokeWidth="1.8">
        <path d="M1080 200 q7 -7 13 0 q6 -7 13 0" />
        <path d="M1120 180 q6 -6 11 0 q5 -6 11 0" />
      </g>
    </g>
  );
}

/* ───────────── component ───────────── */
const SPEED = 300; // map units per second on flat ground

export default function CareerMap() {
  const { reduceMotion } = useMode();
  const [sel, setSel] = useState(journey.length - 1);
  const [walking, setWalking] = useState(false);
  const [frame, setFrame] = useState(0);
  const [facing, setFacing] = useState(1);
  const [lean, setLean] = useState(0);
  const [arrived, setArrived] = useState(true);
  const trail = useMemo(buildTrail, []);
  const stopS = useMemo(() => STOP_X.map((x) => trail.sAtX(x)), [trail]);

  const vp = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 560 });
  const camX = useMotionValue(0);
  const cam = useSpring(camX, reduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 70, damping: 20, mass: 0.9 });
  const farX = useTransform(cam, (v) => v * 0.35);
  const midX = useTransform(cam, (v) => v * 0.65);
  const drag = useRef(null);

  // the explorer's position along the trail (arc length)
  const sRef = useRef(stopS[journey.length - 1]);
  const px = useMotionValue(trail.at(sRef.current).x);
  const py = useMotionValue(trail.at(sRef.current).y);
  const left = useTransform(px, (v) => `${(v / MW) * 100}%`);
  const top = useTransform(py, (v) => `${(v / MH) * 100}%`);

  const scale = size.h / MH;
  const mapW = MW * scale;
  const clampX = useCallback((x) => Math.min(0, Math.max(size.w - mapW, x)), [size.w, mapW]);
  const follow = useCallback((x) => camX.set(clampX(size.w / 2 - x * scale)), [camX, clampX, size.w, scale]);

  useEffect(() => {
    const el = vp.current;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => follow(px.get()), [follow, px]);

  // travel along the trail to the selected stop
  useEffect(() => {
    const target = stopS[sel];
    const put = (s) => {
      const p = trail.at(s);
      px.set(p.x);
      py.set(p.y);
      return p;
    };
    if (reduceMotion) {
      sRef.current = target;
      follow(put(target).x);
      setArrived(true);
      return undefined;
    }
    if (Math.abs(target - sRef.current) < 1) {
      setArrived(true);
      return undefined;
    }
    setArrived(false);
    setWalking(true);
    let raf = 0;
    let last = performance.now();
    let stepClock = 0;
    const dir = Math.sign(target - sRef.current);
    setFacing(dir);
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const here = trail.at(sRef.current);
      // climbing (y decreasing in the walking direction) is slower; descending a bit faster
      const climb = -here.slope * dir;
      const speed = SPEED * (climb > 0 ? Math.max(0.5, 1 - climb * 0.9) : Math.min(1.25, 1 + -climb * 0.4));
      let s = sRef.current + dir * speed * dt;
      if ((dir > 0 && s >= target) || (dir < 0 && s <= target)) s = target;
      sRef.current = s;
      const p = put(s);
      follow(p.x);
      setLean(Math.max(-12, Math.min(12, Math.atan(p.slope) * (180 / Math.PI) * 0.5 * dir)));
      stepClock += dt;
      if (stepClock > 0.13) {
        stepClock = 0;
        setFrame((f) => (f + 1) % 2);
      }
      if (s === target) {
        setWalking(false);
        setLean(0);
        setArrived(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sel, stopS, trail, reduceMotion, follow, px, py]);

  const go = (i) => setSel(Math.max(0, Math.min(journey.length - 1, i)));
  const step = journey[sel];
  const pct = (x, y) => ({ left: `${(x / MW) * 100}%`, top: `${(y / MH) * 100}%` });

  const onDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    drag.current = { x: e.clientX, start: camX.get() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    camX.set(clampX(drag.current.start + (e.clientX - drag.current.x)));
  };
  const onUp = () => {
    drag.current = null;
  };

  const sprite = walking ? (frame ? HERO.run1 : HERO.run2) : HERO.idle;

  return (
    <div className="cmap">
      <div
        className={`cmap__viewport ${reduceMotion ? 'is-still' : ''}`}
        ref={vp}
        data-drag
        data-cursor-retro="Drag map"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(sel + 1);
          if (e.key === 'ArrowLeft') go(sel - 1);
        }}
        role="group"
        aria-label="Learning journey campaign map. Use the stops or arrow keys to travel along the trail."
      >
        <div className="cmap__sky" aria-hidden="true">
          <i className="cmap__sun" />
          <i className="cmap__cloud" />
          <i className="cmap__cloud cmap__cloud--2" />
        </div>
        <motion.svg className="cmap__layer" style={{ x: farX, width: mapW }} viewBox={`0 0 ${MW} ${MH}`} aria-hidden="true">
          <FarLayer />
        </motion.svg>
        <motion.svg className="cmap__layer" style={{ x: midX, width: mapW }} viewBox={`0 0 ${MW} ${MH}`} aria-hidden="true">
          <MidLayer />
        </motion.svg>
        <motion.div className="cmap__near" style={{ x: cam, width: mapW }}>
          <svg className="cmap__layer cmap__layer--near" viewBox={`0 0 ${MW} ${MH}`} aria-hidden="true">
            <defs>
              <pattern id="cm-soil" width="60" height="40" patternUnits="userSpaceOnUse">
                <path d="M6 12 h10 M30 28 h8 M44 8 h6" stroke="#4e3c28" strokeWidth="3" />
              </pattern>
              {/* the trail's ground surface is hidden over the river: there the bridge deck carries it */}
              <clipPath id="cm-banks">
                <rect x="-100" y="0" width={BRIDGE[0] + 100} height={MH} />
                <rect x={BRIDGE[1]} y="0" width={MW} height={MH} />
              </clipPath>
            </defs>
            <NearLayer trail={trail} />
          </svg>

          {/* signposts stand just behind each door, clear of the explorer */}
          {STOP_X.map((x, i) => {
            const y = trail.at(stopS[i]).y;
            const j = journey[i];
            return (
              <button
                key={j.place}
                type="button"
                className={`cmap__stop ${i === sel ? 'is-on' : ''} ${j.current ? 'is-now' : ''}`}
                style={pct(x + 46, y)}
                onClick={() => go(i)}
                aria-pressed={i === sel}
                aria-label={`${j.period} — ${j.place}: ${j.title}`}
              >
                <span className="cmap__post" aria-hidden="true" />
                <span className="cmap__sign">
                  <small>{j.period}</small>
                  {j.place}
                  {i === sel && arrived && <em className="cmap__quest">{j.quest}</em>}
                </span>
              </button>
            );
          })}

          {/* the explorer: always on the trail */}
          <motion.div className="cmap__player" style={{ left, top }} aria-hidden="true">
            <div className="cmap__body" style={{ transform: `scaleX(${facing}) rotate(${lean * facing}deg)` }}>
              <SpriteSVG map={sprite} px={3} className="cmap__sprite" />
            </div>
          </motion.div>
        </motion.div>
        <p className="cmap__hint" aria-hidden="true">
          Drag to explore · select a destination
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={sel}
          className="cmap__panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <header className="cmap__head">
            <p className="cmap__kicker">
              Stage {sel + 1} of {journey.length} · {step.place} · {step.quest}
            </p>
            <h3>{step.title}</h3>
            <p className="cmap__period">
              {step.period}
              {step.current && <span className="cmap__now">Current camp</span>}
            </p>
          </header>
          <p className="cmap__text">{step.text}</p>
          <div className="cmap__cols">
            <div>
              <h4>Quest log</h4>
              <ul className="cmap__ach">
                {step.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Skills gained</h4>
              <ul className="cmap__tech">
                {step.loot.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="cmap__nav">
            <button type="button" onClick={() => go(sel - 1)} disabled={sel === 0}>
              ← Previous stop
            </button>
            <ol className="cmap__dots" aria-hidden="true">
              {journey.map((j, i) => (
                <li key={j.level} className={i === sel ? 'is-on' : i < sel ? 'is-past' : ''} />
              ))}
            </ol>
            <button type="button" onClick={() => go(sel + 1)} disabled={sel === journey.length - 1}>
              Next stop →
            </button>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
