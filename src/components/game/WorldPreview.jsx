import { memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { HERO, SpriteSVG } from './sprites.jsx';

/* ─────────────────────────────────────────────────────────────
   World Preview Strip — a compact living window into Code Frontier,
   sitting under the navbar in Game mode. The Field Engineer walks a
   short looping trail past a camp, ruins, a data terminal and a
   distant factory. Parallax layers loop seamlessly; the cursor adds
   a little depth. Clicking it travels to the Ability Map.
   ───────────────────────────────────────────────────────────── */

const C = {
  far: '#4b5866',
  farDark: '#3d4853',
  hill: '#3f4a33',
  hillDark: '#2f3826',
  brown: '#5a4632',
  brownDark: '#3e3024',
  brick: '#8a3d33',
  mustard: '#b8954a',
  cream: '#e9dcc0',
  char: '#211b17',
  olive: '#5d6b3f',
  blue: '#5d6f82',
};

const step = (v, s) => Math.round(v / s) * s;
function ridge(width, base, fn, s) {
  let d = `M0 160 L0 ${step(base - fn(0), s)}`;
  for (let x = 0; x <= width; x += s) {
    const y = step(base - fn(x), s);
    d += ` L${x} ${y} L${x + s} ${y}`;
  }
  return `${d} L${width} 160 Z`;
}
// periodic so the loop is seamless at 1200 units
const P = (x, k) => Math.sin((x / 1200) * Math.PI * 2 * k);

const Far = memo(function Far() {
  const d = ridge(1200, 112, (x) => 34 + 18 * P(x, 3) + 10 * P(x, 7), 8);
  return (
    <g>
      <path d={d} fill={C.far} />
      {/* distant data factory */}
      <g fill={C.farDark}>
        <rect x="820" y="70" width="60" height="40" />
        <rect x="880" y="82" width="34" height="28" />
        <rect x="846" y="44" width="8" height="26" />
        <rect x="862" y="52" width="7" height="18" />
      </g>
      <g className="wp__smoke" fill={C.cream} opacity="0.2">
        <rect x="845" y="34" width="9" height="8" />
        <rect x="851" y="24" width="12" height="9" />
      </g>
    </g>
  );
});

function Pine({ x, y, s = 1 }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -34 L-8 -20 L-4 -20 L-11 -8 L-6 -8 L-14 4 L14 4 L6 -8 L11 -8 L4 -20 L8 -20 Z M-2 4 h4 v6 h-4 Z" fill={C.hillDark} />;
}

const Mid = memo(function Mid() {
  const d = ridge(1200, 132, (x) => 18 + 10 * P(x, 4) + 6 * P(x, 9), 6);
  const pines = [40, 90, 150, 330, 380, 470, 610, 700, 760, 990, 1050, 1140];
  return (
    <g>
      {/* jungle ruins */}
      <g fill={C.hillDark}>
        <rect x="220" y="96" width="90" height="30" />
        <rect x="236" y="80" width="58" height="16" />
        <rect x="250" y="66" width="30" height="14" />
        <rect x="259" y="72" width="12" height="10" fill={C.mustard} opacity="0.45" />
      </g>
      {/* data terminal */}
      <g>
        <rect x="540" y="88" width="34" height="40" fill={C.char} />
        <rect x="545" y="93" width="24" height="14" fill={C.blue} opacity="0.7" />
        <rect x="548" y="97" width="12" height="2" fill={C.cream} className="wp__blink" />
        <rect x="554" y="74" width="4" height="14" fill={C.char} />
        <rect x="551" y="70" width="10" height="5" fill={C.brick} className="wp__beacon" />
      </g>
      <path d={d} fill={C.hill} />
      {pines.map((x, i) => (
        <Pine key={x} x={x} y={130} s={0.8 + (i % 3) * 0.15} />
      ))}
    </g>
  );
});

const Near = memo(function Near() {
  return (
    <g>
      <rect x="0" y="138" width="1200" height="22" fill={C.brownDark} />
      <rect x="0" y="134" width="1200" height="6" fill={C.hillDark} />
      {Array.from({ length: 25 }, (_, i) => (
        <rect key={i} x={i * 48 + (i % 2) * 10} y={146 + (i % 2) * 6} width="30" height="6" fill={C.brown} opacity="0.6" />
      ))}
      {/* camp */}
      <g transform="translate(120 0)">
        <path d="M0 136 L26 100 L52 136 Z" fill={C.olive} />
        <path d="M26 100 L26 136" stroke={C.char} strokeWidth="2" />
        <path d="M20 136 L26 118 L32 136 Z" fill={C.char} />
        <g transform="translate(74 0)">
          <rect x="-10" y="132" width="20" height="4" fill={C.brownDark} />
          <path className="wp__fire" d="M-6 132 L0 116 L6 132 Z" fill={C.mustard} />
          <path className="wp__fire wp__fire--2" d="M-3 132 L0 122 L3 132 Z" fill={C.brick} />
        </g>
        <rect x="104" y="102" width="3" height="34" fill={C.char} />
        <path className="wp__flag" d="M107 103 L127 107 L107 112 Z" fill={C.brick} />
      </g>
      {/* floating platforms + a core */}
      <rect x="470" y="104" width="54" height="10" fill={C.brick} />
      <rect x="470" y="112" width="54" height="3" fill="#6b2f28" />
      <path className="wp__core" d="M497 84 l7 8 l-7 8 l-7 -8 Z" fill={C.mustard} />
      {/* signpost */}
      <g transform="translate(880 0)">
        <rect x="-2" y="108" width="4" height="28" fill={C.char} />
        <rect x="-30" y="98" width="60" height="16" fill={C.brown} stroke={C.char} strokeWidth="2" />
        <text x="0" y="110" textAnchor="middle" fontSize="8" fill={C.cream} fontFamily="'Press Start 2P', monospace">
          LV 01
        </text>
      </g>
      {/* broken fence */}
      {[1010, 1030, 1050].map((x) => (
        <rect key={x} x={x} y="120" width="4" height="16" fill={C.char} opacity="0.8" />
      ))}
      <rect x="1006" y="124" width="52" height="3" fill={C.char} opacity="0.8" />
    </g>
  );
});

function Loop({ children, className, style }) {
  return (
    <motion.div className={`wp__loop ${className}`} style={style}>
      <div className="wp__track">
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="0 0 1200 160" aria-hidden="true">
            {children}
          </svg>
        ))}
      </div>
    </motion.div>
  );
}

export default function WorldPreview() {
  const { reduceMotion } = useMode();
  const ref = useRef(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 16 });
  const farX = useTransform(mx, (v) => v * -4);
  const midX = useTransform(mx, (v) => v * -9);
  const nearX = useTransform(mx, (v) => v * -16);

  const onMove = (e) => {
    if (reduceMotion) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
  };

  return (
    <motion.a
      ref={ref}
      href="#skills"
      className={`wp ${reduceMotion ? 'is-still' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={() => mx.set(0)}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Explore Code Frontier: open the Ability Map"
    >
      <span className="wp__sky" aria-hidden="true">
        <i className="wp__sun" />
        <i className="wp__cloud wp__cloud--1" />
        <i className="wp__cloud wp__cloud--2" />
      </span>
      <Loop className="wp__far" style={{ x: farX }}>
        <Far />
      </Loop>
      <Loop className="wp__mid" style={{ x: midX }}>
        <Mid />
      </Loop>
      <Loop className="wp__near" style={{ x: nearX }}>
        <Near />
      </Loop>
      <span className="wp__motes" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ left: `${8 + i * 13}%`, animationDelay: `${-i * 1.3}s`, animationDuration: `${7 + (i % 3) * 2}s` }} />
        ))}
      </span>
      <span className="wp__hero" aria-hidden="true">
        <SpriteSVG map={HERO.run1} px={3} className="wp__frame wp__frame--a" />
        <SpriteSVG map={HERO.run2} px={3} className="wp__frame wp__frame--b" />
      </span>
      <span className="wp__label">
        <small>World 01 · Code Frontier</small>
        Explore the Ability Map <b aria-hidden="true">→</b>
      </span>
    </motion.a>
  );
}
