import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { skillCategories, tierOf } from '../../data/skills.js';

/* ─────────────────────────────────────────────────────────────
   My Skills — a calm neural graph.
   Six domains sit around a quiet "MY SKILLS" hub. Each domain's
   skills are placed on an arc that opens away from the hub, so
   clusters never overlap. Only meaningful cross‑links are drawn.
   ───────────────────────────────────────────────────────────── */

const W = 1000;
const H = 700;
const HUB = [500, 350];

const ANCHORS = {
  ai: [185, 190],
  backend: [500, 165],
  data: [815, 190],
  tools: [815, 525],
  web: [500, 548],
  core: [185, 525],
};
const RX = 128;
const RY = 96;

const LAYOUT = Object.fromEntries(
  skillCategories.map((cat) => {
    const [ax, ay] = ANCHORS[cat.id];
    const away = Math.atan2(ay - HUB[1], ax - HUB[0]);
    const n = cat.skills.length;
    const spread = (n >= 6 ? 250 : 230) * (Math.PI / 180);
    const nodes = Object.fromEntries(
      cat.skills.map((sk, i) => {
        const a = away - spread / 2 + (spread * i) / (n - 1);
        return [sk.name, [ax + Math.cos(a) * RX, ay + Math.sin(a) * RY]];
      }),
    );
    return [cat.id, { anchor: [ax, ay], nodes }];
  }),
);

// Relationships that exist in real work.
export const LINKS = [
  ['Python', 'Pandas'], ['Python', 'NumPy'], ['Python', 'Scikit-learn'], ['Python', 'Pydantic'], ['Python', 'Docker'],
  ['Pandas', 'NumPy'], ['PyTorch', 'NumPy'], ['Scikit-learn', 'Pandas'],
  ['FastAPI', 'PyTorch'], ['FastAPI', 'Pydantic'], ['FastAPI', 'Redis'], ['REST APIs', 'API Design'], ['Django', 'SQL'], ['FastAPI', 'MongoDB'],
  ['JavaScript', 'REST APIs'], ['React', 'REST APIs'], ['Frontend Integration', 'FastAPI'],
  ['Java', 'OOP'], ['C', 'Data Structures'], ['Problem Solving', 'Data Structures'], ['Python', 'OOP'], ['C', 'Linux'],
  ['Docker', 'FastAPI'], ['Docker', 'Linux'], ['Git', 'GitHub Actions'], ['GitHub Actions', 'Docker'], ['Cloud Deploy', 'Docker'], ['Git', 'React'],
];

export const USES = {
  PyTorch: 'Fine‑tuned a detection model for a real‑time camera feed.',
  TensorFlow: 'Built and exported Keras CNNs for image classification experiments.',
  'Scikit-learn': 'Gradient‑boosted forecasting models behind a prediction dashboard.',
  Pandas: 'Cleaning event logs and engineering features for a recommender.',
  NumPy: 'Vectorised scoring and similarity maths inside model pipelines.',
  Python: 'The language behind almost everything here — models, APIs and tooling.',
  FastAPI: 'Used to design fast, typed REST APIs and serve ML models in production.',
  Django: 'Full‑stack apps where the ORM and admin save weeks of work.',
  Flask: 'Lightweight internal dashboards and quick prototype services.',
  'REST APIs': 'Versioned, documented endpoints consumed by web and mobile clients.',
  SQL: 'PostgreSQL schemas and tuned queries behind backend services.',
  MongoDB: 'Flexible document storage for user events and logs.',
  Redis: 'Caching hot results and rate‑limiting public endpoints.',
  'API Design': 'Designing request/response contracts before writing endpoints.',
  Pydantic: 'Validating every request body and app setting with typed models.',
  Docker: 'Every service ships as a slim, reproducible image.',
  Git: 'Feature branches, reviews and a readable history on every project.',
  Linux: 'Running and debugging services on cloud VMs.',
  'GitHub Actions': 'CI that tests, builds and publishes images on every push.',
  'Cloud Deploy': 'This portfolio is deployed on Render from GitHub.',
  HTML: 'Semantic structure for every page, including this portfolio.',
  CSS: 'Two complete visual themes in this site, built on design tokens.',
  JavaScript: 'Interactive UI logic and API calls in the browser.',
  React: 'This portfolio — components, hooks and Framer Motion animation.',
  'Responsive UI': 'Layouts tested from small phones to wide desktops.',
  'Frontend Integration': 'Connecting React screens to FastAPI endpoints with clear loading and error states.',
  Java: 'Core Java coursework and OOP projects.',
  C: 'Systems‑level exercises: memory, pointers and data structures.',
  'Data Structures': 'Choosing the right structure for search, caching and scheduling problems.',
  OOP: 'Designing clean service and model classes in Python and Java.',
  'Problem Solving': 'Turning vague requirements into small, testable steps.',
};

const nodes = skillCategories.flatMap((cat) => cat.skills.map((sk) => ({ ...sk, cat, pos: LAYOUT[cat.id].nodes[sk.name] })));
const byName = Object.fromEntries(nodes.map((n) => [n.name, n]));

function curve(a, b, pull = 0.25) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  return `M${a[0]} ${a[1]} Q${mx + (HUB[0] - mx) * pull} ${my + (HUB[1] - my) * pull} ${b[0]} ${b[1]}`;
}

/* Richer, slow particle field for this section only. */
function Field({ running }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let pts = [];
    const tones = ['181,189,201', '167,185,163', '184,155,104', '216,197,157'];
    const resize = () => {
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(80, (w * h) / 14000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.2,
        t: tones[i % 11 === 0 ? 3 : i % 3],
      }));
    };
    const draw = (time = 0) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (running) {
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
        }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            const pulse = 0.5 + 0.5 * Math.sin(time / 2400 + i * 0.7);
            ctx.strokeStyle = `rgba(142,154,137,${(1 - d / 120) * 0.1 * pulse})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${p.t},0.45)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [running]);
  return <canvas ref={ref} className="nu__field" aria-hidden="true" />;
}

/* Slowly shifting neural paths behind the graph (background depth layer). */
const BG_PATHS = [
  ['M-40 120 C 220 60, 380 260, 620 170 S 900 40, 1040 140', 'M-40 150 C 240 110, 360 210, 620 200 S 920 90, 1040 110'],
  ['M-40 420 C 160 330, 340 500, 520 410 S 820 300, 1040 400', 'M-40 380 C 180 400, 320 440, 520 450 S 840 350, 1040 430'],
  ['M-40 640 C 200 560, 420 700, 640 610 S 900 520, 1040 600', 'M-40 600 C 220 620, 400 640, 640 650 S 880 560, 1040 640'],
  ['M180 -20 C 120 200, 300 380, 220 720', 'M150 -20 C 170 220, 260 400, 260 720'],
  ['M820 -20 C 900 180, 700 420, 840 720', 'M860 -20 C 840 220, 760 380, 800 720'],
];

function NeuralPaths({ running }) {
  return (
    <svg className="nu__paths" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      {BG_PATHS.map(([a, b], i) => (
        <motion.path
          key={i}
          d={a}
          animate={running ? { d: [a, b, a] } : { d: a }}
          transition={running ? { duration: 22 + i * 5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
          className={i % 2 ? 'is-b' : ''}
        />
      ))}
    </svg>
  );
}

const relatedOf = (name) => LINKS.filter((l) => l.includes(name)).map((l) => (l[0] === name ? l[1] : l[0]));

function Details({ node }) {
  const tier = tierOf(node.level);
  const related = relatedOf(node.name);
  const steps = Math.max(1, Math.round((node.level - 60) / 8));
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={node.name}
        className="nu__details-inner"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nu__d-main">
          <p className="nu__d-cat">
            <span className="nu__d-swatch" aria-hidden="true" />
            {node.cat.name} · {node.cat.capability}
          </p>
          <h3>{node.name}</h3>
          <div className="nu__d-level">
            <span className="nu__steps" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className={i < steps ? 'on' : ''} />
              ))}
            </span>
            {tier.label}
          </div>
        </div>
        <div className="nu__d-copy">
          <span className="nu__d-label">Capability</span>
          <p>{node.note}</p>
          <p className="nu__d-use">
            <span className="nu__d-label">Practical use case</span>
            {USES[node.name]}
          </p>
        </div>
        <div className="nu__d-rel">
          <span className="nu__d-label">Related tools</span>
          <ul className="nu__d-tools">
            {node.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {related.length > 0 && (
            <>
              <span className="nu__d-label">Connected skills</span>
              <p>{related.join(' · ')}</p>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const SPRING = { stiffness: 60, damping: 18, mass: 0.6 };

export default function NeuralUniverse() {
  const { reduceMotion } = useMode();
  const [active, setActive] = useState('Python');
  const [hover, setHover] = useState(null);
  const [focus, setFocus] = useState(null);
  const [mobileCat, setMobileCat] = useState('ai');
  const [inView, setInView] = useState(false);
  const [ambient, setAmbient] = useState(null); // { link, key }
  const wrap = useRef(null);
  const stage = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end start'] });
  const fieldY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const pathsY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  // cursor parallax: three depths move by different amounts
  const mx = useSpring(useMotionValue(0), SPRING);
  const my = useSpring(useMotionValue(0), SPRING);
  const planeX = useTransform(mx, (v) => v * 7);
  const planeY = useTransform(my, (v) => v * 5);
  const pathsX = useTransform(mx, (v) => v * -10);
  const fieldX = useTransform(mx, (v) => v * -18);
  const fieldYc = useTransform(my, (v) => v * -12);
  const live = inView && !reduceMotion;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  // ambient "thinking": every few seconds one real relationship draws itself and fades
  useEffect(() => {
    if (!live) return undefined;
    let n = 0;
    const id = setInterval(() => {
      const pool = LINKS.filter((l) => !l.includes(active));
      setAmbient({ link: pool[Math.floor(Math.random() * pool.length)], key: n++ });
    }, 3400);
    return () => clearInterval(id);
  }, [live, active]);

  const node = byName[active];
  const neighbours = useMemo(() => new Set(LINKS.filter((l) => l.includes(active)).flat()), [active]);
  const hoverNeighbours = useMemo(() => (hover ? new Set(LINKS.filter((l) => l.includes(hover)).flat()) : null), [hover]);
  const activeLinks = useMemo(() => LINKS.filter((l) => l.includes(active)), [active]);

  const cam = (() => {
    if (!focus) return { scale: 1, x: '0%', y: '0%' };
    const [ax, ay] = ANCHORS[focus];
    const sc = 1.35;
    return { scale: sc, x: `${(50 - (ax / W) * 100) * sc * 0.75}%`, y: `${(50 - (ay / H) * 100) * sc * 0.75}%` };
  })();

  const selectCluster = (id) => {
    setFocus(id);
    if (id) setActive(nodes.find((n) => n.cat.id === id).name);
  };

  const onMove = (e) => {
    if (reduceMotion) return;
    const r = stage.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(null);
  };

  return (
    <div className="nu" ref={wrap}>
      <div className="nu__focus" role="group" aria-label="Focus a skill domain">
        <button type="button" className={!focus ? 'is-on' : ''} onClick={() => selectCluster(null)} aria-pressed={!focus}>
          All
        </button>
        {skillCategories.map((c) => (
          <button key={c.id} type="button" className={focus === c.id ? 'is-on' : ''} onClick={() => selectCluster(c.id)} aria-pressed={focus === c.id}>
            {c.name}
          </button>
        ))}
      </div>
      <div
        className={`nu__stage ${focus ? 'has-focus' : ''}`}
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onKeyDown={(e) => e.key === 'Escape' && selectCluster(null)}
      >
        <motion.div className="nu__field-wrap" style={reduceMotion ? undefined : { y: fieldY }}>
          <motion.div className="nu__field-inner" style={reduceMotion ? undefined : { x: fieldX, y: fieldYc }}>
            <Field running={live} />
          </motion.div>
        </motion.div>
        <motion.div className="nu__paths-wrap" style={reduceMotion ? undefined : { x: pathsX, y: pathsY }}>
          <NeuralPaths running={live} />
        </motion.div>

        <motion.div className="nu__depth" style={reduceMotion ? undefined : { x: planeX, y: planeY }}>
          <motion.div className={`nu__plane ${live ? 'is-drifting' : ''}`} animate={cam} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}>
            <motion.svg className="nu__edges" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" initial="off" whileInView="on" viewport={{ once: true, margin: '-120px' }} aria-hidden="true">
              {Object.values(ANCHORS).map((a, i) => (
                <motion.path key={`hub-${i}`} d={curve(HUB, a, 0)} className="nu__spoke" variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: { duration: 1.4, delay: 0.2 + i * 0.12 } } }} />
              ))}
              {Object.entries(LAYOUT).map(([id, { anchor, nodes: ns }], ci) =>
                Object.entries(ns).map(([name, pos], i) => (
                  <motion.path
                    key={`${id}-${name}`}
                    d={curve(anchor, pos, 0)}
                    className={`nu__edge ${active === name || hover === name ? 'is-on' : ''} ${focus && focus !== id ? 'is-faded' : ''}`}
                    variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: { duration: 1, delay: 0.6 + ci * 0.15 + i * 0.06 } } }}
                  />
                )),
              )}
              {LINKS.map(([a, b], i) => {
                const on = a === active || b === active;
                const hov = !on && hover && (a === hover || b === hover);
                const out = focus && byName[a].cat.id !== focus && byName[b].cat.id !== focus;
                return (
                  <motion.path
                    key={`${a}-${b}`}
                    d={curve(byName[a].pos, byName[b].pos)}
                    className={`nu__link ${on ? 'is-on' : ''} ${hov ? 'is-hover' : ''} ${out ? 'is-faded' : ''}`}
                    variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { duration: 1.2, delay: 1.5 + i * 0.03 } } }}
                  />
                );
              })}

              {/* the selected skill's meaningful connections redraw themselves, then carry a slow signal */}
              <g key={active}>
                {activeLinks.map(([a, b], i) => {
                  const from = a === active ? byName[a].pos : byName[b].pos;
                  const to = a === active ? byName[b].pos : byName[a].pos;
                  const d = curve(from, to);
                  return (
                    <g key={`${a}-${b}`}>
                      <motion.path
                        d={d}
                        className="nu__trace"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {!reduceMotion && <path d={d} pathLength={100} className="nu__signal" style={{ animationDelay: `${0.9 + i * 0.3}s` }} />}
                    </g>
                  );
                })}
              </g>

              <AnimatePresence>
                {live && ambient?.link && (
                  <motion.path
                    key={ambient.key}
                    d={curve(byName[ambient.link[0]].pos, byName[ambient.link[1]].pos)}
                    className="nu__ambient"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.8, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </motion.svg>

            <motion.div
              className="nu__hub"
              style={{ left: `${(HUB[0] / W) * 100}%`, top: `${(HUB[1] / H) * 100}%` }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              aria-hidden="true"
            >
              <span className="nu__hub-ring" />
              <span className="nu__hub-ring nu__hub-ring--2" />
              <small>MY SKILLS</small>
            </motion.div>

            {skillCategories.map((cat, ci) => {
              const [ax, ay] = ANCHORS[cat.id];
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  className={`nu__cluster ${focus === cat.id ? 'is-on' : ''} ${focus && focus !== cat.id ? 'is-faded' : ''}`}
                  style={{ left: `${(ax / W) * 100}%`, top: `${(ay / H) * 100}%` }}
                  onClick={() => selectCluster(focus === cat.id ? null : cat.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + ci * 0.12 }}
                  aria-pressed={focus === cat.id}
                >
                  <small>0{ci + 1}</small>
                  {cat.name}
                </motion.button>
              );
            })}

            {nodes.map((n, i) => {
              const isActive = active === n.name;
              const isNear = !isActive && neighbours.has(n.name);
              const isHoverNear = hoverNeighbours?.has(n.name) && hover !== n.name;
              const isOut = !!focus && n.cat.id !== focus && !isActive && !isNear;
              const dim = !isActive && !isNear && !isHoverNear;
              return (
                <motion.button
                  key={n.name}
                  type="button"
                  className={`nu__node ${isActive ? 'is-active' : ''} ${isNear ? 'is-near' : ''} ${isHoverNear ? 'is-hover-near' : ''} ${dim ? 'is-dim' : ''} ${isOut ? 'is-out' : ''}`}
                  style={{ left: `${(n.pos[0] / W) * 100}%`, top: `${(n.pos[1] / H) * 100}%` }}
                  onFocus={() => setActive(n.name)}
                  onClick={() => setActive(n.name)}
                  onPointerEnter={() => setHover(n.name)}
                  onPointerLeave={() => setHover(null)}
                  aria-pressed={isActive}
                  aria-label={`${n.name}, ${n.cat.name}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="nu__dot-wrap" style={{ animationDuration: `${6 + (i % 5)}s`, animationDelay: `${-i * 0.7}s` }}>
                    <span className="nu__dot" />
                  </span>
                  <span className="nu__label">{n.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
        <p className="nu__hint" aria-hidden="true">
          {focus ? 'Esc or “All” to zoom out' : 'Select a skill to trace its connections'}
        </p>
      </div>

      {/* Mobile: one domain at a time */}
      <div className="nu__mobile">
        <div className="nu__tabs" role="tablist" aria-label="Skill domains">
          {skillCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={mobileCat === c.id}
              className={mobileCat === c.id ? 'is-on' : ''}
              onClick={() => {
                setMobileCat(c.id);
                setActive(nodes.find((n) => n.cat.id === c.id).name);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.ul key={mobileCat} className="nu__chips" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {nodes
              .filter((n) => n.cat.id === mobileCat)
              .map((n) => (
                <li key={n.name}>
                  <button type="button" className={active === n.name ? 'is-on' : ''} onClick={() => setActive(n.name)} aria-pressed={active === n.name}>
                    <span className="nu__dot" />
                    {n.name}
                  </button>
                </li>
              ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="nu__details" aria-live="polite">
        <Details node={node} />
      </div>
    </div>
  );
}
