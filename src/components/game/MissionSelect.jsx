import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { missionFilters, projects } from '../../data/projects.js';
import Icon from '../ui/Icon.jsx';
import MissionScene, { SceneDefs } from './MissionScenes.jsx';

/* ─────────────────────────────────────────────────────────────
   Mission Select Gallery (Game mode projects).
   A mission-selection room: a wood-panelled expedition board with
   wall-mounted mission plaques (each an illustrated scene in an embossed
   brass frame with a paper label), physical category tokens as filters,
   and a large framed expedition panel for the selected mission. "Open
   briefing" expands the panel (shared layout) into an immersive detail
   view: challenge, approach, outcome, stack and links.
   ───────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1];
const hasDemo = (p) => p.demo && p.demo !== '#';
const code = (p) => `M-${String(projects.indexOf(p) + 1).padStart(2, '0')}`;
const TOKEN_ICON = { all: '✶', ai: '◆', backend: '▲', data: '■', web: '●', arcade: '✚' };

function Marker({ still }) {
  return (
    <motion.svg
      className="msel__marker"
      viewBox="0 0 30 40"
      aria-hidden="true"
      animate={still ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M15 38 L4 20 A13 13 0 1 1 26 20 Z" fill="#8a3d33" stroke="#2a1f17" strokeWidth="2" />
      <circle cx="15" cy="14" r="5" fill="#e9dcc0" />
    </motion.svg>
  );
}

function Status({ p }) {
  const done = p.status === 'complete';
  return <span className={`msel__stamp ${done ? '' : 'is-wip'}`}>{done ? 'Mission complete' : 'In progress'}</span>;
}

function Actions({ p }) {
  return (
    <div className="msel__actions">
      <a href={p.github} target="_blank" rel="noreferrer" className="msel__btn is-primary" data-cursor-retro="Open">
        <Icon name="github" size={17} /> GitHub source
      </a>
      {hasDemo(p) ? (
        <a href={p.demo} target="_blank" rel="noreferrer" className="msel__btn" data-cursor-retro="Open">
          <Icon name="external" size={17} /> Live demo
        </a>
      ) : (
        <span className="msel__btn is-disabled" role="note" aria-label="Demo in development">
          <Icon name="lock" size={15} /> Demo in development
        </span>
      )}
    </div>
  );
}

function Stack({ p }) {
  return (
    <ul className="msel__stack" aria-label="Tech stack">
      {p.stack.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

/* the selected mission, mounted on the wall as a large expedition panel */
function Panel({ p, onOpen, reduceMotion }) {
  return (
    <motion.article
      key={p.id}
      className="msel__panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease }}
      aria-labelledby={`msel-${p.id}`}
    >
      <motion.button type="button" layoutId={`msel-scene-${p.id}`} className="msel__view" onClick={onOpen} data-cursor-retro="Brief" aria-label={`Open the ${p.title} mission briefing`}>
        <motion.span
          className="msel__view-inner"
          animate={reduceMotion ? undefined : { scale: [1.02, 1.07, 1.02], x: ['0%', '-1.5%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MissionScene id={p.id} title={`${p.env}: illustration for ${p.title}`} className="msel__scene" />
        </motion.span>
        <span className="msel__pin" style={{ left: `${30 + ((projects.indexOf(p) * 17) % 40)}%` }}>
          <Marker still={reduceMotion} />
        </span>
        <span className="msel__place">{p.env}</span>
        <span className="msel__expand">
          Open briefing <Icon name="arrowRight" size={15} />
        </span>
      </motion.button>

      <div className="msel__card">
        <div className="msel__cardhead">
          <p className="msel__kicker">
            {code(p)} · {p.missionType}
          </p>
          <Status p={p} />
        </div>
        <h3 id={`msel-${p.id}`}>{p.title}</h3>
        <p className="msel__sub">{p.subtitle}</p>
        <p className="msel__text">{p.summary}</p>
        <div className="msel__row">
          <div className="msel__outcome">
            <strong>{p.metric.value}</strong>
            <span>{p.metric.label}</span>
          </div>
          <Stack p={p} />
        </div>
        <Actions p={p} />
      </div>
    </motion.article>
  );
}

/* immersive briefing: the scene expands out of the panel */
function Briefing({ p, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);

  return (
    <motion.div className="msel__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} onClick={onClose}>
      <motion.div
        className="msel__brief"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby={`brief-${p.id}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div layoutId={`msel-scene-${p.id}`} className="msel__brief-scene" transition={{ duration: 0.55, ease }}>
          <MissionScene id={p.id} title={`${p.env}: illustration for ${p.title}`} className="msel__scene" />
          <span className="msel__place">{p.env}</span>
        </motion.div>
        <motion.div className="msel__brief-body" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.45, ease } }}>
          <div className="msel__cardhead">
            <p className="msel__kicker">
              Mission briefing · {code(p)} · {p.missionType}
            </p>
            <Status p={p} />
          </div>
          <h3 id={`brief-${p.id}`}>{p.title}</h3>
          <p className="msel__sub">{p.subtitle}</p>
          <dl className="msel__facts">
            <div>
              <dt>The challenge</dt>
              <dd>{p.challenge}</dd>
            </div>
            <div>
              <dt>Solution &amp; approach</dt>
              <dd>{p.summary}</dd>
            </div>
            <div className="msel__facts-out">
              <dt>Outcome</dt>
              <dd>
                <strong>{p.metric.value}</strong> {p.metric.label}
              </dd>
            </div>
            <div>
              <dt>Tech stack</dt>
              <dd>
                <Stack p={p} />
              </dd>
            </div>
          </dl>
          <Actions p={p} />
        </motion.div>
        <button ref={closeRef} type="button" className="msel__close" onClick={onClose} aria-label="Close briefing">
          <Icon name="close" size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function MissionSelect() {
  const { reduceMotion } = useMode();
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState(projects[0].id);
  const [briefing, setBriefing] = useState(false);
  const [ghostH, setGhostH] = useState(0);
  const panelRef = useRef(null);
  const visible = filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));
  const sel = visible.find((p) => p.id === selId) ?? visible[0];

  const choose = (id) => {
    setSelId(id);
    const el = panelRef.current;
    if (el && window.innerWidth < 980) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <LayoutGroup id="mission-select">
      <div className="msel">
        <SceneDefs />
        <div className="msel__tokens" role="group" aria-label="Mission categories">
          {missionFilters.map((f) => {
            const n = f.id === 'all' ? projects.length : projects.filter((p) => p.tags.includes(f.id)).length;
            const on = filter === f.id;
            return (
              <button key={f.id} type="button" className={`msel__token ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setFilter(f.id)}>
                <span className="msel__token-coin" aria-hidden="true">
                  {TOKEN_ICON[f.id]}
                </span>
                {f.id === 'all' ? 'All' : f.label}
                <small>{n}</small>
              </button>
            );
          })}
        </div>

        <div className="msel__room">
          <motion.ul className="msel__wall" layout aria-label="Missions">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => {
                const on = sel?.id === p.id;
                return (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease }}
                  >
                    <button type="button" className={`mplaque ${on ? 'is-on' : ''}`} onClick={() => choose(p.id)} aria-pressed={on}>
                      <span className="mplaque__frame">
                        <MissionScene id={p.id} title="" className="mplaque__scene" />
                        <span className="mplaque__pin" aria-hidden="true">
                          <Marker still />
                        </span>
                      </span>
                      <span className="mplaque__label">
                        <span className="mplaque__code">
                          {code(p)} · {p.missionType}
                        </span>
                        <span className="mplaque__title">{p.title}</span>
                        <span className="mplaque__meta">
                          <b>{p.metric.value}</b> {p.metric.label}
                        </span>
                      </span>
                      <span className={`mplaque__lamp ${p.status === 'complete' ? '' : 'is-wip'}`} aria-label={p.status === 'complete' ? 'Complete' : 'In progress'} />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>

          <div ref={panelRef} className="msel__stage" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {sel && !briefing && <Panel key={sel.id} p={sel} onOpen={() => {
                    setGhostH(panelRef.current?.offsetHeight ?? 0);
                    setBriefing(true);
                  }} reduceMotion={reduceMotion} />}
              {sel && briefing && <div key="placeholder" className="msel__panel msel__panel--ghost" style={{ height: ghostH }} aria-hidden="true" />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* portalled so the page's scroll-linked transforms can't trap the fixed overlay */}
      {createPortal(<AnimatePresence>{sel && briefing && <Briefing key={`b-${sel.id}`} p={sel} onClose={() => setBriefing(false)} />}</AnimatePresence>, document.body)}
    </LayoutGroup>
  );
}
