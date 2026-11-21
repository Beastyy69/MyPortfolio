import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Code Frontier — Mission Outpost art. Original ink‑and‑wash landmarks,
   one per project, drawn around (0,0) with the base on y = 0. The same
   drawings are used small on the territory map and large in the
   mission detail scene. Palette: parchment, warm brown, muted olive,
   faded gold, dusty red, charcoal. No neon, no borrowed game assets.
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
  gold: '#c79a3e',
  red: '#8a3d33',
  char: '#2a2420',
};
const S = { stroke: C.ink, strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' };

function Observatory({ live }) {
  return (
    <g {...S}>
      {/* projection beam + a floating wireframe shape: the hologram */}
      <path d="M-14 -118 L-58 -226 L58 -226 L14 -118 Z" fill={C.gold} fillOpacity="0.18" stroke="none" />
      <motion.g animate={live ? { y: [0, -6, 0], rotate: [0, 8, 0] } : undefined} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: '0px', originY: '-182px' }}>
        <path d="M-22 -168 L0 -180 L22 -168 L0 -156 Z M-22 -168 V-140 L0 -128 V-156 M22 -168 V-140 L0 -128" fill="none" stroke={C.red} strokeWidth="2" />
      </motion.g>
      {/* stone hall and dome */}
      <path d="M-78 0 V-58 H78 V0 Z" fill={C.stone} />
      <path d="M-78 -58 H78" />
      <path d="M-56 -58 A56 56 0 0 1 56 -58 Z" fill={C.paper2} />
      <path d="M-8 -112 L-4 -60 M8 -112 L4 -60" />
      <path d="M-8 -112 Q0 -116 8 -112" />
      <path d="M10 -96 L54 -132" strokeWidth="6" stroke={C.char} />
      <path d="M10 -96 L54 -132" strokeWidth="2.2" stroke={C.gold} />
      <path d="M-14 0 V-30 A14 14 0 0 1 14 -30 V0" fill={C.wood} />
      <path d="M-58 -20 h18 v-18 h-18 z M40 -20 h18 v-18 h-18 z" fill={C.gold} fillOpacity="0.55" />
      {/* flagship pennant */}
      <path d="M62 -58 V-104" />
      <path d="M62 -104 L94 -96 L62 -86 Z" fill={C.red} />
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
          animate={live ? { opacity: [0.2, 1, 0.2] } : undefined}
          transition={{ duration: 2.2, delay: i * 0.35, repeat: Infinity }}
        />
      ))}
      {/* envelope pennant */}
      <path d="M34 -96 h-26 v-16 h26 z" fill={C.paper} />
      <path d="M8 -112 L21 -102 L34 -112" fill="none" />
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
          <motion.g animate={live ? { y: [0, -4, 0] } : undefined} transition={{ duration: 2.6, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x={x + 8} y="-156" width="28" height="18" rx="7" fill={i === 1 ? C.red : C.paper} />
            <path d={`M${x + 14} -138 l-4 7 l10 -7`} fill={i === 1 ? C.red : C.paper} />
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
      {/* radar dish */}
      <path d="M30 -112 V-128" fill="none" />
      <motion.g animate={live ? { rotate: [-25, 25, -25] } : undefined} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: '30px', originY: '-128px' }}>
        <path d="M8 -150 A30 30 0 0 0 52 -128 Z" fill={C.paper} />
        <path d="M30 -128 L22 -142" fill="none" />
        <path d="M58 -150 a14 14 0 0 1 8 14 M66 -160 a26 26 0 0 1 12 26" fill="none" strokeDasharray="3 4" />
      </motion.g>
      <circle cx="-16" cy="-82" r="5" fill={C.gold} />
    </g>
  );
}

function CreativeCamp({ live }) {
  return (
    <g {...S}>
      <path d="M-86 0 L-50 -64 L-14 0 Z" fill={C.red} />
      <path d="M-50 -64 V0 M-58 0 L-50 -22 L-42 0" fill="none" />
      <path d="M20 0 L48 -50 L76 0 Z" fill={C.gold} />
      <path d="M48 -50 V0" fill="none" />
      {/* bunting */}
      <path d="M-50 -64 Q0 -48 48 -50" fill="none" strokeWidth="1.6" />
      {[-34, -18, -2, 14, 30].map((x, i) => (
        <path key={x} d={`M${x} ${-58 + Math.abs(x) * 0.02 + (i % 2)} l7 0 l-3.5 9 z`} fill={i % 2 ? C.olive : C.paper} strokeWidth="1.4" />
      ))}
      {/* campfire */}
      <path d="M-8 0 L12 -6 M-8 -6 L12 0" strokeWidth="3" stroke={C.woodDk} />
      <motion.path
        d="M2 -6 C-8 -16 -2 -26 2 -36 C6 -26 14 -18 2 -6 Z"
        fill={C.gold}
        animate={live ? { scaleY: [1, 1.15, 0.95, 1] } : undefined}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ originX: '2px', originY: '-6px' }}
      />
      <path d="M2 -8 C-2 -14 0 -20 2 -24 C4 -18 7 -14 2 -8 Z" fill={C.red} stroke="none" />
    </g>
  );
}

function CinemaArchive({ live }) {
  return (
    <g {...S}>
      <path d="M-74 0 V-8 H74 V0 Z" fill={C.stoneDk} />
      <path d="M-66 -8 V-62 H66 V-8 Z" fill={C.stone} />
      {[-48, -24, 24, 48].map((x) => (
        <path key={x} d={`M${x - 5} -8 V-62 M${x + 5} -8 V-62`} fill="none" strokeWidth="1.6" />
      ))}
      <path d="M-14 -8 V-40 h28 V-8" fill={C.char} />
      <path d="M-76 -62 L0 -100 L76 -62 Z" fill={C.paper2} />
      {/* film reel emblem */}
      <motion.g animate={live ? { rotate: 360 } : undefined} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ originX: '0px', originY: '-78px' }}>
        <circle cx="0" cy="-78" r="13" fill={C.paper} />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 7} cy={-78 + Math.sin((a * Math.PI) / 180) * 7} r="2.6" fill={C.char} stroke="none" />
        ))}
      </motion.g>
      {/* marquee */}
      <path d="M-40 -50 h80 v-10 h-80 z" fill={C.red} />
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
      <motion.path d="M0 -122 V-134" animate={live ? { rotate: 360 } : undefined} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ originX: '0px', originY: '-122px' }} />
      <path d="M0 -122 L8 -118" />
      {/* timetable banner */}
      <path d="M-20 -88 h40 v40 h-40 z" fill={C.paper} />
      <path d="M-20 -78 h40 M-20 -68 h40 M-20 -58 h40 M-6 -88 v40 M8 -88 v40" fill="none" strokeWidth="1.2" />
      <path d="M-6 -78 h14 v10 h-14 z" fill={C.gold} strokeWidth="1.2" />
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

/* the environment around a landmark in the mission detail scene */
export function MissionScene({ id, live = true, title }) {
  return (
    <svg className="out__scene-svg" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
      <defs>
        <linearGradient id="out-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe3c6" />
          <stop offset="1" stopColor="#dfcca4" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#out-sky)" />
      <motion.g animate={live ? { x: [0, 30, 0] } : undefined} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} fill="none" stroke={C.ink} strokeOpacity="0.35" strokeWidth="1.6">
        <path d="M90 90 q20 -22 44 -6 q18 -14 34 4 q16 0 16 12 h-104 q-6 -10 10 -10 z" fill="#f3ead6" />
        <path d="M560 70 q20 -20 40 -4 q20 -12 32 6 h-82 z" fill="#f3ead6" />
      </motion.g>
      <path d="M0 330 Q120 250 260 300 T520 280 T800 300 V520 H0 Z" fill="#b9b08a" stroke={C.ink} strokeOpacity="0.35" strokeWidth="1.6" />
      <path d="M0 380 Q160 330 330 370 T640 350 T800 370 V520 H0 Z" fill={C.olive} fillOpacity="0.75" stroke={C.ink} strokeOpacity="0.4" strokeWidth="1.6" />
      <path d="M0 430 Q200 400 400 420 T800 410 V520 H0 Z" fill={C.wood} fillOpacity="0.55" />
      <path d="M120 520 C220 470 330 470 400 452" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="12 10" strokeLinecap="round" />
      {[[110, 372], [150, 380], [660, 360], [700, 368], [740, 362]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l-12 22 h24 z`} fill={C.oliveDk} stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" />
      ))}
      <g transform={`translate(400 452) scale(${id === 'hologram' ? 1.45 : 1.85})`}>
        <Landmark id={id} live={live} />
      </g>
      <rect width="800" height="520" fill="none" stroke={C.ink} strokeOpacity="0.5" strokeWidth="3" />
    </svg>
  );
}
