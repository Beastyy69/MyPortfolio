import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { allSkills, tierOf } from '../../data/skills.js';
import { LINKS, USES } from '../visuals/NeuralUniverse.jsx';
import { HERO, SpriteSVG } from './sprites.jsx';
import { useMode } from '../../context/ModeContext.jsx';
import { AW as VW, AH as VH, AtlasBase, REGION_ART, blob } from './AtlasArt.jsx';

/* ─────────────────────────────────────────────────────────────
   Ability Map — Level 3 of Code Frontier, drawn as the
   "Code Frontier Atlas": six illustrated regions joined by a worn
   route with a bridge and a mountain tunnel. Hovering a region wakes
   its landmark; clicking a signpost (or the region) walks the Field
   Engineer there and opens the region briefing.
   ───────────────────────────────────────────────────────────── */

export const MAP_ZONES = [
  {
    id: 'foundations',
    name: 'Code Foundations',
    place: 'Stone Academy Canyon',
    at: [250, 505],
    area: [160, 480, 150, 115],
    sign: [1, 1],
    tone: '#7a6248',
    skills: ['C', 'Java', 'OOP', 'Data Structures'],
    blurb: 'Where every run begins: memory and pointers in C, object-oriented design in Java, and the data structures that make every later tool easier to learn.',
  },
  {
    id: 'web',
    name: 'Web Builder',
    place: 'Bridgetown Workshops',
    at: [360, 235],
    area: [430, 180, 115, 90],
    sign: [-1, 1],
    tone: '#8a4a3a',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    blurb: 'Interfaces that talk to the APIs I build: semantic HTML, token-based CSS and React components with real loading and error states.',
  },
  {
    id: 'python',
    name: 'Python Engineer',
    place: 'Library Fortress',
    at: [455, 420],
    area: [540, 455, 125, 80],
    sign: [-1, 1],
    tone: '#5d7052',
    skills: ['Python', 'FastAPI', 'Flask', 'Django'],
    blurb: 'Home base. Typed, async Python services: FastAPI for model serving and fast APIs, Django when the ORM and admin save weeks, Flask for small tools.',
  },
  {
    id: 'ailab',
    name: 'AI Lab',
    place: 'Summit Observatory',
    at: [760, 232],
    area: [750, 165, 165, 105],
    sign: [-1, 1],
    tone: '#55627a',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy'],
    blurb: 'Training, evaluating and shipping models: Pandas and NumPy for the data, scikit-learn for classical ML, PyTorch and TensorFlow for deep learning.',
  },
  {
    id: 'vault',
    name: 'Data Vault',
    place: 'Archive Mines',
    at: [845, 470],
    area: [930, 525, 125, 85],
    sign: [-1, 1],
    tone: '#7a5e33',
    skills: ['SQL', 'MongoDB', 'Redis', 'REST APIs'],
    blurb: 'Schemas, queries, caches and contracts: PostgreSQL and MongoDB for storage, Redis for speed, and REST APIs that other teams can rely on.',
  },
  {
    id: 'deploy',
    name: 'Deployment Base',
    place: 'Signal Outpost',
    at: [975, 300],
    area: [1065, 270, 115, 100],
    sign: [-1, 1],
    tone: '#4a5a42',
    skills: ['Docker', 'Git', 'Linux', 'GitHub Actions'],
    blurb: 'Getting code off the laptop reproducibly: Docker images, clean Git history, Linux servers and GitHub Actions pipelines that test and ship every push.',
  },
];

// the route: waypoints leaving each region (the first point of each group is the region)
const WAYPOINTS = [
  [[250, 505], [262, 450], [262, 395], [266, 350], [308, 320], [335, 280]],
  [[360, 235], [395, 275], [420, 330], [440, 380]],
  [[455, 420], [520, 385], [585, 340], [640, 300], [700, 262]],
  [[760, 232], [785, 290], [790, 336], [850, 390], [852, 432]],
  [[845, 470], [900, 430], [930, 380], [955, 340]],
  [[975, 300]],
];
const CORES = [[262, 425], [390, 268], [600, 330], [800, 300], [918, 405]];

const byName = Object.fromEntries(allSkills.map((s) => [s.name, s]));

function route(points) {
  if (points.length < 2) return '';
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const ALL_POINTS = WAYPOINTS.flat();
const pathUpTo = (zi) => route(ALL_POINTS.slice(0, WAYPOINTS.slice(0, zi).flat().length + 1));
const pct = ([x, y]) => ({ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` });

const INK = '#3a2e24';

/* bridge + tunnel mountain drawn above the route so the path passes under/through them */
function Overpass() {
  return (
    <g>
      <g stroke={INK} strokeWidth="1.4">
        <path d="M262 356 L312 320" stroke="#6e5232" strokeWidth="9" strokeLinecap="round" />
        <path d="M262 356 L312 320" strokeWidth="1" opacity="0.6" strokeDasharray="2 3" />
        <path d="M258 350 L308 314 M266 362 L316 326" />
        <path d="M262 340 L262 356 M287 322 L287 338 M312 304 L312 320" />
        <path d="M262 340 Q287 314 312 304" fill="none" />
      </g>
      <g transform="translate(820 368)">
        <path d="M-52 22 L-10 -40 L4 -24 L14 -34 L56 22 Z" fill="#c4b38c" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M-10 -40 L-4 -12 M14 -34 L18 -8 M-34 10 L-26 0" stroke={INK} strokeWidth="1.1" fill="none" />
      </g>
      <path d="M780 346 a10 10 0 0 1 20 0 Z" fill={INK} />
      <path d="M840 398 a10 10 0 0 1 20 0 Z" fill={INK} />
    </g>
  );
}

function Briefing({ skill, zone }) {
  const tier = tierOf(skill.level);
  const related = LINKS.filter((l) => l.includes(skill.name)).map((l) => (l[0] === skill.name ? l[1] : l[0]));
  return (
    <AnimatePresence mode="wait">
      <motion.div key={skill.name} className="amap__skill" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
        <div className="amap__skill-head">
          <span className="amap__glyph" style={{ background: zone.tone }}>
            {skill.abbr}
          </span>
          <div>
            <h4>{skill.name}</h4>
            <p>
              Rank {tier.rank} · {tier.label}
            </p>
          </div>
        </div>
        <dl className="amap__facts">
          <div>
            <dt>Ability</dt>
            <dd>{skill.note}</dd>
          </div>
          <div>
            <dt>Related technology</dt>
            <dd>{[...new Set([...skill.tools, ...related])].slice(0, 6).join(' · ')}</dd>
          </div>
          <div>
            <dt>Real project use</dt>
            <dd>{USES[skill.name]}</dd>
          </div>
        </dl>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AbilityMap() {
  const { reduceMotion } = useMode();
  const [zi, setZi] = useState(2);
  const [hot, setHot] = useState(null);
  const [skillName, setSkillName] = useState('Python');
  const btns = useRef([]);
  const scroller = useRef(null);
  const first = useRef(true);
  const zone = MAP_ZONES[zi];

  // on narrow screens the atlas scrolls sideways: keep the chosen region in view
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const left = (zone.at[0] / VW) * el.scrollWidth - el.clientWidth / 2;
    el.scrollTo({ left, behavior: first.current || reduceMotion ? 'auto' : 'smooth' });
    first.current = false;
  }, [zone, reduceMotion]);

  const full = useMemo(() => route(ALL_POINTS), []);
  const travelled = useMemo(() => pathUpTo(zi), [zi]);
  const borders = useMemo(() => MAP_ZONES.map((z, i) => blob(z.area[0], z.area[1], z.area[2], z.area[3], 90 + i * 7, 0.13)), []);

  const pick = (i, focusBtn = false) => {
    const n = (i + MAP_ZONES.length) % MAP_ZONES.length;
    setZi(n);
    setSkillName(MAP_ZONES[n].skills[0]);
    if (focusBtn) btns.current[n]?.focus();
  };

  return (
    <div className="amap">
      <div className="amap__scroller" ref={scroller}>
        <div className={`amap__board atl ${reduceMotion ? 'is-still' : ''}`}>
          <svg className="amap__svg" viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
            <AtlasBase />

            {MAP_ZONES.map((z, i) => {
              const Art = REGION_ART[z.id];
              return (
                <g key={z.id} className={`atl__region ${hot === i || zi === i ? 'is-hot' : ''} ${zi === i ? 'is-sel' : ''}`}>
                  <path d={borders[i]} className="atl__border" />
                  <Art />
                  <text x={z.area[0]} y={z.area[1] + z.area[3] - 4} className="atl__place" textAnchor="middle">
                    {z.place}
                  </text>
                  <path
                    d={borders[i]}
                    className="atl__hit"
                    onPointerEnter={() => setHot(i)}
                    onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                    onClick={() => pick(i)}
                  />
                </g>
              );
            })}

            <path d={full} className="atl__route atl__route--worn" />
            <path d={full} className="atl__route" />
            {travelled && (
              <motion.path
                key={zi}
                d={travelled}
                className="atl__route atl__route--done"
                initial={reduceMotion ? false : { pathLength: 0.6 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <Overpass />
            {CORES.map(([x, y], i) => (
              <path key={i} d={`M${x} ${y - 8} l6 8 l-6 8 l-6 -8 Z`} className={`atl__core ${i < zi ? 'is-taken' : ''}`} />
            ))}

            <g className="atl__title" transform="translate(40 36)">
              <path d="M0 0 H330 L316 26 L330 52 H0 L14 26 Z" />
              <text x="165" y="25" textAnchor="middle" className="atl__title-main">
                Code Frontier Atlas
              </text>
              <text x="165" y="42" textAnchor="middle" className="atl__title-sub">
                Six regions · surveyed by the Field Engineer
              </text>
            </g>
          </svg>

          <ol className="amap__points" aria-label="Skill regions">
            {MAP_ZONES.map((z, i) => (
              <li key={z.id} style={pct(z.at)}>
                <button
                  ref={(el) => (btns.current[i] = el)}
                  type="button"
                  className={`amap__cp ${z.sign[0] < 0 ? 'is-left' : 'is-right'} ${i === zi ? 'is-on' : ''} ${i < zi ? 'is-past' : ''}`}
                  onClick={() => pick(i)}
                  onPointerEnter={() => setHot(i)}
                  onPointerLeave={() => setHot((h) => (h === i ? null : h))}
                  onFocus={() => setHot(i)}
                  onBlur={() => setHot(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') pick(i + 1, true);
                    if (e.key === 'ArrowLeft') pick(i - 1, true);
                  }}
                  aria-pressed={i === zi}
                  aria-label={`Region ${i + 1}: ${z.name}, ${z.skills.length} abilities`}
                >
                  <span className="amap__flag" aria-hidden="true">
                    <i />
                  </span>
                  <span className="amap__cp-label">
                    <small>Region {i + 1}</small>
                    {z.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <motion.div
            className="amap__player"
            initial={false}
            animate={pct([zone.at[0] + (zone.sign[0] < 0 ? 22 : -22), zone.at[1] + 2])}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 60, damping: 16 }}
            aria-hidden="true"
          >
            <SpriteSVG map={HERO.idle} px={3} className="amap__sprite" />
          </motion.div>
        </div>
      </div>

      <div className="amap__panel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={zone.id} className="amap__zone" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }}>
            <p className="amap__kicker">
              Region {zi + 1} of {MAP_ZONES.length} · {zone.place}
            </p>
            <h3>{zone.name}</h3>
            <p className="amap__blurb">{zone.blurb}</p>
            <ul className="amap__abilities" aria-label={`${zone.name} abilities`}>
              {zone.skills.map((n) => (
                <li key={n}>
                  <button type="button" className={n === skillName ? 'is-on' : ''} onClick={() => setSkillName(n)} aria-pressed={n === skillName}>
                    <span style={{ background: zone.tone }}>{byName[n].abbr}</span>
                    {n === 'Data Structures' ? 'DSA' : n}
                  </button>
                </li>
              ))}
            </ul>
            <div className="amap__pager">
              <button type="button" onClick={() => pick(zi - 1)}>
                ← Previous region
              </button>
              <button type="button" onClick={() => pick(zi + 1)}>
                Next region →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <Briefing skill={byName[skillName]} zone={zone} />
      </div>
    </div>
  );
}
