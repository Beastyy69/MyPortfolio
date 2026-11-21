// Original, theme‑aware SVG mockups for project cards. Colours come from CSS
// variables (via the .pa-* classes in projects.css) so they re‑skin per mode.

function Recommender() {
  const items = [
    [40, 40],
    [130, 30],
    [220, 48],
    [70, 120],
    [175, 112],
    [262, 128],
  ];
  return (
    <>
      {items.map(([x, y], i) =>
        items.slice(i + 1, i + 3).map(([x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x + 24} y1={y + 18} x2={x2 + 24} y2={y2 + 18} className="pa-line" />
        )),
      )}
      {items.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="48" height="36" rx="6" className={i === 4 ? 'pa-fill-accent' : 'pa-card'} />
          <rect x={x + 8} y={y + 8} width="20" height="4" rx="2" className="pa-ink" />
          <rect x={x + 8} y={y + 18} width="30" height="4" rx="2" className="pa-ink-dim" />
        </g>
      ))}
      <text x="187" y="168" className="pa-label">
        score 0.93
      </text>
    </>
  );
}

function Detection() {
  return (
    <>
      <rect x="20" y="20" width="280" height="150" rx="8" className="pa-card" />
      <path d="M20 140 L90 100 L150 130 L220 80 L300 120 L300 170 L20 170 Z" className="pa-ground" />
      <circle cx="250" cy="48" r="14" className="pa-ink-dim" />
      <rect x="62" y="70" width="40" height="78" className="pa-box" />
      <text x="62" y="64" className="pa-label">
        person 0.94
      </text>
      <rect x="150" y="104" width="86" height="44" className="pa-box pa-box--2" />
      <text x="150" y="98" className="pa-label pa-label--2">
        car 0.88
      </text>
      <rect x="250" y="94" width="30" height="30" className="pa-box pa-box--3" />
      <circle cx="82" cy="88" r="9" className="pa-ink" />
      <rect x="72" y="100" width="20" height="40" rx="4" className="pa-ink" />
      <rect x="158" y="118" width="70" height="22" rx="6" className="pa-ink" />
    </>
  );
}

function Api() {
  const svc = [
    ['gateway', 30],
    ['auth', 75],
    ['workers', 120],
  ];
  return (
    <>
      <rect x="22" y="70" width="62" height="54" rx="8" className="pa-card" />
      <text x="34" y="101" className="pa-label">
        client
      </text>
      {svc.map(([name, y]) => (
        <g key={name}>
          <path d={`M84 97 C 120 97, 120 ${y + 18}, 150 ${y + 18}`} className="pa-line pa-line--flow" />
          <rect x="150" y={y} width="86" height="36" rx="7" className={name === 'gateway' ? 'pa-fill-accent' : 'pa-card'} />
          <text x="162" y={y + 22} className={name === 'gateway' ? 'pa-label-inv' : 'pa-label'}>
            {name}
          </text>
          <path d={`M236 ${y + 18} L262 97`} className="pa-line" />
        </g>
      ))}
      <ellipse cx="282" cy="80" rx="20" ry="7" className="pa-card" />
      <path d="M262 80 V112 A20 7 0 0 0 302 112 V80" className="pa-card" />
      <text x="266" y="140" className="pa-label">
        pg
      </text>
    </>
  );
}

function Dashboard() {
  const pts = [150, 132, 140, 112, 118, 92, 98, 70, 76, 52];
  const d = pts.map((y, i) => `${i ? 'L' : 'M'}${40 + i * 26} ${y}`).join(' ');
  return (
    <>
      <rect x="20" y="20" width="280" height="150" rx="8" className="pa-card" />
      {[60, 95, 130].map((y) => (
        <line key={y} x1="36" x2="284" y1={y} y2={y} className="pa-grid" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} x={34 + i * 26} y={160 - (i + 3) * 6} width="12" height={(i + 3) * 6} rx="2" className="pa-bar" />
      ))}
      <path d={`${d}`} className="pa-trend" />
      <path d="M274 52 L300 40" className="pa-trend pa-trend--dash" />
      <circle cx="274" cy="52" r="5" className="pa-fill-accent" />
      <rect x="36" y="30" width="64" height="18" rx="4" className="pa-ink-dim" />
      <text x="214" y="42" className="pa-label">
        forecast ▲
      </text>
    </>
  );
}

function Rl() {
  const tiles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <>
      <rect x="20" y="20" width="280" height="150" className="pa-card" />
      {tiles.map((i) => (
        <rect key={i} x={20 + i * 23.4} y="150" width="23" height="20" className="pa-tile" />
      ))}
      <rect x="120" y="108" width="70" height="14" className="pa-tile" />
      <rect x="226" y="84" width="50" height="14" className="pa-tile" />
      <rect x="60" y="126" width="16" height="24" className="pa-fill-accent" />
      <rect x="64" y="130" width="4" height="4" className="pa-ink" />
      <path d="M76 126 Q 110 70 140 104" className="pa-line pa-line--flow" />
      {[150, 168, 244, 258].map((x, i) => (
        <rect key={x} x={x} y={i < 2 ? 92 : 68} width="8" height="8" className="pa-coin" />
      ))}
      <polyline points="34,64 54,58 74,62 94,46 114,50 134,36" className="pa-trend" />
      <text x="34" y="36" className="pa-label">
        reward ↑
      </text>
    </>
  );
}

const ART = { recommender: Recommender, detection: Detection, api: Api, dashboard: Dashboard, rl: Rl };

export default function ProjectArt({ kind }) {
  const Art = ART[kind];
  if (!Art) return null;
  return (
    <svg className="pa" viewBox="0 0 320 190" role="img" aria-label="Illustrative project mockup">
      <Art />
    </svg>
  );
}
