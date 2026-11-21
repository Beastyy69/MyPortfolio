import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Code Frontier — Mission Outpost art. Original ink‑and‑wash landmarks,
   one per project, drawn around (0,0) with the base on y = 0. Every
   moving part is its own element so it can animate (`live`):

   Observatory      telescope turns, beam breathes, cube rotates, data rises
   Relay station    envelope flag sways, signal arcs pulse
   Command hub      bubbles come and go, active bubble swaps, antennas pulse
   Timetable tower  clock hands move, the tower window light switches
   Radar outpost    dish sweeps, one signal ring expands and fades
   Campfire         fire flickers, smoke rises, tent cloth sways
   Cinema archive   reel turns, a soft projector beam sweeps the yard

   The same drawings are used small on the map and large in the mission
   scene. Palette: parchment, warm brown, muted olive, faded gold, dusty
   red, charcoal. No neon, no borrowed game assets.
   ───────────────────────────────────────────────────────────── */

export const C = {
  ink: '#2f251d',
  paper: '#e9dcc0',
  paper2: '#dccaa2',
  stone: '#c2b08a',
  stoneDk: '#9c8a68',
  wood: '#7a5a3a',
  woodDk: '#5a4029',
  olive: '#5d6b3f',
  oliveDk: '#46522f',
  gold: '#b39356',
  red: '#8a3d33',
  char: '#2a2420',
};
const S = { stroke: C.ink, strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' };
const loop = (duration, delay = 0, ease = 'easeInOut') => ({ duration, delay, repeat: Infinity, ease });
/* Framer Motion turns SVG elements around the centre of their own bounding
   box. An invisible circle centred on the pivot makes that centre the pivot. */
function Pivot({ x, y, r, children, ...motionProps }) {
  return (
    <motion.g {...motionProps}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="none" />
      {children}
    </motion.g>
  );
}

/* a pennant that waves by morphing its outline */
function Pennant({ x, y, w = 30, h = 18, fill = C.red, live }) {
  const a = `M${x} ${y} L${x + w} ${y + h * 0.42} L${x} ${y + h} Z`;
  const b = `M${x} ${y} Q${x + w * 0.55} ${y + h * 0.1} ${x + w * 0.95} ${y + h * 0.5} Q${x + w * 0.5} ${y + h * 0.7} ${x} ${y + h} Z`;
  return <motion.path d={a} fill={fill} animate={live ? { d: [a, b, a] } : undefined} transition={loop(2.8)} />;
}

function Observatory({ live }) {
  return (
    <g {...S}>
      {/* projection beam — breathes in opacity */}
      <motion.path
        d="M-14 -118 L-58 -226 L58 -226 L14 -118 Z"
        fill={C.gold}
        stroke="none"
        initial={{ opacity: 0.2 }}
        animate={live ? { opacity: [0.14, 0.26, 0.14] } : undefined}
        transition={loop(4)}
      />
      {/* small data symbols rising through the beam */}
      {live &&
        [0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={-16 + i * 10}
            y="-130"
            width="5"
            height="5"
            fill={C.paper}
            stroke={C.ink}
            strokeWidth="1"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, -80], opacity: [0, 0.9, 0] }}
            transition={{ duration: 3.6, delay: i * 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      {/* the floating hologram cube: slow turn + bob */}
      <motion.g animate={live ? { y: [0, -5, 0] } : undefined} transition={loop(5)}>
        <Pivot x={0} y={-154} r={30} animate={live ? { scaleX: [1, 0.35, -0.35, -1, -0.35, 0.35, 1] } : undefined} transition={loop(14, 0, 'linear')}>
          <path d="M-22 -168 L0 -180 L22 -168 L0 -156 Z M-22 -168 V-140 L0 -128 V-156 M22 -168 V-140 L0 -128" fill="none" stroke={C.red} strokeWidth="2" />
        </Pivot>
      </motion.g>
      {/* stone hall and dome */}
      <path d="M-78 0 V-58 H78 V0 Z" fill={C.stone} />
      <path d="M-56 -58 A56 56 0 0 1 56 -58 Z" fill={C.paper2} />
      <path d="M-8 -112 L-4 -60 M8 -112 L4 -60" />
      {/* the telescope slowly turns on its mount */}
      <Pivot x={10} y={-96} r={60} animate={live ? { rotate: [-6, 8, -6] } : undefined} transition={loop(9)}>
        <path d="M10 -96 L54 -132" strokeWidth="6" stroke={C.char} />
        <path d="M10 -96 L54 -132" strokeWidth="2.2" stroke={C.gold} />
      </Pivot>
      <path d="M-14 0 V-30 A14 14 0 0 1 14 -30 V0" fill={C.wood} />
      <path d="M-58 -20 h18 v-18 h-18 z M40 -20 h18 v-18 h-18 z" fill={C.gold} fillOpacity="0.55" />
      {/* flagship pennant */}
      <path d="M62 -58 V-104" />
      <Pennant x={62} y={-104} w={32} h={18} live={live} />
    </g>
  );
}

function RelayStation({ live }) {
  return (
    <g {...S}>
      <path d="M-46 0 V-40 L-20 -62 L6 -40 V0 Z" fill={C.paper2} />
      <path d="M-30 0 V-22 h14 V0" fill={C.wood} />
      <path d="M-38 -48 h12 v8 h-12 z" fill={C.paper} />
      {/* lattice mast */}
      <path d="M22 0 L34 -112 L46 0 M26 -36 L42 -36 M28 -70 L40 -70 M24 -18 L44 -54 M44 -18 L24 -54 M28 -54 L40 -90 M40 -54 L28 -90" fill="none" />
      <circle cx="34" cy="-116" r="5" fill={C.gold} />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${48 + i * 9} -132 a${16 + i * 9} ${16 + i * 9} 0 0 1 0 ${32 + i * 18}`}
          fill="none"
          strokeDasharray="4 5"
          animate={live ? { opacity: [0.15, 1, 0.15] } : undefined}
          transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      {/* envelope flag, moving slightly in the wind */}
      <Pivot x={34} y={-104} r={30} animate={live ? { rotate: [-5, 4, -5] } : undefined} transition={loop(3.2)}>
        <path d="M34 -96 h-26 v-16 h26 z" fill={C.paper} />
        <path d="M8 -112 L21 -102 L34 -112" fill="none" />
      </Pivot>
    </g>
  );
}

function CommsHub({ live }) {
  return (
    <g {...S}>
      <path d="M-62 0 V-44 H62 V0 Z" fill={C.paper2} />
      <path d="M-70 -44 L0 -86 L70 -44 Z" fill={C.olive} />
      <path d="M-12 0 V-28 h24 V0" fill={C.wood} />
      {[-40, 0, 40].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${-86 + Math.abs(x) * 0.55} V-130`} fill="none" />
          <circle cx={x} cy="-132" r="4" fill={C.gold} />
          {/* antenna signal pulse */}
          {live && (
            <motion.circle cx={x} cy="-132" r="4" fill="none" strokeWidth="1.4" initial={{ r: 4, opacity: 0 }} animate={{ r: [4, 12], opacity: [0.7, 0] }} transition={{ duration: 2.2, delay: i * 0.7, repeat: Infinity, ease: 'easeOut' }} />
          )}
          {/* speech bubbles: drift, come and go, and the active one changes */}
          <motion.g
            animate={live ? { y: [0, -4, 0], opacity: [1, 1, 0.25, 1] } : undefined}
            transition={live ? { y: loop(2.6, i * 0.5), opacity: { duration: 6, delay: i * 2, repeat: Infinity, times: [0, 0.6, 0.75, 1] } } : undefined}
          >
            <motion.rect
              x={x + 8}
              y="-156"
              width="28"
              height="18"
              rx="7"
              fill={i === 1 ? C.red : C.paper}
              animate={live ? { fill: [C.paper, C.red, C.red, C.paper, C.paper, C.paper] } : undefined}
              transition={{ duration: 6, delay: i * 2, repeat: Infinity, times: [0, 0.06, 0.3, 0.36, 0.9, 1] }}
            />
            <path d={`M${x + 14} -138 l-4 7 l10 -7`} fill={C.paper} />
            <path d={`M${x + 14} -150 h14 M${x + 14} -144 h9`} strokeWidth="1.3" />
          </motion.g>
        </g>
      ))}
      <path d="M-50 -20 h14 v-12 h-14 z M36 -20 h14 v-12 h-14 z" fill={C.gold} fillOpacity="0.55" />
    </g>
  );
}

function TrackingOutpost({ live }) {
  return (
    <g {...S}>
      <path d="M-44 0 L-34 -60 M44 0 L34 -60 M-38 -30 H38 M-40 -12 L36 -54 M40 -12 L-36 -54" fill="none" />
      <path d="M-50 -60 H50 V-72 H-50 Z" fill={C.wood} />
      <path d="M-40 -72 V-92 H40 V-72" fill={C.paper2} />
      <path d="M-40 -92 L0 -112 L40 -92 Z" fill={C.red} />
      <path d="M30 -112 V-128" fill="none" />
      {/* one muted signal ring, expanding and fading */}
      {live && (
        <motion.circle cx="30" cy="-140" fill="none" strokeWidth="1.4" initial={{ r: 6, opacity: 0 }} animate={{ r: [6, 46], opacity: [0.55, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut' }} />
      )}
      {/* radar dish: a slow sweep */}
      <Pivot x={30} y={-128} r={56} animate={live ? { rotate: [-28, 28, -28] } : undefined} transition={loop(7)}>
        <path d="M8 -150 A30 30 0 0 0 52 -128 Z" fill={C.paper} />
        <path d="M30 -128 L22 -142" fill="none" />
        <path d="M58 -150 a14 14 0 0 1 8 14 M66 -160 a26 26 0 0 1 12 26" fill="none" strokeDasharray="3 4" />
      </Pivot>
      <circle cx="-16" cy="-82" r="5" fill={C.gold} />
    </g>
  );
}

function CreativeCamp({ live }) {
  return (
    <g {...S}>
      {/* tent cloth moves slightly in the wind */}
      <Pivot x={-50} y={0} r={72} animate={live ? { skewX: [0, -2.5, 0, 1.5, 0] } : undefined} transition={loop(5)}>
        <path d="M-86 0 L-50 -64 L-14 0 Z" fill={C.red} />
        <path d="M-50 -64 V0 M-58 0 L-50 -22 L-42 0" fill="none" />
      </Pivot>
      <Pivot x={48} y={0} r={56} animate={live ? { skewX: [0, 2, 0, -1.5, 0] } : undefined} transition={loop(5.6, 0.4)}>
        <path d="M20 0 L48 -50 L76 0 Z" fill={C.gold} />
        <path d="M48 -50 V0" fill="none" />
      </Pivot>
      <path d="M-50 -64 Q0 -48 48 -50" fill="none" strokeWidth="1.6" />
      {[-34, -18, -2, 14, 30].map((x, i) => (
        <Pivot key={x} x={x + 3.5} y={-58} r={12} animate={live ? { rotate: [-6, 6, -6] } : undefined} transition={loop(2.4, i * 0.2)}>
          <path d={`M${x} ${-58 + (i % 2)} l7 0 l-3.5 9 z`} fill={i % 2 ? C.olive : C.paper} strokeWidth="1.4" />
        </Pivot>
      ))}
      {/* smoke trail */}
      {live &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="2"
            cy="-40"
            r="4"
            fill={C.paper2}
            stroke={C.ink}
            strokeOpacity="0.4"
            strokeWidth="1"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, -56], x: [0, 6, -4], scale: [0.6, 1.6], opacity: [0, 0.7, 0] }}
            transition={{ duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      {/* campfire */}
      <path d="M-8 0 L12 -6 M-8 -6 L12 0" strokeWidth="3" stroke={C.woodDk} />
      <Pivot x={2} y={-6} r={32} animate={live ? { scaleY: [1, 1.14, 0.94, 1.08, 1], scaleX: [1, 0.94, 1.04, 0.97, 1] } : undefined} transition={loop(1.3)}>
        <path d="M2 -6 C-8 -16 -2 -26 2 -36 C6 -26 14 -18 2 -6 Z" fill={C.gold} />
      </Pivot>
      <Pivot x={2} y={-8} r={18} animate={live ? { scaleY: [1, 0.86, 1.1, 1] } : undefined} transition={loop(0.9)}>
        <path d="M2 -8 C-2 -14 0 -20 2 -24 C6 -18 7 -14 2 -8 Z" fill={C.red} stroke="none" />
      </Pivot>
    </g>
  );
}

function CinemaArchive({ live }) {
  return (
    <g {...S}>
      {/* a soft projector beam sweeping the yard (muted, no glow) */}
      <Pivot x={30} y={-55} r={126} initial={{ opacity: 0.12 }} animate={live ? { rotate: [-10, 8, -10], opacity: [0.08, 0.16, 0.08] } : undefined} transition={loop(8)}>
        <path d="M30 -55 L150 -20 L150 30 Z" fill={C.gold} stroke="none" />
      </Pivot>
      <path d="M-74 0 V-8 H74 V0 Z" fill={C.stoneDk} />
      <path d="M-66 -8 V-62 H66 V-8 Z" fill={C.stone} />
      {[-48, -24, 24, 48].map((x) => (
        <path key={x} d={`M${x - 5} -8 V-62 M${x + 5} -8 V-62`} fill="none" strokeWidth="1.6" />
      ))}
      <path d="M-14 -8 V-40 h28 V-8" fill={C.char} />
      <path d="M-76 -62 L0 -100 L76 -62 Z" fill={C.paper2} />
      {/* film reel turning */}
      <Pivot x={0} y={-78} r={14} animate={live ? { rotate: 360 } : undefined} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
        <circle cx="0" cy="-78" r="13" fill={C.paper} />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 7} cy={-78 + Math.sin((a * Math.PI) / 180) * 7} r="2.6" fill={C.char} stroke="none" />
        ))}
      </Pivot>
      <path d="M-40 -50 h80 v-10 h-80 z" fill={C.red} />
      {[-30, -15, 0, 15, 30].map((x, i) => (
        <motion.circle key={x} cx={x} cy="-55" r="1.8" fill={C.paper} stroke="none" animate={live ? { opacity: [0.3, 1, 0.3] } : undefined} transition={loop(2, i * 0.3)} />
      ))}
    </g>
  );
}

function PlanningTower({ live }) {
  return (
    <g {...S}>
      <path d="M-30 0 L-24 -150 H24 L30 0 Z" fill={C.stone} />
      <path d="M-34 -150 H34 V-162 H-34 Z" fill={C.stoneDk} />
      <path d="M-28 -162 L0 -196 L28 -162 Z" fill={C.olive} />
      <circle cx="0" cy="-122" r="17" fill={C.paper} />
      {/* minute and hour hands */}
      <Pivot x={0} y={-122} r={15} animate={live ? { rotate: 360 } : undefined} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
        <path d="M0 -122 V-135" />
      </Pivot>
      <Pivot x={0} y={-122} r={15} animate={live ? { rotate: 360 } : undefined} transition={{ duration: 144, repeat: Infinity, ease: 'linear' }}>
        <path d="M0 -122 L8 -118" />
      </Pivot>
      {/* timetable banner with a moving "current slot" */}
      <path d="M-20 -88 h40 v40 h-40 z" fill={C.paper} />
      <path d="M-20 -78 h40 M-20 -68 h40 M-20 -58 h40 M-6 -88 v40 M8 -88 v40" fill="none" strokeWidth="1.2" />
      <motion.rect
        x="-20"
        y="-88"
        width="14"
        height="10"
        fill={C.gold}
        strokeWidth="1.2"
        animate={live ? { x: [-20, -6, 8, -20, -6, 8, -20], y: [-88, -88, -88, -78, -78, -78, -88] } : undefined}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1] }}
      />
      {/* the little light in the tower switches state */}
      <motion.rect x="-5" y="-40" width="10" height="10" fill={C.gold} animate={live ? { fill: [C.gold, C.char, C.gold] } : undefined} transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1], ease: 'easeInOut' }} />
      <path d="M-8 0 V-24 a8 8 0 0 1 16 0 V0" fill={C.wood} />
    </g>
  );
}

export const LANDMARKS = {
  hologram: Observatory,
  mailmind: RelayStation,
  discordbot: CommsHub,
  rugradar: TrackingOutpost,
  roastme: CreativeCamp,
  cinesense: CinemaArchive,
  scheduler: PlanningTower,
};

export function Landmark({ id, live = false }) {
  const Art = LANDMARKS[id];
  return Art ? <Art live={live} /> : null;
}

/* ── project activity in the mission scene, based on what each app does ── */
const ink = { stroke: C.ink, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' };

function HologramActivity({ live }) {
  // a hand gestures beside the observatory; the hologram responds (rotate → pinch → scale)
  const HAND = 'M0 0 L-12 -10 L-20 -22 L-24 -34 M0 0 L-8 -32 L-10 -60 M0 0 L0 -36 L0 -66 M0 0 L9 -32 L11 -58 M0 0 L17 -26 L21 -46';
  return (
    <g {...ink}>
      <g transform="translate(610 330)">
      <motion.g animate={live ? { x: [0, -24, 0, 18, 0], y: [0, -8, 0, 6, 0] } : undefined} transition={loop(8)}>
        <path d={HAND} fill="none" strokeWidth="3" />
        {[[-24, -34], [-10, -60], [0, -66], [11, -58], [21, -46]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={i < 2 ? C.gold : C.paper} />
        ))}
        <path d="M-40 -84 h10 M-40 -84 v10 M34 -84 h-10 M34 -84 v10 M-40 14 h10 M-40 14 v-10 M34 14 h-10 M34 14 v-10" fill="none" stroke={C.red} />
      </motion.g>
      </g>
      <motion.path d="M575 262 Q510 175 420 160" fill="none" stroke={C.red} strokeDasharray="5 7" animate={live ? { strokeDashoffset: [0, -24] } : undefined} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
    </g>
  );
}

function MailActivity({ live }) {
  // envelopes arrive, pass the relay, and are sorted into intent trays
  const trays = [
    ['ACTION', 250, C.red],
    ['MEETING', 300, C.gold],
    ['INFO', 350, C.olive],
  ];
  return (
    <g {...ink}>
      {trays.map(([label, y, c]) => (
        <g key={label}>
          <path d={`M565 ${y} h120 l-8 18 h-104 z`} fill={C.paper} />
          <rect x="565" y={y - 4} width="120" height="4" fill={c} stroke="none" />
          <text x="625" y={y + 13} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill={C.ink} stroke="none">
            {label}
          </text>
        </g>
      ))}
      {trays.map(([label, y], i) => (
        <motion.g
          key={`e${label}`}
          initial={{ x: 110, y: 360, opacity: 0 }}
          animate={live ? { x: [110, 260, 430, 615], y: [360, 330, 260, y - 22], opacity: [0, 1, 1, 0] } : { x: 615, y: y - 22, opacity: 1 }}
          transition={live ? { duration: 6, delay: i * 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
        >
          <rect x="-15" y="-10" width="30" height="20" fill={C.paper} />
          <path d="M-15 -10 L0 2 L15 -10" fill="none" />
        </motion.g>
      ))}
    </g>
  );
}

function RadarActivity({ live }) {
  const cx = 455;
  const cy = 215;
  return (
    <g>
      {[60, 110, 160].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={C.ink} strokeOpacity="0.18" strokeDasharray="3 6" />
      ))}
      <Pivot x={cx} y={cy} r={162} animate={live ? { rotate: [0, 360] } : undefined} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        <path d={`M${cx} ${cy} L${cx + 160} ${cy} A160 160 0 0 0 ${cx + 113} ${cy - 113} Z`} fill={C.gold} fillOpacity="0.16" />
      </Pivot>
      {[[560, 150, 1], [380, 120, 3.2], [600, 260, 5.4]].map(([x, y, d], i) => (
        <motion.g key={i} initial={{ opacity: live ? 0 : 1 }} animate={live ? { opacity: [0, 1, 0.3, 0] } : undefined} transition={{ duration: 8, delay: d, repeat: Infinity, times: [0, 0.06, 0.5, 1] }}>
          <circle cx={x} cy={y} r="5" fill={i === 0 ? C.red : C.paper} stroke={C.ink} strokeWidth="1.5" />
          <circle cx={x} cy={y} r="11" fill="none" stroke={C.ink} strokeOpacity="0.4" />
        </motion.g>
      ))}
    </g>
  );
}

function RoastActivity({ live }) {
  // playful text cards drift up from the campfire
  return (
    <g {...ink}>
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ x: 520 + i * 58, y: 330, opacity: 0, rotate: 0 }}
          animate={live ? { y: [330, 150], opacity: [0, 1, 1, 0], rotate: [i % 2 ? -4 : 4, i % 2 ? 4 : -4] } : { y: 200 + i * 40, opacity: 1 }}
          transition={live ? { duration: 7, delay: i * 2.3, repeat: Infinity, ease: 'easeOut', opacity: { duration: 7, delay: i * 2.3, repeat: Infinity, times: [0, 0.12, 0.8, 1] } } : { duration: 0 }}
        >
          <rect x="-34" y="-20" width="68" height="40" rx="4" fill={C.paper} />
          <path d="M-24 -8 h44 M-24 0 h36 M-24 8 h28" strokeWidth="1.6" strokeOpacity="0.6" />
          <circle cx="26" cy="-12" r="3.5" fill={i === 1 ? C.red : C.gold} stroke="none" />
        </motion.g>
      ))}
    </g>
  );
}

function CinemaActivity({ live }) {
  // recommendation cards glide past: similar films, one after another
  const cards = [0, 1, 2, 3, 4];
  return (
    <g {...ink}>
      <motion.g animate={live ? { x: [0, -110] } : undefined} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
        {cards.map((i) => (
          <g key={i} transform={`translate(${540 + i * 110} 140)`}>
            <rect x="-34" y="-46" width="68" height="92" rx="3" fill={i === 1 ? C.paper2 : C.paper} />
            <rect x="-26" y="-38" width="52" height="54" fill={[C.olive, C.red, C.gold, C.stoneDk, C.oliveDk][i]} fillOpacity="0.55" strokeWidth="1.4" />
            <path d="M-26 26 h40 M-26 34 h28" strokeWidth="1.6" strokeOpacity="0.6" />
          </g>
        ))}
      </motion.g>
      <path d="M470 215 C500 215 505 190 506 186" fill="none" stroke={C.red} strokeDasharray="4 6" />
    </g>
  );
}

function ScheduleActivity({ live }) {
  // a day timeline: slots fill in, the "now" marker moves along
  const slots = [0, 1, 2, 3, 4, 5];
  return (
    <g {...ink}>
      <rect x="485" y="196" width="210" height="64" rx="4" fill={C.paper} />
      {slots.map((i) => (
        <motion.rect
          key={i}
          x={495 + i * 33}
          y="214"
          width="28"
          height="30"
          fill={i % 2 ? C.olive : C.gold}
          strokeWidth="1.4"
          initial={{ fillOpacity: live ? 0 : 0.6 }}
          animate={live ? { fillOpacity: [0, 0.65, 0.65, 0] } : undefined}
          transition={{ duration: 9, delay: i * 0.5, repeat: Infinity, times: [0, 0.1, 0.85, 1] }}
        />
      ))}
      <motion.path d="M495 206 V252" stroke={C.red} strokeWidth="3" animate={live ? { x: [0, 192, 0] } : undefined} transition={loop(9)} />
    </g>
  );
}

function DiscordActivity({ live }) {
  // a message travels from one speech bubble to the next
  return (
    <motion.circle
      r="7"
      fill={C.red}
      stroke={C.ink}
      strokeWidth="2"
      initial={{ cx: 326, cy: 180 }}
      animate={live ? { cx: [326, 384, 441, 478, 515, 441, 326], cy: [180, 140, 180, 140, 180, 220, 180], opacity: [0, 1, 1, 1, 1, 1, 0] } : { opacity: 0 }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

const ACTIVITY = {
  hologram: HologramActivity,
  mailmind: MailActivity,
  rugradar: RadarActivity,
  roastme: RoastActivity,
  cinesense: CinemaActivity,
  scheduler: ScheduleActivity,
  discordbot: DiscordActivity,
};

/* the environment around a landmark in the mission detail scene */
export function MissionScene({ id, live = true, title }) {
  const Activity = ACTIVITY[id];
  const drift = (dist, dur) => (live ? { animate: { x: [0, dist, 0] }, transition: loop(dur) } : {});
  return (
    <svg className="out__scene-svg" viewBox="100 0 600 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
      <defs>
        <linearGradient id="out-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe3c6" />
          <stop offset="1" stopColor="#dfcca4" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#out-sky)" />
      {/* clouds drift slowly */}
      <motion.g {...(live ? { animate: { x: [-60, 80, -60] }, transition: loop(40) } : {})} fill="#f3ead6" stroke={C.ink} strokeOpacity="0.35" strokeWidth="1.6">
        <path d="M90 90 q20 -22 44 -6 q18 -14 34 4 q16 0 16 12 h-104 q-6 -10 10 -10 z" />
        <path d="M560 70 q20 -20 40 -4 q20 -12 32 6 h-82 z" />
      </motion.g>
      {/* layered hills with slow parallax: far moves least */}
      <motion.path {...drift(-10, 26)} d="M-40 330 Q120 250 260 300 T520 280 T840 300 V520 H-40 Z" fill="#b9b08a" stroke={C.ink} strokeOpacity="0.35" strokeWidth="1.6" />
      <motion.path {...drift(-18, 20)} d="M-40 380 Q160 330 330 370 T640 350 T840 370 V520 H-40 Z" fill={C.olive} fillOpacity="0.75" stroke={C.ink} strokeOpacity="0.4" strokeWidth="1.6" />
      <motion.path {...drift(-26, 16)} d="M-40 430 Q200 400 400 420 T840 410 V520 H-40 Z" fill={C.wood} fillOpacity="0.55" />
      {/* the route, marching toward the landmark */}
      <motion.path
        d="M120 520 C220 470 330 470 400 452"
        fill="none"
        stroke={C.red}
        strokeWidth="4"
        strokeDasharray="12 10"
        strokeLinecap="round"
        animate={live ? { strokeDashoffset: [0, -44] } : undefined}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
      {[[110, 372], [150, 380], [660, 360], [700, 368], [740, 362]].map(([x, y], i) => (
        <Pivot key={i} x={x} y={y + 22} r={26} animate={live ? { skewX: [0, 3, 0] } : undefined} transition={loop(4 + i * 0.4, i * 0.3)}>
          <path d={`M${x} ${y} l-12 22 h24 z`} fill={C.oliveDk} stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" />
        </Pivot>
      ))}
      <g transform={`translate(400 452) scale(${id === 'hologram' ? 1.45 : 1.85})`}>
        <Landmark id={id} live={live} />
      </g>
      {Activity && <Activity live={live} />}
      <rect x="100" width="600" height="520" fill="none" stroke={C.ink} strokeOpacity="0.5" strokeWidth="3" />
    </svg>
  );
}
