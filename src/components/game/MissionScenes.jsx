/* ─────────────────────────────────────────────────────────────
   Mission Select scenes — one original illustrated environment
   per project, drawn as muted field sketches (400 × 240).
   ───────────────────────────────────────────────────────────── */

const INK = '#2f251d';
const C = {
  sky: '#c9bb98',
  skyDusk: '#a99677',
  night: '#3a4048',
  hill: '#5d6b3f',
  hillDark: '#46522f',
  brown: '#6e5232',
  brownDark: '#4a3826',
  brick: '#8a3d33',
  gold: '#b8954a',
  cream: '#ece0c4',
  blue: '#5d6f82',
  slate: '#4d5b69',
};

const Ground = ({ y = 200, fill = C.hillDark }) => <rect x="0" y={y} width="400" height={240 - y} fill={fill} />;

function Market() {
  const stalls = [
    [30, 'brick'],
    [130, 'gold'],
    [230, 'blue'],
    [320, 'brick'],
  ];
  return (
    <>
      <rect width="400" height="240" fill={C.sky} />
      <path d="M0 150 Q100 120 200 140 T400 130 V240 H0 Z" fill="#b3a27c" />
      <Ground y={190} fill={C.brown} />
      {stalls.map(([x, tone], i) => (
        <g key={i} transform={`translate(${x} 0)`}>
          <rect x="0" y="140" width="62" height="50" fill={C.cream} stroke={INK} strokeWidth="2" />
          <path d="M-6 140 L6 118 H56 L68 140 Z" fill={C[tone]} stroke={INK} strokeWidth="2" />
          <path d="M6 140 v-22 M22 140 v-22 M40 140 v-22" stroke={INK} strokeWidth="1" opacity="0.5" />
          <rect x="10" y="160" width="14" height="12" fill={C.gold} stroke={INK} strokeWidth="1.5" />
          <rect x="30" y="156" width="20" height="16" fill={C.hill} stroke={INK} strokeWidth="1.5" />
          <rect x="28" y="106" width="6" height="10" fill={C.gold} stroke={INK} strokeWidth="1.2" />
        </g>
      ))}
      {/* recommendation threads between stalls */}
      <g fill="none" stroke={C.brick} strokeWidth="2" strokeDasharray="5 4">
        <path d="M62 110 Q110 70 160 104" />
        <path d="M192 104 Q240 60 290 100" />
        <path d="M160 100 Q250 40 350 100" opacity="0.6" />
      </g>
      <path d="M156 98 l6 6 l-9 2 Z M286 94 l6 6 l-9 2 Z" fill={C.brick} />
      <text x="232" y="56" fontSize="11" fill={INK} fontFamily="Georgia, serif" fontStyle="italic">
        score 0.93
      </text>
    </>
  );
}

function Watchtower() {
  return (
    <>
      <rect width="400" height="240" fill={C.night} />
      {[[40, 30], [120, 18], [300, 26], [350, 50], [220, 40]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="3" height="3" fill={C.cream} opacity="0.6" />
      ))}
      <path d="M0 150 L80 120 L160 140 L240 110 L320 130 L400 115 V240 H0 Z" fill="#2c3238" />
      {/* searchlight cone */}
      <path d="M78 74 L250 186 L330 186 Z" fill={C.cream} opacity="0.14" />
      {/* tower */}
      <g stroke={INK} strokeWidth="2">
        <path d="M60 200 L72 80 M96 200 L84 80 M64 160 L92 160 M66 120 L90 120 M64 160 L90 120 M92 160 L66 120" fill="none" stroke="#1c1814" />
        <rect x="62" y="64" width="32" height="18" fill={C.slate} />
        <path d="M58 64 L78 50 L98 64 Z" fill={C.brick} />
        <circle cx="90" cy="74" r="5" fill={C.cream} />
      </g>
      {/* camera network: poles linked back to the tower */}
      {[[170, 150], [262, 140], [360, 150]].map(([x, y]) => (
        <g key={x} stroke="#1c1814" strokeWidth="2">
          <path d={`M${x} 200 V${y}`} />
          <rect x={x - 7} y={y - 8} width="14" height="9" fill={C.slate} />
          <path d={`M90 74 Q${(90 + x) / 2} ${y - 50} ${x} ${y - 8}`} fill="none" stroke={C.gold} strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" />
        </g>
      ))}
      {/* road */}
      <path d="M0 200 H400 V240 H0 Z" fill="#24282c" />
      <path d="M10 220 H50 M80 220 H120 M150 220 H190 M220 220 H260 M290 220 H330 M360 220 H400" stroke={C.gold} strokeWidth="3" opacity="0.6" />
      {/* vehicles with detection boxes */}
      {[
        [200, C.brick, 'car 0.97'],
        [300, C.blue, 'car 0.91'],
      ].map(([x, tone, label]) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <rect x="0" y="186" width="54" height="16" fill={tone} stroke={INK} strokeWidth="2" />
          <path d="M10 186 L18 174 H40 L48 186" fill={tone} stroke={INK} strokeWidth="2" />
          <circle cx="12" cy="204" r="5" fill={INK} />
          <circle cx="42" cy="204" r="5" fill={INK} />
          <rect x="-6" y="166" width="66" height="46" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="5 3" />
          <rect x="-6" y="154" width="56" height="12" fill={C.gold} />
          <text x="-2" y="163" fontSize="9" fill={INK} fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <g transform="translate(150 178)">
        <circle cx="0" cy="0" r="4" fill={C.cream} />
        <path d="M0 4 V18 M-6 10 H6 M0 18 L-4 26 M0 18 L4 26" stroke={C.cream} strokeWidth="2" />
        <rect x="-10" y="-8" width="20" height="38" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3 2" />
      </g>
    </>
  );
}

function RelayPass() {
  const relays = [
    [70, 104],
    [200, 64],
    [330, 96],
  ];
  return (
    <>
      <rect width="400" height="240" fill={C.skyDusk} />
      <path d="M0 200 L70 110 L120 160 L200 70 L270 150 L330 100 L400 170 V240 H0 Z" fill={C.slate} />
      <path d="M0 220 L90 170 L160 200 L240 160 L320 200 L400 180 V240 H0 Z" fill={C.hillDark} />
      <path d="M70 110 L60 124 L80 124 Z M200 70 L188 88 L212 88 Z M330 100 L320 114 L340 114 Z" fill={C.cream} />
      {/* cables + packets */}
      <path d="M70 92 Q135 110 200 52 Q265 110 330 84" fill="none" stroke={INK} strokeWidth="1.5" />
      {[[110, 100], [160, 78], [250, 82], [292, 92]].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill={C.gold} stroke={INK} strokeWidth="1.2" />
      ))}
      {relays.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="2">
          <path d="M-8 6 L0 -16 L8 6" fill="none" />
          <rect x="-5" y="-22" width="10" height="7" fill={C.brick} />
        </g>
      ))}
      {/* gate with throughput counter */}
      <g transform="translate(150 186)">
        <rect x="0" y="0" width="100" height="10" fill={C.brown} stroke={INK} strokeWidth="2" />
        <rect x="4" y="10" width="10" height="30" fill={C.brown} stroke={INK} strokeWidth="2" />
        <rect x="86" y="10" width="10" height="30" fill={C.brown} stroke={INK} strokeWidth="2" />
        <rect x="26" y="-18" width="48" height="16" fill={C.cream} stroke={INK} strokeWidth="2" />
        <text x="50" y="-6" textAnchor="middle" fontSize="10" fill={INK} fontFamily="monospace">
          2k rps
        </text>
      </g>
      {[30, 52, 300, 322, 344].map((x) => (
        <g key={x} transform={`translate(${x} 214)`}>
          <rect x="0" y="-10" width="16" height="10" fill={C.gold} stroke={INK} strokeWidth="1.5" />
          <circle cx="4" cy="2" r="2.5" fill={INK} />
          <circle cx="12" cy="2" r="2.5" fill={INK} />
        </g>
      ))}
    </>
  );
}

function WeatherStation() {
  const bars = [40, 62, 54, 80, 72, 96, 90];
  return (
    <>
      <rect width="400" height="240" fill={C.sky} />
      <g fill={C.cream} stroke={INK} strokeWidth="1.5">
        <path d="M40 50 q10 -16 26 -8 q12 -12 24 0 q14 0 12 12 H36 q-6 -2 4 -4 Z" />
        <path d="M280 34 q8 -12 20 -6 q10 -10 20 0 q10 0 8 10 H276 q-4 -2 4 -4 Z" />
      </g>
      <path d="M0 170 Q120 130 240 160 T400 150 V240 H0 Z" fill={C.hill} />
      {/* crop rows as a bar chart */}
      {bars.map((h, i) => (
        <rect key={i} x={40 + i * 26} y={220 - h * 0.7} width="16" height={h * 0.7} fill={i === 6 ? C.brick : C.gold} stroke={INK} strokeWidth="1.5" />
      ))}
      <path d="M48 190 L74 175 L100 182 L126 160 L152 166 L178 146 L204 150" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="4 3" />
      {/* station */}
      <g transform="translate(300 120)" stroke={INK} strokeWidth="2">
        <path d="M0 100 V0" />
        <path d="M-18 -4 H18" />
        <circle cx="-18" cy="-4" r="5" fill={C.brick} />
        <circle cx="18" cy="-4" r="5" fill={C.brick} />
        <path d="M0 -4 V-20 L16 -14 L0 -8" fill={C.gold} />
        <rect x="-14" y="60" width="28" height="22" fill={C.cream} />
      </g>
      {/* balloon */}
      <g transform="translate(240 50)">
        <circle r="14" fill={C.cream} stroke={INK} strokeWidth="2" />
        <path d="M0 14 Q4 40 -4 60" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="-6" y="58" width="10" height="8" fill={C.brown} stroke={INK} strokeWidth="1.2" />
      </g>
    </>
  );
}

function GameWorkshop() {
  const px = (x, y, w, h, fill) => <rect x={x} y={y} width={w} height={h} fill={fill} />;
  return (
    <>
      <rect width="400" height="240" fill="#cdbb95" />
      {/* timber wall planks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${i * 52} 0 V176`} stroke="rgba(47,37,29,0.18)" strokeWidth="2" />
      ))}
      <rect x="0" y="176" width="400" height="64" fill={C.brown} />
      <path d="M0 176 H400" stroke={INK} strokeWidth="2" />
      {/* level blueprint pinned to the wall */}
      <g transform="translate(26 22)">
        <rect width="128" height="84" fill="#5d6f82" stroke={INK} strokeWidth="2" />
        <path d="M8 66 H40 V52 H66 V66 H90 V40 H120" fill="none" stroke={C.cream} strokeWidth="2" />
        <path d="M14 28 h20 M46 20 h14 M80 26 h18" stroke={C.cream} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="104" cy="30" r="5" fill="none" stroke={C.cream} strokeWidth="1.5" />
        <circle cx="64" cy="2" r="4" fill={C.brick} stroke={INK} strokeWidth="1.2" />
      </g>
      {/* tool rack */}
      <g transform="translate(176 24)" stroke={INK} strokeWidth="2">
        <path d="M0 0 H90" />
        <path d="M14 0 v34 M10 34 h8" />
        <path d="M40 0 v30 l-6 10 h12 l-6 -10" fill={C.gold} />
        <path d="M70 0 v24 a8 8 0 1 0 0 16" fill="none" />
      </g>
      {/* workbench */}
      <g stroke={INK} strokeWidth="2">
        <rect x="150" y="128" width="230" height="14" fill={C.gold} />
        <path d="M164 142 V200 M366 142 V200" />
        {/* monitor with the agent's original level */}
        <rect x="190" y="70" width="110" height="58" fill="#2c3238" />
        {px(196, 112, 40, 10, C.hill)}
        {px(250, 104, 44, 18, C.hill)}
        {px(240, 92, 8, 8, C.slate)}
        {px(242, 88, 4, 4, C.brick)}
        <path d="M206 108 Q228 80 240 92" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="236" y="128" width="18" height="6" fill={INK} />
        {/* controller prototype + chip */}
        <rect x="316" y="114" width="44" height="14" rx="6" fill={C.brick} />
        <rect x="160" y="116" width="20" height="12" fill={C.slate} />
      </g>
      {/* reward graph note */}
      <g transform="translate(320 30)">
        <rect width="62" height="50" fill={C.cream} stroke={INK} strokeWidth="1.5" transform="rotate(4)" />
        <path d="M8 40 L18 34 L28 36 L38 24 L52 14" fill="none" stroke={C.brick} strokeWidth="2" transform="rotate(4)" />
      </g>
      {/* little robot agent sitting on the bench (original) */}
      <g transform="translate(326 88)">
        {px(0, 8, 22, 18, C.slate)}
        {px(4, 13, 5, 5, C.cream)}
        {px(13, 13, 5, 5, C.cream)}
        {px(9, 0, 4, 8, INK)}
        {px(6, -3, 10, 4, C.brick)}
        {px(2, 26, 6, 14, INK)}
        {px(14, 26, 6, 14, INK)}
      </g>
    </>
  );
}

function SortingPost() {
  const bins = [
    [210, 'Urgent', C.brick],
    [270, 'Later', C.gold],
    [330, 'Read', C.hill],
  ];
  return (
    <>
      <rect width="400" height="240" fill={C.sky} />
      <Ground y={200} fill={C.brown} />
      {/* post office */}
      <g stroke={INK} strokeWidth="2">
        <rect x="20" y="96" width="140" height="104" fill={C.cream} />
        <path d="M12 96 L90 52 L168 96 Z" fill={C.brick} />
        <rect x="70" y="150" width="40" height="50" fill={C.brownDark} />
        <rect x="36" y="110" width="108" height="30" fill={C.brown} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${36 + i * 18} 110 v30`} />
        ))}
        <path d="M36 125 H144" />
      </g>
      <text x="90" y="88" textAnchor="middle" fontSize="11" fill={C.cream} fontFamily="Georgia, serif">
        POST
      </text>
      {/* flying envelopes */}
      {[
        [178, 80, -8],
        [212, 60, 6],
        [250, 92, -4],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} stroke={INK} strokeWidth="1.5">
          <rect x="0" y="0" width="26" height="17" fill={C.cream} />
          <path d="M0 0 L13 10 L26 0" fill="none" />
        </g>
      ))}
      <path d="M170 110 Q220 40 300 120" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 4" />
      {bins.map(([x, label, tone]) => (
        <g key={label} transform={`translate(${x} 150)`}>
          <path d="M0 0 H50 L44 50 H6 Z" fill={tone} stroke={INK} strokeWidth="2" />
          <rect x="6" y="-6" width="38" height="10" fill={C.cream} stroke={INK} strokeWidth="1.2" />
          <text x="25" y="2" textAnchor="middle" fontSize="8" fill={INK} fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

const SCENES = {
  recommendo: Market,
  visionsight: Watchtower,
  atlas: RelayPass,
  forecastly: WeatherStation,
  pixelpilot: GameWorkshop,
  mailmind: SortingPost,
};

/* one shared grain filter, rendered once per page */
export function SceneDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="ms-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
        <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.22 0" />
      </filter>
    </svg>
  );
}

export default function MissionScene({ id, className, title }) {
  const Scene = SCENES[id] ?? Market;
  return (
    <svg className={className} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <Scene />
      <rect width="400" height="240" filter="url(#ms-grain)" opacity="0.55" style={{ mixBlendMode: 'multiply' }} />
      <rect x="1" y="1" width="398" height="238" fill="none" stroke="rgba(47,37,29,0.45)" strokeWidth="2" />
    </svg>
  );
}
