import { useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Animated ambient backgrounds for the AI/ML Project Ecosystem —
   one original scene per project, drawn from what the project does.
   Palette: ink, sage hairlines, brass accents, ivory. No glow.
   Every scene is static when `still` is true (reduced motion).
   ───────────────────────────────────────────────────────────── */

const SAGE = 'rgba(167,185,163,0.55)';
const SAGE_FAINT = 'rgba(167,185,163,0.22)';
const BRASS = '#b89b68';
const IVORY = '#f4f0e8';
const loop = (duration, delay = 0) => ({ duration, delay, repeat: Infinity, ease: 'easeInOut' });

/* Hologram With AI — a projection chamber: a projector base, a light cone,
   a rotating wireframe shape and a tracked hand skeleton. */
const CUBE = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
const CUBE_EDGES = [];
CUBE.forEach((a, i) => CUBE.forEach((b, j) => j > i && a.filter((v, k) => v !== b[k]).length === 1 && CUBE_EDGES.push([i, j])));
const HAND = [
  [0, 0], [-14, -10], [-24, -22], [-30, -34], [-34, -44], // thumb
  [-10, -34], [-12, -52], [-13, -64], [-14, -74], // index
  [0, -36], [0, -56], [0, -69], [0, -80], // middle
  [10, -34], [12, -52], [13, -63], [14, -72], // ring
  [19, -28], [23, -42], [25, -52], [27, -60], // pinky
];
const HAND_BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];

function Hologram({ still }) {
  const [a, setA] = useState(0.6);
  useAnimationFrame((t) => {
    if (!still) setA(t / 2600);
  });
  const pts = CUBE.map(([x, y, z]) => {
    const cx = x * Math.cos(a) - z * Math.sin(a);
    const cz = x * Math.sin(a) + z * Math.cos(a);
    const cy = y * Math.cos(0.45) - cz * Math.sin(0.45);
    return [300 + cx * 48, 150 + cy * 48];
  });
  return (
    <>
      <defs>
        <linearGradient id="amb-cone" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={IVORY} stopOpacity="0.16" />
          <stop offset="1" stopColor={IVORY} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M262 330 L170 60 L430 60 L338 330 Z" fill="url(#amb-cone)" />
      <ellipse cx="300" cy="334" rx="70" ry="12" fill="none" stroke={BRASS} strokeWidth="1.4" />
      <ellipse cx="300" cy="334" rx="40" ry="6" fill={BRASS} opacity="0.35" />
      {CUBE_EDGES.map(([i, j], k) => (
        <line key={k} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={IVORY} strokeOpacity="0.7" strokeWidth="1.3" />
      ))}
      {pts.map(([x, y], k) => (
        <circle key={`v${k}`} cx={x} cy={y} r="2.6" fill={BRASS} />
      ))}
      <motion.g animate={still ? undefined : { x: [0, 10, 0], y: [0, -6, 0] }} transition={loop(6)} transform="translate(470 270)">
        {HAND_BONES.map(([i, j], k) => (
          <line key={k} x1={HAND[i][0]} y1={HAND[i][1]} x2={HAND[j][0]} y2={HAND[j][1]} stroke={SAGE} strokeWidth="1.3" />
        ))}
        {HAND.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 4 === 0 ? 2.8 : 2} fill={k % 4 === 0 ? BRASS : IVORY} />
        ))}
        <path d="M-46 -92 h12 M-46 -92 v12 M38 -92 h-12 M38 -92 v12 M-46 14 h12 M-46 14 v-12 M38 14 h-12 M38 14 v-12" stroke={BRASS} strokeWidth="1.3" fill="none" />
      </motion.g>
      <motion.line x1="130" x2="470" y1="0" y2="0" stroke={SAGE_FAINT} strokeWidth="1" animate={still ? undefined : { y1: [70, 320, 70], y2: [70, 320, 70] }} transition={loop(7)} />
    </>
  );
}

/* Mail Mind Pro — messages arrive and are routed into sorted lanes. */
const LANES = [
  { y: 110, label: 'ACTION' },
  { y: 200, label: 'MEETING' },
  { y: 290, label: 'INFO' },
];
function MailMind({ still }) {
  return (
    <>
      {LANES.map((l, i) => (
        <g key={l.label}>
          <path d={`M60 200 C200 200 220 ${l.y} 330 ${l.y} L540 ${l.y}`} fill="none" stroke={SAGE_FAINT} strokeWidth="1.2" />
          <text x="548" y={l.y + 4} fill={IVORY} opacity="0.5" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2" textAnchor="end">
            {l.label}
          </text>
          <motion.g
            initial={{ x: 60, y: 200, opacity: 0 }}
            animate={still ? { x: 420, y: l.y, opacity: 1 } : { x: [60, 200, 330, 500], y: [200, 200, l.y, l.y], opacity: [0, 1, 1, 0] }}
            transition={still ? { duration: 0 } : { duration: 4.2, delay: i * 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="-14" y="-9" width="28" height="18" rx="2" fill="none" stroke={i === 0 ? BRASS : IVORY} strokeWidth="1.3" />
            <path d="M-14 -9 L0 2 L14 -9" fill="none" stroke={i === 0 ? BRASS : IVORY} strokeWidth="1.3" />
          </motion.g>
        </g>
      ))}
      <circle cx="210" cy="200" r="16" fill="none" stroke={BRASS} strokeWidth="1.3" />
      <circle cx="210" cy="200" r="4" fill={BRASS} />
    </>
  );
}

/* RugRadar — a calm radar sweep with risk signals appearing. */
const BLIPS = [
  [370, 150, 0.4], [250, 240, 1.6], [340, 280, 2.6], [230, 140, 3.4], [400, 230, 4.4],
];
function Radar({ still }) {
  return (
    <>
      {[50, 100, 150].map((r) => (
        <circle key={r} cx="300" cy="200" r={r} fill="none" stroke={SAGE_FAINT} strokeWidth="1" />
      ))}
      <path d="M150 200 H450 M300 50 V350" stroke={SAGE_FAINT} strokeWidth="1" />
      <motion.g style={{ originX: '300px', originY: '200px' }} animate={still ? undefined : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
        <path d="M300 200 L450 200 A150 150 0 0 0 406 94 Z" fill={IVORY} opacity="0.07" />
        <line x1="300" y1="200" x2="450" y2="200" stroke={IVORY} strokeOpacity="0.5" strokeWidth="1.2" />
      </motion.g>
      {BLIPS.map(([x, y, d], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 2 ? 5 : 3.4}
          fill={i === 2 ? BRASS : IVORY}
          initial={{ opacity: still ? 0.8 : 0 }}
          animate={still ? undefined : { opacity: [0, 1, 0.2, 0] }}
          transition={{ duration: 6, delay: d, repeat: Infinity, times: [0, 0.08, 0.6, 1] }}
        />
      ))}
      <rect x="326" y="268" width="28" height="24" fill="none" stroke={BRASS} strokeWidth="1.2" />
    </>
  );
}

/* RoastMe AI — speech bubbles rise while a heat gauge swings. */
function Roast({ still }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={i}
          initial={{ x: 150 + i * 90, y: 330, opacity: 0 }}
          animate={still ? { y: 120 + i * 40, opacity: 0.8 } : { y: [330, 90], opacity: [0, 1, 1, 0] }}
          transition={still ? { duration: 0 } : { duration: 5, delay: i * 1.2, repeat: Infinity, ease: 'easeOut', opacity: { duration: 5, delay: i * 1.2, repeat: Infinity, times: [0, 0.15, 0.7, 1] } }}
        >
          <rect x="-34" y="-16" width="68" height="30" rx="14" fill="none" stroke={i % 2 ? BRASS : IVORY} strokeOpacity="0.8" strokeWidth="1.3" />
          <path d="M-12 14 l-6 10 l14 -10" fill="none" stroke={i % 2 ? BRASS : IVORY} strokeOpacity="0.8" strokeWidth="1.3" />
          <path d="M-18 -2 h36 M-18 5 h22" stroke={SAGE} strokeWidth="1.2" />
        </motion.g>
      ))}
      <path d="M440 330 A70 70 0 0 1 580 330" fill="none" stroke={SAGE_FAINT} strokeWidth="6" />
      <path d="M440 330 A70 70 0 0 1 510 260" fill="none" stroke={BRASS} strokeOpacity="0.6" strokeWidth="6" />
      <motion.line x1="510" y1="330" x2="510" y2="276" stroke={IVORY} strokeWidth="2" style={{ originX: '510px', originY: '330px' }} animate={still ? { rotate: -20 } : { rotate: [-60, 30, -10, 50, -60] }} transition={loop(7)} />
      <circle cx="510" cy="330" r="5" fill={BRASS} />
    </>
  );
}

/* CineSense — a film strip drifts past; a picked film links to similar ones. */
function Cinema({ still }) {
  const frames = Array.from({ length: 9 }, (_, i) => i);
  const recs = [[430, 110], [470, 210], [420, 300]];
  return (
    <>
      <motion.g animate={still ? undefined : { x: [0, -90] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}>
        <rect x="0" y="40" width="720" height="70" fill="none" stroke={SAGE_FAINT} strokeWidth="1.2" />
        {frames.map((i) => (
          <g key={i}>
            <rect x={14 + i * 90} y="52" width="70" height="46" rx="2" fill={i === 3 ? BRASS : IVORY} opacity={i === 3 ? 0.3 : 0.07} stroke={IVORY} strokeOpacity="0.3" />
            <rect x={4 + i * 90} y="43" width="6" height="5" fill={SAGE_FAINT} />
            <rect x={4 + i * 90} y="102" width="6" height="5" fill={SAGE_FAINT} />
          </g>
        ))}
      </motion.g>
      <circle cx="220" cy="230" r="9" fill={BRASS} />
      {recs.map(([x, y], i) => (
        <g key={i}>
          <motion.path
            d={`M220 230 C300 230 ${x - 80} ${y} ${x} ${y}`}
            fill="none"
            stroke={SAGE}
            strokeWidth="1.3"
            initial={{ pathLength: still ? 1 : 0 }}
            animate={still ? undefined : { pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 5, delay: i * 0.4, repeat: Infinity, times: [0, 0.35, 0.8, 1] }}
          />
          <circle cx={x} cy={y} r="6" fill="none" stroke={IVORY} strokeWidth="1.4" />
          <rect x={x + 14} y={y - 12} width="34" height="24" rx="2" fill="none" stroke={IVORY} strokeOpacity="0.3" />
        </g>
      ))}
    </>
  );
}

/* MultiDiscord Bot — a hub sends messages out to server channels. */
const CHANNELS = [
  [140, 110, '#music'], [460, 100, '#mod'], [520, 250, '#giveaway'], [300, 340, '#welcome'], [90, 270, '#chat'],
];
function Hub({ still }) {
  return (
    <>
      {CHANNELS.map(([x, y, label], i) => (
        <g key={label}>
          <line x1="300" y1="210" x2={x} y2={y} stroke={SAGE_FAINT} strokeWidth="1.2" />
          <circle cx={x} cy={y} r="18" fill="none" stroke={IVORY} strokeOpacity="0.5" strokeWidth="1.3" />
          <text x={x} y={y + 36} textAnchor="middle" fill={IVORY} opacity="0.5" fontSize="10" fontFamily="var(--font-mono)">
            {label}
          </text>
          <motion.circle
            r="4"
            fill={BRASS}
            initial={{ cx: 300, cy: 210, opacity: 0 }}
            animate={still ? { cx: x, cy: y, opacity: 0.8 } : { cx: [300, x], cy: [210, y], opacity: [0, 1, 1, 0] }}
            transition={still ? { duration: 0 } : { duration: 2.4, delay: i * 0.55, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
          />
        </g>
      ))}
      <rect x="270" y="180" width="60" height="60" rx="14" fill="none" stroke={BRASS} strokeWidth="1.6" />
      <path d="M287 205 h26 M287 216 h18" stroke={IVORY} strokeWidth="1.4" />
    </>
  );
}

/* Scheduler AI — a timetable fills in while a face‑recognition frame scans. */
function Scheduler({ still }) {
  const cells = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) cells.push([c, r]);
  return (
    <>
      {cells.map(([c, r], i) => (
        <motion.rect
          key={i}
          x={70 + c * 62}
          y={70 + r * 52}
          width="54"
          height="44"
          rx="3"
          fill={(c + r * 2) % 5 === 0 ? BRASS : IVORY}
          stroke={SAGE_FAINT}
          initial={{ fillOpacity: still ? ((c + r) % 3 === 0 ? 0.18 : 0.04) : 0 }}
          animate={still ? undefined : { fillOpacity: [0, (c + r * 2) % 5 === 0 ? 0.35 : 0.1, 0.1, 0] }}
          transition={{ duration: 6, delay: (r * 6 + c) * 0.09, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
        />
      ))}
      <motion.g animate={still ? undefined : { x: [0, 60, 20, 0], y: [0, 20, -10, 0] }} transition={loop(8)}>
        <circle cx="500" cy="190" r="30" fill="none" stroke={IVORY} strokeOpacity="0.6" strokeWidth="1.3" />
        <circle cx="490" cy="184" r="2.4" fill={IVORY} />
        <circle cx="510" cy="184" r="2.4" fill={IVORY} />
        <path d="M490 200 q10 7 20 0" fill="none" stroke={IVORY} strokeWidth="1.3" />
        <path d="M458 148 h14 M458 148 v14 M542 148 h-14 M542 148 v14 M458 232 h14 M458 232 v-14 M542 232 h-14 M542 232 v-14" stroke={BRASS} strokeWidth="1.5" fill="none" />
      </motion.g>
    </>
  );
}

const SCENES = { hologram: Hologram, mailmind: MailMind, rugradar: Radar, roastme: Roast, cinesense: Cinema, discordbot: Hub, scheduler: Scheduler };

export default function ProjectAmbient({ id, still = false, className = '' }) {
  const Scene = SCENES[id];
  if (!Scene) return null;
  return (
    <svg className={`amb ${className}`} viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="600" height="400" fill="url(#amb-grid)" />
      <defs>
        <pattern id="amb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="rgba(244,240,232,0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <Scene still={still} />
    </svg>
  );
}
