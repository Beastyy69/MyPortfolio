import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { githubUrl, projects } from '../../data/projects.js';
import useRepoStats from '../../hooks/useRepoStats.js';
import Icon from '../ui/Icon.jsx';
import { C, Landmark, MissionScene } from './OutpostArt.jsx';

/* ─────────────────────────────────────────────────────────────
   Game Mode — Mission Outpost: the project territory of Code Frontier.
   A hand‑drawn parchment map. The Observatory (Hologram With AI, the
   flagship) sits at the centre; every other project is an outpost on a
   route leading out from it. Selecting a place opens a detail scene: the
   camera travels from the landmark on the map into its environment,
   beside a mission dossier with verified details and the GitHub link.
   ───────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1];
// positions on the 1200 × 720 map, and how large each landmark is drawn
const SPOTS = {
  hologram: { x: 600, y: 360, s: 1.15 },
  mailmind: { x: 250, y: 210, s: 0.82 },
  discordbot: { x: 960, y: 200, s: 0.82 },
  scheduler: { x: 1030, y: 520, s: 0.72 },
  rugradar: { x: 790, y: 640, s: 0.78 },
  cinesense: { x: 420, y: 640, s: 0.8 },
  roastme: { x: 170, y: 520, s: 0.82 },
};
const code = (p) => `M-${String(projects.indexOf(p) + 1).padStart(2, '0')}`;

function route(to) {
  const a = SPOTS.hologram;
  const b = SPOTS[to];
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18;
  const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
  return `M${a.x} ${a.y - 6} Q${mx} ${my} ${b.x} ${b.y - 6}`;
}

function Terrain() {
  return (
    <g aria-hidden="true">
      {/* river */}
      <path d="M-20 300 C120 280 170 380 320 360 S520 460 560 560 S620 760 640 800" fill="none" stroke="#8c9a8c" strokeOpacity="0.5" strokeWidth="18" strokeLinecap="round" />
      <path d="M-20 300 C120 280 170 380 320 360 S520 460 560 560 S620 760 640 800" fill="none" stroke={C.ink} strokeOpacity="0.25" strokeWidth="1.4" strokeDasharray="2 8" />
      {/* mountains */}
      {[[420, 120], [480, 100], [540, 125], [700, 110], [760, 90]].map(([x, y], i) => (
        <g key={`m${i}`} stroke={C.ink} strokeOpacity="0.55" strokeWidth="1.8" strokeLinejoin="round">
          <path d={`M${x - 40} ${y + 30} L${x} ${y - 24} L${x + 40} ${y + 30} Z`} fill="#cbbb95" />
          <path d={`M${x} ${y - 24} L${x - 9} ${y - 10} L${x} ${y - 13} L${x + 8} ${y - 9} Z`} fill="#f1e6cc" />
        </g>
      ))}
      {/* forests */}
      {[[320, 470], [345, 486], [300, 495], [880, 380], [905, 395], [860, 400], [1100, 300], [1125, 318], [140, 120], [165, 135], [690, 520], [1060, 660]].map(([x, y], i) => (
        <path key={`t${i}`} d={`M${x} ${y} l-10 18 h20 z`} fill={i % 2 ? C.olive : C.oliveDk} stroke={C.ink} strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" />
      ))}
      {/* compass rose */}
      <g transform="translate(1110 100)" stroke={C.ink} strokeWidth="1.6" strokeOpacity="0.7">
        <circle r="30" fill="none" />
        <path d="M0 -40 L7 0 L0 40 L-7 0 Z" fill={C.paper2} />
        <path d="M-40 0 L0 -6 L40 0 L0 6 Z" fill={C.paper2} />
        <path d="M0 -40 L7 0 L-7 0 Z" fill={C.red} />
        <text y="-46" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill={C.ink} stroke="none">
          N
        </text>
      </g>
      <text x="60" y="690" fontFamily="Georgia, serif" fontStyle="italic" fontSize="20" fill={C.ink} fillOpacity="0.55">
        Code Frontier · Project Territory
      </text>
    </g>
  );
}

function Place({ p, onOpen, live, hovered, setHovered }) {
  const spot = SPOTS[p.id];
  const flag = p.featured;
  const open = (e) => onOpen(p.id, e.currentTarget);
  return (
    <g
      transform={`translate(${spot.x} ${spot.y})`}
      className={`out__place ${flag ? 'is-flag' : ''} ${hovered ? 'is-hover' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${p.place}: ${p.title}${flag ? ' — flagship mission' : ''}. Open mission.`}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(e))}
      onMouseEnter={() => setHovered(p.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(p.id)}
      onBlur={() => setHovered(null)}
      data-cursor-retro="Enter"
    >
      <ellipse cx="0" cy="4" rx={78 * spot.s} ry={14 * spot.s} fill={C.ink} fillOpacity="0.16" />
      <g className="out__lift">
        <g transform={`scale(${spot.s})`}>
          <Landmark id={p.id} live={live} />
        </g>
      </g>
      <g transform={`translate(0 ${30 + (flag ? 6 : 0)})`} className="out__banner">
        <path d={`M-${flag ? 112 : 92} -15 H${flag ? 112 : 92} L${flag ? 102 : 84} 0 L${flag ? 112 : 92} 15 H-${flag ? 112 : 92} L-${flag ? 102 : 84} 0 Z`} fill={flag ? C.red : C.paper} stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
        <text y="5" textAnchor="middle" className={`out__banner-text ${flag ? 'is-flag' : ''}`}>
          {p.place}
        </text>
      </g>
      {flag && (
        <text y="76" textAnchor="middle" className="out__flagnote">
          ★ Flagship mission · {p.title}
        </text>
      )}
    </g>
  );
}

function Dossier({ p }) {
  const stats = useRepoStats(p.featured ? p.repo : null, { stars: p.stars, forks: p.forks });
  return (
    <div className="out__dossier">
      <p className="out__kicker">
        {code(p)} · {p.place}
        {p.featured ? ' · Flagship' : ''}
      </p>
      <h3 id={`out-${p.id}`}>
        {p.title}
        {p.alias && <small> · {p.alias}</small>}
      </h3>
      <div className="out__tags">
        <span className="out__tag">{p.category}</span>
        <span className={`out__tag ${p.role === 'Contributor' ? 'is-role' : ''}`}>{p.roleNote ?? p.role}</span>
        {p.featured && (
          <span className="out__tag is-gold">
            <Icon name="star" size={13} /> {stats.stars} stars · {stats.forks} forks
          </span>
        )}
      </div>
      <p className="out__text">{p.summary}</p>
      <div className="out__log">
        <p className="out__label">Mission log</p>
        <ul>
          {p.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="out__label">Supplies</p>
        <ul className="out__stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="out__actions">
        <a href={githubUrl(p)} target="_blank" rel="noreferrer" className="out__btn is-primary" data-cursor-retro="Open">
          <Icon name="github" size={17} /> View on GitHub
        </a>
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className="out__btn" data-cursor-retro="Open">
            <Icon name="external" size={16} /> Live site
          </a>
        )}
      </div>
    </div>
  );
}

/* the detail scene: the camera travels from the landmark into its world */
function Scene({ id, origin, onClose, onStep, reduceMotion }) {
  const p = projects.find((x) => x.id === id);
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [onClose, onStep]);

  // start the art where the landmark sat on the map
  const from = origin && !reduceMotion
    ? { x: origin.x - window.innerWidth * 0.28, y: origin.y - window.innerHeight * 0.5, scale: 0.18, opacity: 0.4 }
    : { opacity: 0 };

  return (
    <motion.div className="out__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} onClick={onClose}>
      <div className="out__scene" role="dialog" aria-modal="true" aria-labelledby={`out-${p.id}`} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={p.id} className="out__scene-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <motion.div className="out__scene-art" initial={from} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: reduceMotion ? 0.2 : 0.75, ease }}>
              <MissionScene id={p.id} live={!reduceMotion} title={`${p.place} — illustration for ${p.title}`} />
              {p.featured && <span className="out__ribbon">Flagship mission</span>}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.35, ease }}>
              <Dossier p={p} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="out__nav">
          <button type="button" className="out__navbtn" onClick={() => onStep(-1)} aria-label="Previous mission">
            <Icon name="arrowRight" size={16} />
          </button>
          <span>
            {code(p)} / {projects.length}
          </span>
          <button type="button" className="out__navbtn is-next" onClick={() => onStep(1)} aria-label="Next mission">
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
        <button ref={closeRef} type="button" className="out__close" onClick={onClose} aria-label="Back to the map">
          <Icon name="close" size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export default function MissionOutpost() {
  const { reduceMotion } = useMode();
  const [hovered, setHovered] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [origin, setOrigin] = useState(null);
  const returnFocus = useRef(null);

  const open = useCallback((id, el) => {
    returnFocus.current = el ?? document.activeElement;
    const r = el?.getBoundingClientRect?.();
    setOrigin(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
    setOpenId(id);
  }, []);
  const close = useCallback(() => {
    setOpenId(null);
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }, []);
  const step = useCallback((d) => {
    setOrigin(null);
    setOpenId((cur) => {
      const i = projects.findIndex((p) => p.id === cur);
      return projects[(i + d + projects.length) % projects.length].id;
    });
  }, []);

  // draw order: smaller outposts first, the observatory on top
  const ordered = [...projects].sort((a, b) => (a.featured ? 1 : 0) - (b.featured ? 1 : 0));

  return (
    <div className="out">
      <div className="out__map">
        <svg viewBox="0 0 1200 720" className="out__map-svg" aria-label="Project territory map. Each place is a project; select one to open its mission.">
          <Terrain />
          {/* routes from the observatory to every outpost */}
          {projects
            .filter((p) => !p.featured)
            .map((p, i) => (
              <motion.path
                key={p.id}
                d={route(p.id)}
                className={`out__route ${hovered === p.id ? 'is-on' : ''}`}
                initial={{ pathLength: reduceMotion ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.12, ease }}
              />
            ))}
          {ordered.map((p) => (
            <Place key={p.id} p={p} onOpen={open} live={!reduceMotion} hovered={hovered === p.id} setHovered={setHovered} />
          ))}
        </svg>
      </div>

      {/* roster: every mission as a plain list — for phones, keyboards and quick scanning */}
      <ol className="out__roster" aria-label="Missions">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`out__chip ${p.featured ? 'is-flag' : ''} ${hovered === p.id ? 'is-hover' : ''}`}
              onClick={(e) => open(p.id, e.currentTarget)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="out__chip-code">{code(p)}</span>
              <span className="out__chip-text">
                <b>{p.title}</b>
                <span>
                  {p.place}
                  {p.role === 'Contributor' ? ' · Contributor' : ''}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {createPortal(
        <AnimatePresence>{openId && <Scene key="scene" id={openId} origin={origin} onClose={close} onStep={step} reduceMotion={reduceMotion} />}</AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
