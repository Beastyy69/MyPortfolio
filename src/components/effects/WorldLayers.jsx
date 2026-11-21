import { memo, useEffect, useMemo, useRef } from 'react';
import { useMode } from '../../context/ModeContext.jsx';
import { chapters } from '../../data/navigation.js';

/* ─────────────────────────────────────────────────────────────
   World layers — the FHD parallax environment behind every page.
   Drawn as SVG at 1920×1080 units and scaled to cover the screen.

   AI/ML world  → vertical descent through an "intelligence environment":
                  1 sky · 2 topology contours · 3 computational terrain ·
                  4 neural paths / data streams · (5 particles: Backdrop canvas)
   Game world   → a side‑scrolling journey across Code Frontier:
                  1 sky (day → dusk) · 2 far mountains + server base ·
                  3 landmarks (data factory, jungle ruins, vault, tower) ·
                  4 foreground ground with level signposts · (5 particles)

   Scroll position is converted to a "story progress" (0 → 1) measured by
   chapter, so each chapter reveals its own part of the world. Transforms
   only (GPU‑composited); static with reduced motion.
   ───────────────────────────────────────────────────────────── */

const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const r1 = (n) => Math.round(n * 10) / 10;

/* ───────────── AI world ───────────── */

// L2: topographic contour rings drifting very slowly
function aiTopology() {
  const rand = rng(11);
  const centres = [
    [1500, 260],
    [380, 900],
    [1380, 1500],
    [520, 2050],
  ];
  const paths = [];
  centres.forEach(([cx, cy], ci) => {
    const k1 = 2 + Math.floor(rand() * 3);
    const k2 = 3 + Math.floor(rand() * 3);
    const ph = rand() * 6;
    for (let ring = 1; ring <= 9; ring++) {
      const base = ring * 52;
      let d = '';
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const rr = base * (1 + 0.16 * Math.sin(a * k1 + ph + ring * 0.25) + 0.08 * Math.cos(a * k2 - ph));
        d += `${i ? 'L' : 'M'}${r1(cx + Math.cos(a) * rr * 1.5)} ${r1(cy + Math.sin(a) * rr)}`;
      }
      paths.push({ d: `${d}Z`, key: `${ci}-${ring}`, major: ring % 3 === 0 });
    }
  });
  return paths;
}

// L3: wireframe computational terrain — perspective mesh ridges
function aiTerrain() {
  const bands = [620, 1380, 2140];
  const out = [];
  bands.forEach((by, bi) => {
    const rows = 13;
    const ph = bi * 1.7;
    const pts = [];
    for (let r = 0; r < rows; r++) {
      const depth = r / (rows - 1); // 0 far → 1 near
      const y0 = by + depth * depth * 360;
      const spread = 0.55 + depth * 0.9;
      const row = [];
      for (let c = 0; c <= 32; c++) {
        const u = c / 32 - 0.5;
        const x = 960 + u * 1920 * spread;
        const hgt =
          (70 + 40 * depth) *
          (Math.sin(u * 7 + ph + depth * 2) * 0.6 + Math.cos(u * 13 - ph * 1.3 + depth * 3) * 0.3 + Math.sin(u * 3 + depth * 5) * 0.4);
        row.push([r1(x), r1(y0 - hgt * (0.4 + depth * 0.6))]);
      }
      pts.push(row);
    }
    const lines = pts.map((row) => row.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(''));
    const cols = [];
    for (let c = 0; c <= 32; c += 2) cols.push(pts.map((row, r) => `${r ? 'L' : 'M'}${row[c][0]} ${row[c][1]}`).join(''));
    const peaks = [];
    pts.forEach((row, r) =>
      row.forEach((p, c) => {
        if (r > 3 && (r * 7 + c * 5 + bi) % 37 === 0) peaks.push(p);
      }),
    );
    out.push({ lines, cols, peaks, key: bi });
  });
  return out;
}

// L4: neural paths and data streams
function aiStreams() {
  const rand = rng(29);
  const out = [];
  for (let i = 0; i < 11; i++) {
    const y = 120 + i * 260 + rand() * 120;
    const amp = 90 + rand() * 160;
    const x0 = -100;
    const x3 = 2020;
    const c1 = [500 + rand() * 300, y - amp];
    const c2 = [1300 + rand() * 300, y + amp];
    const y3 = y + (rand() - 0.5) * 240;
    out.push({
      d: `M${x0} ${r1(y)} C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${x3} ${r1(y3)}`,
      tone: i % 4 === 1 ? 'amber' : i % 3 === 0 ? 'indigo' : 'slate',
      dur: 26 + rand() * 30,
      key: i,
    });
  }
  // a few synapse nodes along the streams
  const nodes = Array.from({ length: 26 }, () => ({ x: r1(rand() * 1920), y: r1(rand() * 3000), r: r1(1.4 + rand() * 2.2) }));
  return { paths: out, nodes };
}

const AIWorld = memo(function AIWorld({ setRef }) {
  const topo = useMemo(aiTopology, []);
  const terrain = useMemo(aiTerrain, []);
  const streams = useMemo(aiStreams, []);
  return (
    <>
      <div className="world__layer world__sky world__sky--ai" />
      <div className="world__layer world__tall" data-m="1.6" ref={setRef(0)}>
        <svg viewBox="0 0 1920 1728" preserveAspectRatio="xMidYMin slice" className="world__svg">
          <g className="world__topo">
            {topo.map((p) => (
              <path key={p.key} d={p.d} className={p.major ? 'is-major' : ''} />
            ))}
          </g>
        </svg>
      </div>
      <div className="world__layer world__tall" data-m="2.4" ref={setRef(1)}>
        <svg viewBox="0 0 1920 2592" preserveAspectRatio="xMidYMin slice" className="world__svg">
          {terrain.map((b) => (
            <g key={b.key} className="world__terrain">
              {b.lines.map((d, i) => (
                <path key={`l${i}`} d={d} style={{ opacity: 0.25 + (i / b.lines.length) * 0.75 }} />
              ))}
              {b.cols.map((d, i) => (
                <path key={`c${i}`} d={d} className="is-col" />
              ))}
              {b.peaks.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.2" className="world__peak" />
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className="world__layer world__tall" data-m="3" ref={setRef(2)}>
        <svg viewBox="0 0 1920 3240" preserveAspectRatio="xMidYMin slice" className="world__svg">
          <g className="world__streams">
            {streams.paths.map((p) => (
              <g key={p.key} className={`is-${p.tone}`}>
                <path d={p.d} className="world__stream-base" />
                <path d={p.d} pathLength="1000" className="world__stream-flow" style={{ animationDuration: `${p.dur}s` }} />
              </g>
            ))}
            {streams.nodes.map((n, i) => (
              <circle key={i} cx={n.x} cy={n.y} r={n.r} className="world__synapse" style={{ animationDelay: `${(i % 9) * 0.9}s` }} />
            ))}
          </g>
        </svg>
      </div>
    </>
  );
});

/* ───────────── Game world: Code Frontier ───────────── */

const C = {
  far: '#4d5b69',
  farDark: '#3e4a57',
  snow: '#a9b2b6',
  hill: '#3f4a33',
  hillDark: '#323b2a',
  olive: '#5d6b3f',
  brick: '#8a3d33',
  brickDark: '#6b2f28',
  mustard: '#b8954a',
  brown: '#5a4632',
  brownDark: '#3e3024',
  char: '#211b17',
  cream: '#e9dcc0',
  blue: '#5d6f82',
};

const step = (v, s = 24) => Math.round(v / s) * s;

// stepped silhouette path from a height function
function ridge(width, baseY, fn, s = 24) {
  let d = `M0 1080 L0 ${step(baseY - fn(0), s)}`;
  for (let x = 0; x <= width; x += s) {
    const y = step(baseY - fn(x), s);
    d += ` L${x} ${y} L${x + s} ${y}`;
  }
  return `${d} L${width} 1080 Z`;
}

function retroFar() {
  const W = 1920 * 1.7;
  const back = ridge(W, 700, (x) => 220 + 120 * Math.sin(x / 260) + 70 * Math.sin(x / 97 + 1) + 40 * Math.cos(x / 53), 24);
  const front = ridge(W, 760, (x) => 120 + 90 * Math.sin(x / 210 + 2) + 50 * Math.cos(x / 71), 24);
  return { W, back, front };
}

function Tree({ x, y, s = 1, kind = 'pine', fill }) {
  if (kind === 'palm')
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
        <rect x="-4" y="-90" width="8" height="90" />
        <path d="M0 -92 q-30 -16 -58 10 M0 -92 q30 -16 58 10 M0 -94 q-20 -26 -44 -18 M0 -94 q20 -26 44 -18 M0 -94 q2 -20 -6 -34" fill="none" stroke={fill} strokeWidth="9" strokeLinecap="square" />
      </g>
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <rect x="-4" y="-20" width="8" height="20" />
      <path d="M0 -110 L-16 -80 L-8 -80 L-26 -50 L-14 -50 L-34 -18 L34 -18 L14 -50 L26 -50 L8 -80 L16 -80 Z" />
    </g>
  );
}

function retroMid() {
  const W = 1920 * 2.6;
  const hills = ridge(W, 860, (x) => 70 + 60 * Math.sin(x / 300) + 40 * Math.cos(x / 130 + 1), 16);
  const rand = rng(5);
  const trees = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 40) * W + rand() * 80;
    const zoneJungle = x > W * 0.22 && x < W * 0.42;
    return { x: r1(x), y: 860 - 40 - rand() * 30, s: 0.6 + rand() * 0.5, kind: zoneJungle || rand() < 0.2 ? 'palm' : 'pine' };
  });
  return { W, hills, trees };
}

function Landmarks({ W }) {
  const at = (f) => r1(W * f);
  return (
    <g>
      {/* abandoned data factory */}
      <g transform={`translate(${at(0.04)} 0)`} fill={C.brownDark}>
        <rect x="0" y="640" width="220" height="200" />
        <rect x="220" y="700" width="140" height="140" />
        <path d="M0 640 l55 -40 v40 l55 -40 v40 l55 -40 v40 l55 -40 v40 Z" />
        <rect x="250" y="520" width="26" height="180" />
        <rect x="300" y="560" width="22" height="140" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={24 + i * 50} y="700" width="22" height="30" fill={C.brick} opacity="0.55" />
        ))}
        <g className="world__smoke">
          <rect x="252" y="486" width="22" height="22" fill={C.cream} opacity="0.18" />
          <rect x="268" y="452" width="30" height="26" fill={C.cream} opacity="0.12" />
          <rect x="300" y="526" width="20" height="20" fill={C.cream} opacity="0.15" />
        </g>
      </g>
      {/* jungle terminal ruins */}
      <g transform={`translate(${at(0.3)} 0)`} fill={C.hillDark}>
        <rect x="0" y="780" width="320" height="60" />
        <rect x="40" y="720" width="240" height="60" />
        <rect x="80" y="660" width="160" height="60" />
        <rect x="120" y="600" width="80" height="60" />
        <rect x="140" y="616" width="40" height="44" fill={C.mustard} opacity="0.35" />
        <rect x="146" y="622" width="28" height="4" fill={C.cream} opacity="0.5" className="world__blink" />
        <path d="M60 720 v40 M110 660 v70 M230 660 v50 M270 720 v60" stroke={C.olive} strokeWidth="6" />
      </g>
      {/* mountain server base */}
      <g transform={`translate(${at(0.53)} 0)`} fill={C.char}>
        <path d="M0 840 L60 720 L340 720 L400 840 Z" />
        <rect x="90" y="650" width="220" height="70" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={104 + i * 34} y="672" width="18" height="10" fill={C.mustard} opacity={0.35 + (i % 3) * 0.15} className={i % 2 ? 'world__blink' : ''} />
        ))}
        <rect x="190" y="560" width="10" height="90" />
        <path d="M150 560 a45 30 0 0 1 90 0 Z" fill={C.farDark} />
      </g>
      {/* underground code vault */}
      <g transform={`translate(${at(0.74)} 0)`}>
        <path d="M0 840 L40 760 L260 760 L300 840 Z" fill={C.brownDark} />
        <rect x="90" y="770" width="120" height="70" fill={C.char} />
        <circle cx="150" cy="805" r="26" fill={C.brown} stroke={C.mustard} strokeWidth="5" opacity="0.9" />
        <rect x="146" y="782" width="8" height="46" fill={C.mustard} opacity="0.7" />
      </g>
      {/* final communication tower */}
      <g transform={`translate(${at(0.92)} 0)`} stroke={C.char} strokeWidth="8" fill="none">
        <path d="M60 840 L120 300 L180 840" />
        <path d="M80 660 L160 660 M92 540 L148 540 M104 420 L136 420 M70 760 L170 760 M80 660 L148 540 M160 660 L92 540 M92 540 L136 420" strokeWidth="5" />
        <rect x="108" y="270" width="24" height="30" fill={C.char} />
        <rect x="114" y="252" width="12" height="12" fill={C.brick} stroke="none" className="world__beacon" />
      </g>
    </g>
  );
}

const SIGNS = ['START CAMP', 'PLAYER PROFILE', 'ABILITY MAP', 'MISSION BOARD', 'ACHIEVEMENT HALL', 'CAMPAIGN TRAIL', 'CORE RUN', 'TRANSMISSION TOWER'];

function retroNear() {
  const W = 1920 * 3.6;
  const rand = rng(17);
  const tufts = Array.from({ length: 90 }, () => ({ x: r1(rand() * W), h: 8 + Math.round(rand() * 3) * 6 }));
  const posts = Array.from({ length: 30 }, (_, i) => r1((i / 30) * W + rand() * 60));
  return { W, tufts, posts };
}

const RetroWorld = memo(function RetroWorld({ setRef }) {
  const far = useMemo(retroFar, []);
  const mid = useMemo(retroMid, []);
  const near = useMemo(retroNear, []);
  const clouds = [
    [180, 160, 1],
    [720, 110, 0.8],
    [1340, 200, 1.2],
    [1660, 90, 0.7],
  ];
  return (
    <>
      <div className="world__layer world__sky world__sky--day" />
      <div className="world__layer world__sky world__sky--dusk" ref={setRef(3)} />
      <div className="world__layer world__clouds" aria-hidden="true">
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="world__svg">
          <circle cx="1480" cy="300" r="70" fill={C.cream} opacity="0.22" className="world__sun" />
          {clouds.map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill={C.cream} opacity="0.13">
              <rect x="0" y="20" width="200" height="24" />
              <rect x="30" y="0" width="110" height="24" />
              <rect x="60" y="-16" width="50" height="20" />
            </g>
          ))}
        </svg>
      </div>
      <div className="world__layer world__wide" data-m={far.W / 1920} ref={setRef(0)}>
        <svg viewBox={`0 0 ${far.W} 1080`} preserveAspectRatio="xMinYMax slice" className="world__svg">
          <path d={far.back} fill={C.far} opacity="0.55" />
          <path d={far.front} fill={C.farDark} opacity="0.8" />
        </svg>
      </div>
      <div className="world__layer world__wide" data-m={mid.W / 1920} ref={setRef(1)}>
        <svg viewBox={`0 0 ${mid.W} 1080`} preserveAspectRatio="xMinYMax slice" className="world__svg">
          <Landmarks W={mid.W} />
          <path d={mid.hills} fill={C.hill} />
          {mid.trees.map((t, i) => (
            <Tree key={i} x={t.x} y={t.y + 46} s={t.s} kind={t.kind} fill={C.hillDark} />
          ))}
        </svg>
      </div>
      <div className="world__layer world__wide world__near" data-m={near.W / 1920} ref={setRef(2)}>
        <svg viewBox={`0 0 ${near.W} 1080`} preserveAspectRatio="xMinYMax slice" className="world__svg">
          <rect x="0" y="996" width={near.W} height="84" fill={C.brownDark} />
          <rect x="0" y="984" width={near.W} height="14" fill={C.hillDark} />
          {near.tufts.map((t, i) => (
            <rect key={i} x={t.x} y={984 - t.h} width="6" height={t.h} fill={C.hillDark} />
          ))}
          {Array.from({ length: Math.ceil(near.W / 48) }, (_, i) => (
            <rect key={i} x={i * 48 + ((i % 2) * 8)} y={1012 + (i % 2) * 22} width="40" height="18" fill={C.brown} opacity="0.5" />
          ))}
          {near.posts.map((x, i) => (
            <rect key={`p${i}`} x={x} y="940" width="8" height="46" fill={C.char} opacity="0.8" />
          ))}
          {SIGNS.map((s, i) => {
            const x = r1(near.W * (0.02 + (i / (SIGNS.length - 1)) * 0.86) + 900);
            return (
              <g key={s} transform={`translate(${x} 0)`} className="world__sign">
                <rect x="-6" y="880" width="12" height="104" fill={C.char} />
                <rect x="-120" y="850" width="240" height="56" fill={C.brown} stroke={C.char} strokeWidth="6" />
                <text x="0" y="886" textAnchor="middle" fill={C.cream} fontSize="20" fontFamily="'Press Start 2P', monospace" opacity="0.85">
                  {`LV${i + 1}`}
                </text>
                <text x="0" y="938" textAnchor="middle" fill={C.cream} fontSize="15" fontFamily="'Press Start 2P', monospace" opacity="0.55">
                  {s}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
});

/* ───────────── controller ───────────── */

export default function WorldLayers() {
  const { mode, reduceMotion } = useMode();
  const layers = useRef([]);
  const setRef = (i) => (el) => {
    layers.current[i] = el;
  };
  const retro = mode === 'retro';

  useEffect(() => {
    const ids = chapters[mode].map((c) => c.id);
    let raf = 0;

    const storyProgress = () => {
      const vh = window.innerHeight;
      const mid = window.scrollY + vh * 0.5;
      const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
      if (secs.length < 2) return 0;
      const tops = secs.map((s) => s.getBoundingClientRect().top + window.scrollY);
      const last = secs.length - 1;
      let i = 0;
      while (i < last && mid >= tops[i + 1]) i++;
      const start = tops[i];
      const end = i < last ? tops[i + 1] : document.documentElement.scrollHeight;
      const local = Math.min(1, Math.max(0, (mid - start) / Math.max(1, end - start)));
      return Math.min(1, (i + local) / last);
    };

    const apply = () => {
      raf = 0;
      const p = reduceMotion ? 0 : storyProgress();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      layers.current.forEach((el, i) => {
        if (!el) return;
        if (retro && i === 3) {
          el.style.opacity = String(Math.min(1, Math.max(0, (p - 0.35) / 0.6)));
          return;
        }
        const m = Number(el.dataset.m) || 1;
        if (retro) {
          // layer is (m × 1920/1080 × vh) wide; slide it so the end lines up with the last chapter
          const width = Math.max(vw, (m * 1920 * vh) / 1080);
          el.style.width = `${width}px`;
          el.style.transform = `translate3d(${-p * (width - vw)}px,0,0)`;
        } else {
          el.style.transform = `translate3d(0,${-p * (m - 1) * vh}px,0)`;
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    // sections mount after the preloader; settle twice
    apply();
    const t = setTimeout(apply, 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mode, retro, reduceMotion]);

  return (
    <div className={`world world--${retro ? 'retro' : 'ai'} ${reduceMotion ? 'is-still' : ''}`} aria-hidden="true">
      {retro ? <RetroWorld setRef={setRef} /> : <AIWorld setRef={setRef} />}
    </div>
  );
}
