import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { journey } from '../../data/journey.js';
import { HERO, SpriteSVG } from './sprites.jsx';

/* ─────────────────────────────────────────────────────────────
   Career Campaign Map — Level 6 of Code Frontier.
   A side‑view illustrated panorama (2400 × 720 units) in three
   parallax layers. Each career stage is a real place on one winding
   road: academy → workshop & Python valley → AI observatory →
   backend outpost & deployment tower → today's camp. Selecting a
   stop pans the camera there; the map can also be dragged.
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
  blue: '#5d6f82',
  olive: '#5d6b3f',
  stone: '#bfae88',
};

export const STOPS = [
  { place: 'Learning Academy', x: 290, y: 520 },
  { place: 'Python Valley', x: 760, y: 586 },
  { place: 'AI Observatory', x: 1240, y: 322 },
  { place: 'Backend Outpost', x: 1700, y: 476 },
  { place: 'Player Camp', x: 2150, y: 516 },
];

// terrain elevation the road follows
const RIDGE = [
  [0, 560], [150, 540], [290, 520], [440, 548], [600, 566], [700, 600], [760, 586], [830, 600], [960, 540],
  [1100, 420], [1240, 322], [1380, 400], [1520, 470], [1700, 476], [1880, 500], [2020, 512], [2150, 516], [2300, 530], [2400, 540],
];

function smooth(points) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function Pine({ x, y, s = 1, fill = C.hillDark }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -64 L-16 -30 L-8 -32 L-22 -4 L22 -4 L8 -32 L16 -30 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M-2 -4 h4 v10 h-4 Z" fill={INK} />
    </g>
  );
}

/* ───────────── layers ───────────── */
function FarLayer() {
  const d = 'M0 470 L120 360 L200 410 L320 290 L420 380 L560 300 L700 400 L840 320 L980 250 L1120 330 L1260 210 L1400 320 L1560 260 L1700 360 L1860 280 L2000 370 L2160 300 L2300 380 L2400 340 V720 H0 Z';
  return (
    <g>
      <path d={d} fill={C.far} opacity="0.75" />
      <path d="M320 290 l-26 30 l14 -4 l12 10 l10 -12 l14 4 Z M980 250 l-22 28 l12 -3 l10 9 l10 -10 l12 3 Z M1260 210 l-28 36 l14 -4 l14 12 l12 -12 l16 4 Z M1860 280 l-22 26 l12 -3 l10 8 l10 -9 l12 3 Z" fill={C.snow} opacity="0.75" />
      <path d="M0 520 Q300 440 600 500 T1200 470 T1800 500 T2400 470 V720 H0 Z" fill={C.farDark} opacity="0.85" />
    </g>
  );
}

function MidLayer() {
  const pines = [80, 140, 420, 470, 900, 960, 1010, 1420, 1480, 1990, 2050, 2280, 2340];
  return (
    <g>
      <path d="M0 590 Q200 520 420 560 T860 540 T1300 520 T1760 560 T2200 540 T2400 560 V720 H0 Z" fill={C.hill} />
      {/* ruined arch between valley and observatory */}
      <g transform="translate(1020 470)" fill={C.stone} stroke={INK} strokeWidth="1.6">
        <path d="M0 70 V10 h14 v60 Z M46 70 V24 h14 v46 Z" />
        <path d="M-4 10 Q30 -24 64 24 L52 28 Q30 -6 10 14 Z" />
      </g>
      {pines.map((x, i) => (
        <Pine key={x} x={x} y={560 + (i % 3) * 8} s={0.75 + (i % 2) * 0.2} fill={C.hillDark} />
      ))}
    </g>
  );
}

function Academy() {
  return (
    <g transform="translate(200 410)">
      <path d="M-14 110 H194 V118 H-14 Z M-6 102 H186 V110 H-6 Z" fill={C.stone} stroke={INK} strokeWidth="1.6" />
      <rect x="6" y="46" width="168" height="56" fill="#d4c39d" stroke={INK} strokeWidth="1.8" />
      {[18, 52, 86, 120, 154].map((x) => (
        <g key={x}>
          <rect x={x} y="50" width="10" height="52" fill="#e3d5b5" stroke={INK} strokeWidth="1.3" />
        </g>
      ))}
      <path d="M-4 46 L90 4 L184 46 Z" fill="#c4ad84" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="90" cy="30" r="8" fill="none" stroke={INK} strokeWidth="1.4" />
      <path d="M90 4 V-26" stroke={INK} strokeWidth="2" />
      <path className="cm-anim cm-flag" d="M90 -26 L114 -20 L90 -13 Z" fill={C.brick} stroke={INK} strokeWidth="1.2" />
      <rect x="78" y="74" width="24" height="28" fill={INK} opacity="0.8" />
    </g>
  );
}

function Workshop() {
  return (
    <g transform="translate(520 470)">
      <rect x="0" y="40" width="110" height="60" fill="#cbb991" stroke={INK} strokeWidth="1.8" />
      <path d="M0 40 l22 -22 v22 l22 -22 v22 l22 -22 v22 l22 -22 v22 l22 -22 v22" fill="#a68f62" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="90" y="-8" width="14" height="30" fill={C.brick} stroke={INK} strokeWidth="1.5" />
      <g className="cm-anim cm-smoke" fill={C.cream} opacity="0.55">
        <circle cx="97" cy="-18" r="6" />
        <circle cx="104" cy="-34" r="8" />
      </g>
      {[14, 44, 74].map((x) => (
        <rect key={x} x={x} y="58" width="18" height="16" fill={C.gold} opacity="0.55" stroke={INK} strokeWidth="1.2" />
      ))}
      <g transform="translate(-6 82)">
        <g className="cm-anim cm-spin">
          <circle r="14" fill={C.gold} stroke={INK} strokeWidth="1.5" />
          {[0, 45, 90, 135].map((a) => (
            <rect key={a} x="-3" y="-18" width="6" height="36" fill={C.gold} stroke={INK} strokeWidth="1" transform={`rotate(${a})`} />
          ))}
          <circle r="5" fill={C.paper} stroke={INK} strokeWidth="1.3" />
        </g>
      </g>
    </g>
  );
}

function Valley() {
  return (
    <g>
      {/* river under the bridge */}
      <path d="M640 640 Q760 616 880 640 L900 720 H620 Z" fill={C.blue} opacity="0.85" />
      <path className="cm-anim cm-river" d="M660 650 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 M680 676 q20 -6 40 0 t40 0 t40 0 t40 0" fill="none" stroke={C.cream} strokeWidth="2" opacity="0.6" />
      {/* timber bridge */}
      <g stroke={INK} strokeWidth="1.8">
        <path d="M690 592 Q760 570 830 594" fill="none" stroke="#6e5232" strokeWidth="10" />
        <path d="M690 592 Q760 570 830 594" fill="none" />
        {[700, 722, 744, 766, 788, 810].map((x) => (
          <path key={x} d={`M${x} ${590 - Math.sin(((x - 690) / 140) * Math.PI) * 18} v34`} />
        ))}
        <path d="M690 560 Q760 538 830 562" fill="none" />
      </g>
      {/* reeds */}
      {[630, 646, 884, 900].map((x) => (
        <path key={x} d={`M${x} 640 q-4 -20 2 -34 M${x + 4} 640 q4 -16 0 -28`} stroke={C.olive} strokeWidth="2.2" fill="none" />
      ))}
    </g>
  );
}

function Observatory() {
  return (
    <g transform="translate(1240 322)">
      <rect x="-40" y="-30" width="80" height="34" fill="#d4c39d" stroke={INK} strokeWidth="1.8" />
      <path d="M-44 -30 a44 40 0 0 1 88 0 Z" fill="#c4b38c" stroke={INK} strokeWidth="1.8" />
      <path d="M-6 -68 V-30 M6 -68 V-30" stroke={INK} strokeWidth="1.2" />
      <g transform="translate(0 -44)">
        <g className="cm-anim cm-scope">
          <path d="M-4 0 L40 -30 L46 -22 L2 8 Z" fill={C.blue} stroke={INK} strokeWidth="1.5" />
        </g>
      </g>
      <rect x="-10" y="-14" width="20" height="18" fill={INK} opacity="0.8" />
      {/* contour hatching on the slope */}
      <path d="M-120 60 q20 -12 40 0 M-150 100 q24 -14 48 0 M90 70 q20 -12 40 0 M120 110 q24 -14 48 0" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.5" />
      <g className="cm-anim cm-cloud" fill={C.cream} stroke={INK} strokeWidth="1.3" opacity="0.92">
        <path d="M70 -110 q8 -16 26 -8 q12 -14 28 0 q16 0 12 14 H64 q-6 -2 6 -6 Z" />
      </g>
    </g>
  );
}

function Outpost() {
  return (
    <g transform="translate(1620 380)">
      <path d="M0 100 V20 h170 v80 Z" fill="#cbb991" stroke={INK} strokeWidth="1.8" />
      <path d="M0 20 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12" fill="none" stroke={INK} strokeWidth="1.6" />
      <rect x="-18" y="-10" width="30" height="110" fill="#d4c39d" stroke={INK} strokeWidth="1.8" />
      <path d="M-22 -10 L-3 -34 L16 -10 Z" fill={C.brick} stroke={INK} strokeWidth="1.6" />
      <path d="M70 100 V64 a15 15 0 0 1 30 0 V100 Z" fill={INK} opacity="0.85" />
      {/* server racks behind slit windows */}
      {[20, 120, 140].map((x, i) => (
        <g key={x}>
          <rect x={x} y="40" width="16" height="30" fill={INK} opacity="0.75" />
          <rect className={`cm-anim cm-led ${i % 2 ? 'cm-led--b' : ''}`} x={x + 4} y="46" width="8" height="3" fill={C.gold} />
          <rect className="cm-anim cm-led cm-led--b" x={x + 4} y="56" width="8" height="3" fill={C.olive} />
        </g>
      ))}
    </g>
  );
}

function Tower() {
  return (
    <g transform="translate(1890 500)" stroke={INK} fill="none" strokeWidth="2.4">
      <path d="M-34 0 L0 -250 L34 0" />
      <path d="M-26 -60 H26 M-19 -120 H19 M-12 -180 H12 M-26 -60 L19 -120 M26 -60 L-19 -120 M-19 -120 L12 -180 M19 -120 L-12 -180" strokeWidth="1.5" />
      <g transform="translate(0 -200)">
        <g className="cm-anim cm-dish">
          <path d="M0 0 L-30 -10 A32 32 0 0 0 -18 22 Z" fill={C.gold} strokeWidth="1.8" />
        </g>
      </g>
      <rect className="cm-anim cm-beacon" x="-5" y="-262" width="10" height="10" fill={C.brick} stroke="none" />
    </g>
  );
}

function Camp() {
  return (
    <g transform="translate(2150 516)">
      <path d="M40 0 L90 -70 L140 0 Z" fill={C.olive} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M90 -70 V0 M78 0 L90 -34 L102 0 Z" fill={INK} stroke={INK} strokeWidth="1.4" />
      <g transform="translate(-60 0)">
        <path d="M-16 0 h32" stroke="#4e3c28" strokeWidth="6" />
        <path className="cm-anim cm-fire" d="M-10 -2 L0 -30 L10 -2 Z" fill={C.gold} />
        <path className="cm-anim cm-fire cm-fire--b" d="M-5 -2 L0 -18 L5 -2 Z" fill={C.brick} />
      </g>
      <path d="M170 0 V-90" stroke={INK} strokeWidth="2.4" />
      <path className="cm-anim cm-flag" d="M170 -90 L204 -82 L170 -72 Z" fill={C.brick} stroke={INK} strokeWidth="1.3" />
    </g>
  );
}

const ROCKS = [[120, 640], [380, 660], [540, 690], [980, 640], [1180, 560], [1330, 600], [1560, 650], [1820, 640], [2060, 660], [2290, 640], [1440, 700], [260, 690]];
const FLOWERS = [[200, 548], [360, 540], [452, 556], [1030, 500], [1600, 486], [1960, 516], [2240, 532], [2380, 544]];

function NearLayer({ road }) {
  const ground = `${road} L${MW} ${MH} L0 ${MH} Z`;
  const pines = [[60, 548], [130, 540], [420, 550], [470, 556], [960, 538], [1010, 520], [1420, 430], [1470, 455], [1560, 470], [2000, 512], [2070, 514], [2320, 532], [2370, 536]];
  return (
    <g>
      <path d={ground} fill={C.ground} stroke={INK} strokeWidth="2" />
      {/* strata: darker bands following the land */}
      <path d={ground} fill={C.groundDark} transform="translate(0 70)" opacity="0.55" />
      <path d={ground} fill="#3e3020" transform="translate(0 135)" opacity="0.6" />
      <path d={ground} fill="url(#cm-soil)" />
      {/* grass lip along the surface */}
      <path d={road} fill="none" stroke={C.olive} strokeWidth="26" transform="translate(0 14)" strokeLinecap="round" />
      <path d={road} fill="none" stroke={C.hillDark} strokeWidth="3" transform="translate(0 27)" strokeDasharray="2 9" />
      {/* rocks, stones and flowers scattered in the soil */}
      {ROCKS.map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r * 1.5} ry={r} fill="#8b7656" stroke={INK} strokeWidth="1.4" />
          <path d={`M${x - r * 0.8} ${y - r * 0.2} q${r * 0.6} ${-r * 0.6} ${r * 1.2} 0`} stroke="#b5a17a" strokeWidth="1.4" fill="none" />
        </g>
      ))}
      {FLOWERS.map(([x, y], i) => (
        <g key={`f${i}`}>
          <path d={`M${x} ${y} v-12`} stroke={C.olive} strokeWidth="2" />
          <circle cx={x} cy={y - 14} r="3.5" fill={i % 2 ? C.cream : C.gold} stroke={INK} strokeWidth="1" />
        </g>
      ))}
      <Valley />
      {/* the road */}
      <path d={road} fill="none" stroke={C.road} strokeWidth="12" strokeLinecap="round" />
      <path d={road} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="10 12" opacity="0.5" transform="translate(0 2)" />
      <Academy />
      <Workshop />
      <Observatory />
      <Outpost />
      <Tower />
      <Camp />
      {pines.map(([x, y], i) => (
        <Pine key={i} x={x} y={y + 4} s={0.9 + (i % 3) * 0.15} fill={i % 2 ? C.olive : C.hillDark} />
      ))}
      {/* birds */}
      <g className="cm-anim cm-birds" fill="none" stroke={INK} strokeWidth="1.8">
        <path d="M980 180 q7 -7 13 0 q6 -7 13 0" />
        <path d="M1020 160 q6 -6 11 0 q5 -6 11 0" />
      </g>
    </g>
  );
}

/* ───────────── component ───────────── */
export default function CareerMap() {
  const { reduceMotion } = useMode();
  const [sel, setSel] = useState(journey.length - 1);
  const vp = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 560 });
  const camX = useMotionValue(0);
  const cam = useSpring(camX, reduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 70, damping: 20, mass: 0.9 });
  const farX = useTransform(cam, (v) => v * 0.35);
  const midX = useTransform(cam, (v) => v * 0.65);
  const drag = useRef(null);

  const scale = size.h / MH;
  const mapW = MW * scale;
  const clampX = useCallback((x) => Math.min(0, Math.max(size.w - mapW, x)), [size.w, mapW]);
  const focus = useCallback((i) => camX.set(clampX(size.w / 2 - STOPS[i].x * scale)), [camX, clampX, size.w, scale]);

  useEffect(() => {
    const el = vp.current;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => focus(sel), [focus, sel]);

  const go = (i) => setSel(Math.max(0, Math.min(journey.length - 1, i)));
  const road = useMemo(() => smooth(RIDGE), []);
  const step = journey[sel];
  const stop = STOPS[sel];
  const pct = (x, y) => ({ left: `${(x / MW) * 100}%`, top: `${(y / MH) * 100}%` });

  const onDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    drag.current = { x: e.clientX, start: camX.get(), moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    camX.set(clampX(drag.current.start + dx));
  };
  const onUp = () => {
    drag.current = null;
  };

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
        aria-label="Career campaign map. Use the stops or arrow keys to travel."
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
            </defs>
            <NearLayer road={road} />
          </svg>

          {STOPS.map((s, i) => (
            <button
              key={s.place}
              type="button"
              className={`cmap__stop ${i === sel ? 'is-on' : ''} ${journey[i].current ? 'is-now' : ''}`}
              style={pct(s.x, s.y)}
              onClick={() => go(i)}
              aria-pressed={i === sel}
              aria-label={`${s.place}: ${journey[i].title}, ${journey[i].period}`}
            >
              <span className="cmap__post" aria-hidden="true" />
              <span className="cmap__sign">
                <small>{journey[i].period}</small>
                {s.place}
              </span>
            </button>
          ))}

          <motion.div
            className="cmap__player"
            initial={false}
            animate={pct(stop.x - 36, stop.y)}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 45, damping: 14 }}
            aria-hidden="true"
          >
            <SpriteSVG map={HERO.idle} px={3} className="cmap__sprite" />
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
              Stop {sel + 1} of {journey.length} · {stop.place}
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
              <h4>Achievements</h4>
              <ul className="cmap__ach">
                {step.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Technologies learned</h4>
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
