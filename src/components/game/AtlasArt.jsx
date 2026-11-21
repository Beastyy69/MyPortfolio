import { memo } from 'react';

/* ─────────────────────────────────────────────────────────────
   Code Frontier Atlas — the hand‑drawn map illustration.
   Everything is original vector "ink" on weathered parchment:
   a wobble filter roughens static linework, paper grain and stains
   are generated, and each region owns a landmark whose small
   animation wakes up when the region is hovered or selected.
   ───────────────────────────────────────────────────────────── */

export const AW = 1200;
export const AH = 640;

const INK = '#3a2e24';
const INK_SOFT = 'rgba(58,46,36,0.55)';
const PAPER = '#d8c9a3';
const RED = '#8a3d33';
const OLIVE = '#5d6b3f';
const BROWN = '#6e5232';
const GOLD = '#b8954a';
const BLUE = '#5d6f82';

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

// wobbly closed outline around a centre — used for region borders and contours
export function blob(cx, cy, rx, ry, seed, wob = 0.1, n = 28) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * wob;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  let d = '';
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % n];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    d += i === 0 ? `M${m[0].toFixed(1)} ${m[1].toFixed(1)}` : '';
    const nq = pts[(i + 2) % n];
    const m2 = [(q[0] + nq[0]) / 2, (q[1] + nq[1]) / 2];
    d += ` Q${q[0].toFixed(1)} ${q[1].toFixed(1)} ${m2[0].toFixed(1)} ${m2[1].toFixed(1)}`;
  });
  return `${d}Z`;
}

function Pine({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -24 L-9 -6 L-4 -7 L-11 6 L11 6 L4 -7 L9 -6 Z" fill={OLIVE} opacity="0.75" />
      <path d="M0 -24 L-9 -6 L-4 -7 L-11 6 L11 6 L4 -7 L9 -6 Z M0 6 V11" fill="none" stroke={INK} strokeWidth="1.4" />
    </g>
  );
}
function Bush({ x, y }) {
  return <path d={`M${x - 8} ${y} q2 -9 8 -8 q6 -6 9 2 q5 1 3 6 Z`} fill={OLIVE} opacity="0.55" stroke={INK} strokeWidth="1.1" />;
}
function Peak({ x, y, s = 1, snow = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-46 20 L-8 -38 L4 -22 L12 -32 L48 20 Z" fill="#c4b38c" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M-8 -38 L-2 -10 M12 -32 L16 -6 M-30 8 L-22 -2 M-24 14 L-14 2 M24 4 L32 14" stroke={INK} strokeWidth="1.1" fill="none" />
      {snow && <path d="M-8 -38 L-16 -26 L-10 -24 L-6 -30 L-2 -24 L4 -22 Z" fill="#efe4cc" stroke={INK} strokeWidth="1" />}
    </g>
  );
}
const Hatch = ({ x, y, n = 5, len = 10, gap = 5, rot = 30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={INK_SOFT} strokeWidth="1">
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${i * gap} 0 v${len}`} />
    ))}
  </g>
);

/* ───────────── regions (landmarks + their hover animations) ───────────── */

function Academy() {
  return (
    <g>
      {/* canyon walls */}
      <path d="M30 520 L70 500 L120 512 L160 498 L210 510 L250 496 L300 512 L300 600 L30 600 Z" fill="#b89e74" stroke={INK} strokeWidth="1.8" />
      <path d="M40 560 L90 540 L150 556 L210 538 L280 556" fill="none" stroke={INK} strokeWidth="1.4" />
      <path d="M60 600 Q120 570 170 586 T290 600" fill="#9a7f58" stroke={INK} strokeWidth="1.2" />
      <Hatch x={60} y={516} n={6} len={14} gap={7} rot={-12} />
      <Hatch x={180} y={512} n={7} len={14} gap={7} rot={-8} />
      {/* stone academy */}
      <g transform="translate(70 380)">
        <path d="M0 70 H120 V78 H0 Z M-6 78 H126 V86 H-6 Z" fill="#cbbb95" stroke={INK} strokeWidth="1.5" />
        <path d="M6 30 H114 V70 H6 Z" fill="#d4c39d" stroke={INK} strokeWidth="1.5" />
        {[16, 40, 64, 88].map((x) => (
          <path key={x} d={`M${x} 32 v38 M${x + 12} 32 v38`} stroke={INK} strokeWidth="1.3" />
        ))}
        <path d="M0 30 L60 4 L120 30 Z" fill="#c4ad84" stroke={INK} strokeWidth="1.6" />
        <circle cx="60" cy="20" r="5" fill="none" stroke={INK} strokeWidth="1.2" />
        <path d="M60 4 V-14" stroke={INK} strokeWidth="1.6" />
        <path className="atl-anim atl-flag" d="M60 -14 L76 -10 L60 -5 Z" fill={RED} stroke={INK} strokeWidth="1" />
      </g>
      {/* birds over the canyon */}
      <g className="atl-anim atl-birds" fill="none" stroke={INK} strokeWidth="1.3">
        <path d="M215 430 q5 -5 9 0 q4 -5 9 0" />
        <path d="M240 418 q4 -4 7 0 q3 -4 7 0" />
      </g>
    </g>
  );
}

function BridgeTown() {
  const houses = [
    [390, 160, 0],
    [420, 150, 1],
    [452, 166, 0],
    [400, 192, 1],
    [440, 198, 0],
  ];
  return (
    <g>
      {houses.map(([x, y, t], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x="0" y="0" width="22" height="16" fill="#d4c39d" stroke={INK} strokeWidth="1.3" />
          <path d="M-3 0 L11 -11 L25 0 Z" fill={t ? RED : BROWN} opacity="0.85" stroke={INK} strokeWidth="1.3" />
          <rect x="8" y="7" width="6" height="9" fill={INK} opacity="0.7" />
        </g>
      ))}
      {/* workshop with gear + chimney */}
      <g transform="translate(470 120)">
        <rect x="0" y="10" width="40" height="26" fill="#cbb991" stroke={INK} strokeWidth="1.4" />
        <path d="M0 10 L10 0 L20 10 L30 0 L40 10" fill="none" stroke={INK} strokeWidth="1.4" />
        <rect x="30" y="-10" width="7" height="12" fill={BROWN} stroke={INK} strokeWidth="1.2" />
        <g className="atl-anim atl-smoke" fill={INK} opacity="0.35">
          <circle cx="34" cy="-16" r="3" />
          <circle cx="38" cy="-24" r="4" />
        </g>
        <g transform="translate(-14 24)">
          <g className="atl-anim atl-spin">
            <circle r="10" fill={GOLD} opacity="0.8" stroke={INK} strokeWidth="1.3" />
            {[0, 45, 90, 135].map((a) => (
              <rect key={a} x="-2" y="-13" width="4" height="26" fill={GOLD} stroke={INK} strokeWidth="0.9" transform={`rotate(${a})`} />
            ))}
            <circle r="3.5" fill={PAPER} stroke={INK} strokeWidth="1.2" />
          </g>
        </g>
      </g>
    </g>
  );
}

function Fortress() {
  return (
    <g transform="translate(560 470)">
      <path d="M-70 30 H70 V-6 H-70 Z" fill="#cbb991" stroke={INK} strokeWidth="1.6" />
      {/* crenellations */}
      <path d="M-70 -6 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8" fill="none" stroke={INK} strokeWidth="1.4" />
      <rect x="-88" y="-30" width="24" height="60" fill="#d4c39d" stroke={INK} strokeWidth="1.6" />
      <rect x="64" y="-30" width="24" height="60" fill="#d4c39d" stroke={INK} strokeWidth="1.6" />
      <path d="M-92 -30 L-76 -46 L-60 -30 Z M60 -30 L76 -46 L92 -30 Z" fill={BLUE} opacity="0.8" stroke={INK} strokeWidth="1.4" />
      <path d="M-12 30 V8 a12 12 0 0 1 24 0 V30 Z" fill={INK} opacity="0.75" />
      {/* banner with an open book */}
      <path d="M0 -14 V-44" stroke={INK} strokeWidth="1.6" />
      <g className="atl-anim atl-flag">
        <path d="M0 -44 h26 v16 l-6 -3 l-7 3 l-6 -3 l-7 3 Z" fill={OLIVE} stroke={INK} strokeWidth="1.1" />
        <path d="M5 -38 q4 -2 8 0 q4 -2 8 0 M5 -34 q4 -2 8 0 q4 -2 8 0" fill="none" stroke={PAPER} strokeWidth="1" />
      </g>
      {[-50, -30, 30, 50].map((x) => (
        <rect key={x} x={x - 3} y="2" width="6" height="9" fill={INK} opacity="0.6" />
      ))}
      {/* river ripples beside the walls */}
      <path className="atl-anim atl-river" d="M-120 40 q8 -4 16 0 t16 0 M-96 58 q8 -4 16 0 t16 0 M-70 74 q8 -4 16 0 t16 0" fill="none" stroke={BLUE} strokeWidth="1.6" />
    </g>
  );
}

function Observatory() {
  return (
    <g>
      <Peak x={660} y={190} s={1.05} />
      <Peak x={810} y={200} s={0.95} />
      <Peak x={735} y={160} s={1.35} />
      <Peak x={885} y={150} s={0.8} snow={false} />
      {/* domed observatory on the summit */}
      <g transform="translate(735 96)">
        <rect x="-18" y="0" width="36" height="16" fill="#d4c39d" stroke={INK} strokeWidth="1.5" />
        <path d="M-20 0 a20 18 0 0 1 40 0 Z" fill="#c4b38c" stroke={INK} strokeWidth="1.5" />
        <g className="atl-anim atl-scope">
          <path d="M-2 -14 L14 -30 L18 -26 L2 -10 Z" fill={BLUE} stroke={INK} strokeWidth="1.2" />
        </g>
      </g>
      {/* research ruins */}
      <g transform="translate(620 240)" stroke={INK} strokeWidth="1.4" fill="#cbbb95">
        <rect x="0" y="0" width="9" height="30" />
        <rect x="18" y="8" width="9" height="22" />
        <path d="M36 30 V16 l5 -4 l4 6 V30 Z" />
        <rect x="-4" y="-4" width="34" height="5" />
        <path d="M-8 32 H52" fill="none" />
      </g>
      <g className="atl-anim atl-cloud" fill={PAPER} stroke={INK} strokeWidth="1.2">
        <path d="M790 70 q6 -12 18 -6 q8 -10 18 0 q10 0 8 8 H786 q-4 -2 4 -2 Z" />
      </g>
    </g>
  );
}

function Mine() {
  return (
    <g>
      <path d="M820 560 Q870 450 950 470 Q1010 480 1040 560 Z" fill="#b89e74" stroke={INK} strokeWidth="1.8" />
      <Hatch x={870} y={480} n={5} len={12} gap={6} rot={20} />
      <Hatch x={985} y={492} n={4} len={12} gap={6} rot={-25} />
      {/* cave mouth with timber frame */}
      <path d="M905 560 V528 a25 25 0 0 1 50 0 V560 Z" fill={INK} opacity="0.85" />
      <path d="M900 560 V522 M960 560 V522 M896 522 H964" stroke={BROWN} strokeWidth="5" />
      <path d="M900 560 V522 M960 560 V522 M896 522 H964" stroke={INK} strokeWidth="1.1" fill="none" />
      {/* rails */}
      <path d="M915 560 L880 606 M945 560 L960 606" stroke={INK} strokeWidth="1.3" />
      {[570, 582, 594].map((y, i) => (
        <path key={y} d={`M${908 - i * 9} ${y} H${949 + i * 3}`} stroke={INK} strokeWidth="1.1" />
      ))}
      <g className="atl-anim atl-cart">
        <path d="M900 578 h30 l-4 12 h-22 Z" fill={BROWN} stroke={INK} strokeWidth="1.3" />
        <path d="M906 574 l4 -6 l5 6 M916 574 l4 -7 l4 7" fill={BLUE} stroke={INK} strokeWidth="1" />
        <circle cx="909" cy="592" r="3" fill={INK} />
        <circle cx="922" cy="592" r="3" fill={INK} />
      </g>
      {/* data crystals */}
      <g fill={BLUE} opacity="0.85" stroke={INK} strokeWidth="1.1">
        <path d="M985 552 l6 -18 l6 18 Z" />
        <path d="M995 556 l5 -12 l5 12 Z" />
        <path d="M860 556 l5 -14 l5 14 Z" />
      </g>
      <g transform="translate(968 520)">
        <path d="M0 0 V10" stroke={INK} strokeWidth="1.2" />
        <rect className="atl-anim atl-lamp" x="-4" y="10" width="8" height="9" fill={GOLD} stroke={INK} strokeWidth="1.1" />
      </g>
    </g>
  );
}

function Outpost() {
  return (
    <g>
      <path d="M980 330 Q1050 270 1150 300 L1150 340 L980 340 Z" fill="#c4b38c" stroke={INK} strokeWidth="1.6" />
      <g transform="translate(1000 270)" fill="#cbb991" stroke={INK} strokeWidth="1.4">
        <rect x="0" y="20" width="56" height="40" />
        <path d="M0 20 l14 -12 v12 l14 -12 v12 l14 -12 v12 l14 -12 v12" fill="none" />
        <rect x="60" y="-6" width="9" height="66" fill={BROWN} />
        {[8, 24, 40].map((x) => (
          <rect key={x} x={x} y="34" width="8" height="10" fill={INK} opacity="0.55" stroke="none" />
        ))}
      </g>
      <g className="atl-anim atl-smoke" fill={INK} opacity="0.35">
        <circle cx="1064" cy="256" r="4" />
        <circle cx="1070" cy="244" r="5" />
      </g>
      {/* communication tower */}
      <g transform="translate(1110 330)" stroke={INK} fill="none" strokeWidth="1.7">
        <path d="M-18 0 L0 -150 L18 0" />
        <path d="M-14 -30 L14 -30 M-10 -64 L10 -64 M-7 -98 L7 -98 M-14 -30 L10 -64 M14 -30 L-10 -64 M-10 -64 L7 -98 M10 -64 L-7 -98" strokeWidth="1.1" />
        <g transform="translate(0 -110)">
          <g className="atl-anim atl-dish">
            <path d="M0 0 L-16 -6 A18 18 0 0 0 -10 12 Z" fill={GOLD} strokeWidth="1.3" />
          </g>
        </g>
        <rect className="atl-anim atl-beacon" x="-3" y="-158" width="6" height="6" fill={RED} stroke="none" />
      </g>
    </g>
  );
}

export const REGION_ART = { foundations: Academy, web: BridgeTown, python: Fortress, ailab: Observatory, vault: Mine, deploy: Outpost };

/* ───────────── static base: paper, river, contours, forests, frame ───────────── */
export const AtlasBase = memo(function AtlasBase() {
  const contours = [
    ...[70, 110, 150, 190].map((r, i) => ({ d: blob(740, 180, r * 1.35, r * 0.75, 11 + i, 0.12), k: `a${i}` })),
    ...[50, 85, 120].map((r, i) => ({ d: blob(1060, 300, r * 1.2, r * 0.6, 31 + i, 0.14), k: `b${i}` })),
    ...[60, 100].map((r, i) => ({ d: blob(170, 540, r * 1.6, r * 0.55, 51 + i, 0.12), k: `c${i}` })),
  ];
  const pines = [
    [60, 300], [90, 280], [110, 320], [70, 350], [140, 300], [520, 250], [545, 270], [500, 290], [610, 360], [640, 380], [380, 520], [410, 545], [350, 560], [700, 560], [730, 530], [760, 575], [1110, 450], [1140, 480], [1090, 500], [1160, 410], [880, 300], [960, 250], [210, 130], [240, 110], [180, 160],
  ];
  return (
    <g>
      <defs>
        <filter id="atl-rough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2.6" />
        </filter>
        <filter id="atl-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="9" />
          <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0.16 0" />
        </filter>
        <radialGradient id="atl-burn" cx="50%" cy="48%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#4a3420" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id="atl-stain">
          <stop offset="0%" stopColor="#8a6a3a" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#8a6a3a" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#8a6a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* paper */}
      <rect width={AW} height={AH} fill={PAPER} />
      <ellipse cx="300" cy="140" rx="160" ry="90" fill="url(#atl-stain)" />
      <ellipse cx="980" cy="560" rx="120" ry="70" fill="url(#atl-stain)" />
      <ellipse cx="640" cy="330" rx="260" ry="150" fill="url(#atl-stain)" opacity="0.6" />
      <rect width={AW} height={AH} filter="url(#atl-grain)" />
      {/* fold creases */}
      <path d={`M${AW / 3} 0 V${AH} M${(AW * 2) / 3} 0 V${AH} M0 ${AH / 2} H${AW}`} stroke="rgba(58,46,36,0.08)" strokeWidth="2" />

      <g filter="url(#atl-rough)">
        {/* contour lines */}
        {contours.map((c) => (
          <path key={c.k} d={c.d} fill="none" stroke={INK_SOFT} strokeWidth="0.9" strokeDasharray={c.k.startsWith('c') ? '5 4' : undefined} opacity="0.55" />
        ))}

        {/* river */}
        <path d="M228 -10 C 250 110, 300 220, 286 330 S 360 470, 470 520 S 640 540, 668 650" fill="none" stroke={BLUE} strokeWidth="14" opacity="0.32" strokeLinecap="round" />
        <path d="M228 -10 C 250 110, 300 220, 286 330 S 360 470, 470 520 S 640 540, 668 650" fill="none" stroke={INK} strokeWidth="1.2" opacity="0.6" />
        {/* lake */}
        <path d={blob(1110, 590, 70, 32, 77, 0.14)} fill={BLUE} opacity="0.28" stroke={INK} strokeWidth="1.2" />

        {pines.map(([x, y], i) => (
          <Pine key={i} x={x} y={y} s={0.85 + (i % 3) * 0.15} />
        ))}
        {[
          [330, 400], [470, 300], [640, 440], [800, 520], [1000, 420], [150, 230], [260, 230],
        ].map(([x, y], i) => (
          <Bush key={i} x={x} y={y} />
        ))}

        {/* ink marks & notes */}
        <g stroke={INK} strokeWidth="1.4" fill="none">
          <path d="M600 600 l8 8 m0 -8 l-8 8" />
          <path d="M1150 170 l7 7 m0 -7 l-7 7" />
        </g>
        <g transform="translate(330 600)" fill={INK}>
          <ellipse cx="0" cy="0" rx="6" ry="4" />
          <path d="M-6 -1 l-5 -3 M-6 2 l-5 3 M6 -1 l5 -3 M6 2 l5 3 M-2 -4 l-2 -4 M2 -4 l2 -4" stroke={INK} strokeWidth="1" />
          <text x="14" y="4" fontSize="12" fontStyle="italic" fontFamily="Georgia, 'Times New Roman', serif">
            here be bugs
          </text>
        </g>
      </g>

      {/* compass rose */}
      <g transform="translate(1130 110)">
        <circle r="34" fill="none" stroke={INK} strokeWidth="1.2" />
        <circle r="26" fill="none" stroke={INK} strokeWidth="0.8" strokeDasharray="2 3" />
        <path d="M0 -44 L7 0 L0 44 L-7 0 Z" fill={INK} />
        <path d="M-44 0 L0 -6 L44 0 L0 6 Z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        <path d="M0 -44 L7 0 L0 0 Z" fill={RED} />
        <text y="-50" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill={INK}>
          N
        </text>
      </g>

      {/* scale bar */}
      <g transform="translate(40 610)" fontFamily="Georgia, serif" fontSize="11" fill={INK}>
        <rect x="0" y="0" width="40" height="6" fill={INK} />
        <rect x="40" y="0" width="40" height="6" fill="none" stroke={INK} />
        <rect x="80" y="0" width="40" height="6" fill={INK} />
        <text x="0" y="20">0</text>
        <text x="120" y="20" textAnchor="end">
          300 commits
        </text>
      </g>

      {/* frame + burnt edge */}
      <rect width={AW} height={AH} fill="url(#atl-burn)" />
      <rect x="10" y="10" width={AW - 20} height={AH - 20} fill="none" stroke={INK} strokeWidth="2" filter="url(#atl-rough)" />
      <rect x="16" y="16" width={AW - 32} height={AH - 32} fill="none" stroke={INK} strokeWidth="0.8" />
    </g>
  );
});
