import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView } from 'framer-motion';

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

/* Hologram With AI — the app's real interaction, as a short loop:
   a tracked hand moves left/right and forward/back; while the hand is open
   the 3D model ROTATES with it and follows its position; a thumb‑index
   PINCH switches to SCALE, so moving the hand forward/back resizes the
   model; releasing the pinch selects the NEXT MODEL (cube → pyramid →
   octahedron), like the app's 3D Models mode. Kalman‑style easing keeps
   the object calm. */
const poly = (verts) => {
  const edges = [];
  verts.forEach((a, i) =>
    verts.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      edges.push([i, j, d]);
    }),
  );
  const min = Math.min(...edges.map((e) => e[2]));
  return { verts, edges: edges.filter((e) => e[2] < min * 1.05).map(([i, j]) => [i, j]) };
};
const MODELS = [
  { name: 'CUBE', ...poly([-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])))) },
  {
    name: 'PYRAMID',
    verts: [[-1, 0.8, -1], [1, 0.8, -1], [1, 0.8, 1], [-1, 0.8, 1], [0, -1.2, 0]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]],
  },
  { name: 'OCTAHEDRON', ...poly([[1.3, 0, 0], [-1.3, 0, 0], [0, 1.3, 0], [0, -1.3, 0], [0, 0, 1.3], [0, 0, -1.3]]) },
];
const HAND = [
  [0, 0], [-14, -10], [-24, -22], [-30, -34], [-34, -44], // thumb (tip 4)
  [-10, -34], [-12, -52], [-13, -64], [-14, -74], // index (tip 8)
  [0, -36], [0, -56], [0, -69], [0, -80], // middle
  [10, -34], [12, -52], [13, -63], [14, -72], // ring
  [19, -28], [23, -42], [25, -52], [27, -60], // pinky
];
const HAND_BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];
const CYCLE = 12; // seconds per model
const smooth = (x) => x * x * (3 - 2 * x);
const win = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

function holoState(sec) {
  const c = sec % CYCLE;
  const model = Math.floor(sec / CYCLE) % MODELS.length;
  const sway = Math.sin((sec / 6) * Math.PI * 2); // left / right
  const depth = Math.sin((sec / 4) * Math.PI * 2); // forward / back
  const pinch = smooth(win(c, 5.4, 6.1)) * (1 - smooth(win(c, 9.8, 10.4))); // 0 open → 1 pinched
  const swap = smooth(win(c, 10.6, 11.4)); // fade to the next model
  return { c, model, sway, depth, pinch, swap };
}

function Hologram({ still }) {
  const [sec, setSec] = useState(1.5);
  const ref = useRef({ angle: 0.6, scale: 1, shift: 0 });
  useAnimationFrame((t, delta) => {
    if (still) return;
    const s = t / 1000;
    const st = holoState(s);
    const k = ref.current;
    const dt = Math.min(0.05, delta / 1000);
    // rotate mode: the model turns with the hand; scale mode: it resizes with depth
    const rotating = st.pinch < 0.5;
    const targetAngle = k.angle + (rotating ? 0.9 * Math.cos((s / 6) * Math.PI * 2) * dt * 2.2 + dt * 0.25 : dt * 0.08);
    k.angle = targetAngle;
    const targetScale = 1 + st.pinch * 0.24 * st.depth;
    k.scale += (targetScale - k.scale) * Math.min(1, dt * 6); // Kalman‑like easing
    const targetShift = rotating ? st.sway * 26 : k.shift;
    k.shift += (targetShift - k.shift) * Math.min(1, dt * 4);
    setSec(s);
  });

  const st = holoState(sec);
  const { angle, scale, shift } = ref.current;
  const project = (m) =>
    m.verts.map(([x, y, z]) => {
      const cx = x * Math.cos(angle) - z * Math.sin(angle);
      const cz = x * Math.sin(angle) + z * Math.cos(angle);
      const cy = y * Math.cos(0.42) - cz * Math.sin(0.42);
      return [250 + shift + cx * 46 * scale, 168 + cy * 46 * scale];
    });
  const cur = MODELS[st.model];
  const next = MODELS[(st.model + 1) % MODELS.length];
  const shapes = [
    { m: cur, o: 1 - st.swap },
    { m: next, o: st.swap },
  ].filter((x) => x.o > 0.01);

  // the hand: moves left/right, forward/back (scale), and pinches
  const hx = 420 + st.sway * 30;
  const hy = 268 - st.depth * 6;
  const hs = 1 + st.depth * 0.08;
  const pinchPt = [(HAND[4][0] + HAND[8][0]) / 2 + 4, (HAND[4][1] + HAND[8][1]) / 2 - 6];
  const hand = HAND.map(([x, y], i) => {
    if (i === 4 || i === 3 || i === 8 || i === 7) {
      const w = i === 4 || i === 8 ? 1 : 0.55;
      return [lerpN(x, pinchPt[0], st.pinch * w), lerpN(y, pinchPt[1], st.pinch * w)];
    }
    return [x, y];
  });
  const mode = st.pinch > 0.5 ? 'PINCH · SCALE' : st.c > 10.2 ? 'NEXT MODEL' : 'OPEN HAND · ROTATE';

  return (
    <>
      <defs>
        <linearGradient id="amb-cone" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={IVORY} stopOpacity="0.15" />
          <stop offset="1" stopColor={IVORY} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* projector and beam, breathing softly */}
      <motion.path d="M218 318 L140 50 L360 50 L282 318 Z" fill="url(#amb-cone)" animate={still ? undefined : { opacity: [0.75, 1, 0.75] }} transition={loop(4)} />
      <ellipse cx="250" cy="322" rx="64" ry="11" fill="none" stroke={BRASS} strokeWidth="1.4" />
      <ellipse cx="250" cy="322" rx="36" ry="5.5" fill={BRASS} opacity="0.35" />

      {/* the controlled model */}
      {shapes.map(({ m, o }) => {
        const pts = project(m);
        return (
          <g key={m.name} opacity={o}>
            {m.edges.map(([i, j], k) => (
              <line key={k} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={IVORY} strokeOpacity="0.75" strokeWidth="1.3" />
            ))}
            {pts.map(([x, y], k) => (
              <circle key={`v${k}`} cx={x} cy={y} r="2.6" fill={BRASS} />
            ))}
          </g>
        );
      })}

      {/* control link: hand → model */}
      <path d={`M${hx - 40} ${hy - 52} Q${(hx + 250 + shift) / 2} ${120} ${282 + shift} ${150}`} fill="none" stroke={BRASS} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 5" />

      {/* tracked hand inside its detection box */}
      <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)}) scale(${hs.toFixed(3)})`}>
        {HAND_BONES.map(([i, j], k) => (
          <line key={k} x1={hand[i][0]} y1={hand[i][1]} x2={hand[j][0]} y2={hand[j][1]} stroke={SAGE} strokeWidth="1.3" />
        ))}
        {hand.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 4 === 0 ? 2.8 : 2} fill={k % 4 === 0 ? BRASS : IVORY} />
        ))}
        {st.pinch > 0.05 && (
          <>
            <line x1={hand[4][0]} y1={hand[4][1]} x2={hand[8][0]} y2={hand[8][1]} stroke={BRASS} strokeWidth="1.4" />
            <circle cx={pinchPt[0]} cy={pinchPt[1]} r={4 + 6 * (1 - st.pinch)} fill="none" stroke={BRASS} strokeOpacity={st.pinch} />
          </>
        )}
        <path d="M-50 -96 h12 M-50 -96 v12 M42 -96 h-12 M42 -96 v12 M-50 16 h12 M-50 16 v-12 M42 16 h-12 M42 16 v-12" stroke={BRASS} strokeWidth="1.3" fill="none" />
      </g>

      {/* status, like the app's on‑screen HUD */}
      <text x="372" y="128" fill={st.pinch > 0.5 ? BRASS : IVORY} opacity="0.75" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.5">
        {mode}
      </text>
      <text x="372" y="112" fill={IVORY} opacity="0.4" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1.5">
        MODEL · {(st.swap > 0.5 ? next : cur).name}
      </text>
    </>
  );
}
const lerpN = (a, b, t) => a + (b - a) * t;

/* Mail Mind Pro — the inbox dashboard: emails arrive, Gemini tags each one
   with intent, urgency and sentiment and writes a summary + reply options. */
const MAILS = [
  { tags: [['Action Required', BRASS], ['High', BRASS]], w: 210 },
  { tags: [['Meeting Request', IVORY], ['Medium', IVORY]], w: 170 },
  { tags: [['Informational', SAGE], ['Low', SAGE]], w: 190 },
];
function MailMind({ still }) {
  return (
    <>
      {/* inbox column */}
      <rect x="60" y="52" width="250" height="300" rx="8" fill="none" stroke={SAGE_FAINT} strokeWidth="1.2" />
      <text x="78" y="78" fill={IVORY} opacity="0.55" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="2">
        INBOX
      </text>
      {MAILS.map((m, i) => {
        const y = 96 + i * 84;
        return (
          <motion.g key={i} initial={{ opacity: still ? 1 : 0, x: still ? 0 : -14 }} animate={still ? undefined : { opacity: [0, 1, 1, 0], x: [-14, 0, 0, 0] }} transition={{ duration: 7.5, delay: i * 0.6, repeat: Infinity, times: [0, 0.08, 0.9, 1] }}>
            <rect x="74" y={y} width="222" height="70" rx="5" fill={IVORY} fillOpacity="0.03" stroke={i === 0 ? BRASS : SAGE_FAINT} strokeWidth="1.2" />
            <rect x="88" y={y + 14} width="22" height="15" rx="2" fill="none" stroke={IVORY} strokeOpacity="0.7" strokeWidth="1.2" />
            <path d={`M88 ${y + 14} L99 ${y + 23} L110 ${y + 14}`} fill="none" stroke={IVORY} strokeOpacity="0.7" strokeWidth="1.2" />
            <path d={`M120 ${y + 18} h${m.w * 0.6} M120 ${y + 28} h${m.w * 0.45}`} stroke={IVORY} strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" />
            {/* the AI tags appear after the email lands */}
            <motion.g initial={{ opacity: still ? 1 : 0 }} animate={still ? undefined : { opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 7.5, delay: i * 0.6, repeat: Infinity, times: [0, 0.18, 0.26, 0.9, 1] }}>
              {m.tags.map(([label, c], k) => (
                <g key={label}>
                  <rect x={88 + k * 112} y={y + 40} width={k ? 52 : 104} height="18" rx="9" fill="none" stroke={c} strokeOpacity="0.8" strokeWidth="1.1" />
                  <text x={88 + k * 112 + (k ? 26 : 52)} y={y + 52.5} textAnchor="middle" fill={c} fontSize="9" fontFamily="var(--font-mono)">
                    {label}
                  </text>
                </g>
              ))}
            </motion.g>
          </motion.g>
        );
      })}
      {/* AI summary + reply suggestions for the selected email */}
      <path d="M296 131 C320 131 320 120 340 120" fill="none" stroke={BRASS} strokeOpacity="0.7" strokeWidth="1.2" />
      <rect x="340" y="52" width="210" height="300" rx="8" fill="none" stroke={SAGE_FAINT} strokeWidth="1.2" />
      <text x="358" y="78" fill={BRASS} fontSize="11" fontFamily="var(--font-mono)" letterSpacing="2">
        GEMINI SUMMARY
      </text>
      {[0, 1, 2, 3].map((k) => (
        <motion.line
          key={k}
          x1="358"
          y1={100 + k * 16}
          x2={358 + [170, 150, 164, 96][k]}
          y2={100 + k * 16}
          stroke={IVORY}
          strokeOpacity="0.4"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: still ? 1 : 0 }}
          animate={still ? undefined : { pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 7.5, delay: 1.4 + k * 0.25, repeat: Infinity, times: [0, 0.12, 0.85, 1] }}
        />
      ))}
      <text x="358" y="192" fill={IVORY} opacity="0.55" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
        SUGGESTED REPLIES
      </text>
      {[0, 1, 2].map((k) => (
        <motion.g key={k} initial={{ opacity: still ? 1 : 0 }} animate={still ? undefined : { opacity: [0, 1, 1, 0] }} transition={{ duration: 7.5, delay: 2.4 + k * 0.3, repeat: Infinity, times: [0, 0.08, 0.86, 1] }}>
          <rect x="358" y={206 + k * 42} width="176" height="32" rx="6" fill="none" stroke={k === 0 ? BRASS : SAGE_FAINT} strokeWidth="1.2" />
          <path d={`M372 ${218 + k * 42} h${[120, 96, 110][k]} M372 ${227 + k * 42} h${[70, 84, 60][k]}`} stroke={IVORY} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      ))}
    </>
  );
}

/* RugRadar — the scanner sweeps an address's activity; findings appear and
   push the transparent 0–100 risk meter (low / medium / high). */
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
      <motion.g animate={still ? undefined : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
        {/* invisible circle centred on the radar, so the sweep turns around it */}
        <circle cx="300" cy="200" r="152" fill="none" stroke="none" />
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
      {/* the transparent 0–100 score: low 0–29 · medium 30–59 · high 60–100 */}
      <g transform="translate(486 120)">
        <text x="0" y="-12" fill={IVORY} opacity="0.55" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          RISK
        </text>
        <rect x="0" y="0" width="10" height="160" rx="5" fill="none" stroke={SAGE_FAINT} />
        <rect x="0" y="0" width="10" height="64" rx="5" fill={BRASS} fillOpacity="0.55" />
        <rect x="0" y="64" width="10" height="48" fill={IVORY} fillOpacity="0.2" />
        <rect x="0" y="112" width="10" height="48" rx="5" fill={SAGE} fillOpacity="0.5" />
        <motion.path d="M16 0 l10 -6 v12 z" fill={IVORY} initial={{ y: still ? 50 : 140 }} animate={still ? undefined : { y: [140, 120, 50, 50, 140] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.55, 0.9, 1], ease: 'easeInOut' }} />
        {['HIGH', 'MED', 'LOW'].map((t, i) => (
          <text key={t} x="-8" y={[34, 92, 140][i]} textAnchor="end" fill={IVORY} opacity="0.45" fontSize="9" fontFamily="var(--font-mono)">
            {t}
          </text>
        ))}
      </g>
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
      <motion.g animate={still ? { rotate: -20 } : { rotate: [-60, 30, -10, 50, -60] }} transition={loop(7)}>
        <circle cx="510" cy="330" r="56" fill="none" stroke="none" />
        <line x1="510" y1="330" x2="510" y2="276" stroke={IVORY} strokeWidth="2" />
      </motion.g>
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

/* MultiDiscord Bot — one bot serving the server's channels: music,
   moderation, giveaways, economy, welcome cards and levels. */
const CHANNELS = [
  [140, 100, '#music'], [460, 96, '#moderation'], [530, 240, '#giveaways'], [400, 330, '#economy'], [200, 330, '#welcome'], [80, 230, '#levels'],
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

export default function ProjectAmbient({ id, still = false, className = '', fit = 'slice' }) {
  const ref = useRef(null);
  // pause every loop while the scene is offscreen
  const inView = useInView(ref, { margin: '120px' });
  const Scene = SCENES[id];
  if (!Scene) return null;
  return (
    <svg ref={ref} className={`amb ${className}`} viewBox="0 0 600 400" preserveAspectRatio={`xMidYMid ${fit}`} aria-hidden="true">
      <rect width="600" height="400" fill="url(#amb-grid)" />
      <defs>
        <pattern id="amb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="rgba(244,240,232,0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <Scene key={inView ? 'on' : 'off'} still={still || !inView} />
    </svg>
  );
}
