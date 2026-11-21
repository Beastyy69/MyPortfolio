import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { featuredProject, githubUrl, projects } from '../../data/projects.js';
import useRepoStats from '../../hooks/useRepoStats.js';
import Icon from '../ui/Icon.jsx';
import ProjectAmbient from './ProjectAmbient.jsx';

/* ─────────────────────────────────────────────────────────────
   AI/ML Mode — Project Ecosystem.
   Hologram With AI is the flagship centrepiece (largest, first, with a
   live GitHub star count). The other projects are supporting modules on
   a connected spine; hovering or selecting one opens a focused panel
   with that project's own animated environment.
   ───────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1];
const satellites = projects.filter((p) => !p.featured);

function GithubButton({ p, primary = true }) {
  return (
    <a href={githubUrl(p)} target="_blank" rel="noreferrer" className={`eco__btn ${primary ? 'is-primary' : ''}`} data-cursor="Open">
      <Icon name="github" size={17} /> View on GitHub
    </a>
  );
}
function LiveButton({ p }) {
  if (!p.live) return null;
  return (
    <a href={p.live} target="_blank" rel="noreferrer" className="eco__btn" data-cursor="Open">
      <Icon name="external" size={16} /> Live demo
    </a>
  );
}
function Stack({ p }) {
  return (
    <ul className="eco__stack" aria-label="Technologies">
      {p.stack.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

function Features({ p }) {
  return (
    <ul className="eco__highlights" aria-label="Key features">
      {p.features.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
}

function Flagship({ p, still }) {
  const stats = useRepoStats(p.repo, { stars: p.stars, forks: p.forks });
  return (
    <motion.article
      className="eco__flag"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease }}
      aria-labelledby="eco-flag-title"
    >
      <div className="eco__flag-stage">
        <ProjectAmbient id={p.id} still={still} className="eco__flag-amb" />
        <span className="eco__flag-tag">
          <i aria-hidden="true" /> Flagship build
        </span>
        <ul className="eco__modes" aria-label="Modes (keys 1–5)">
          {['3D shapes', 'Mouse', 'Air draw', 'AI shapes', '3D models'].map((m, i) => (
            <li key={m}>
              <b>{i + 1}</b> {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="eco__flag-body">
        <div className="eco__flag-meta">
          <span className="eco__cat">{p.category}</span>
          <span className="eco__stats" title={stats.live ? 'Live from GitHub' : 'Verified count from GitHub'}>
            <Icon name="star" size={14} /> {stats.stars} stars <span aria-hidden="true">·</span> {stats.forks} forks
          </span>
        </div>
        <h3 id="eco-flag-title" className="eco__flag-title">
          {p.title}
        </h3>
        <p className="eco__flag-tagline">{p.tagline}</p>
        <p className="eco__text">{p.summary}</p>
        <Features p={p} />
        <Stack p={p} />
        <div className="eco__actions">
          <GithubButton p={p} />
          <LiveButton p={p} />
        </div>
      </div>
    </motion.article>
  );
}

function Panel({ p, still }) {
  return (
    <motion.article
      key={p.id}
      className="eco__panel"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease }}
      aria-labelledby={`eco-${p.id}`}
    >
      <motion.div className="eco__panel-amb" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
        <ProjectAmbient id={p.id} still={still} fit="meet" />
      </motion.div>
      <div className="eco__panel-body">
        <div className="eco__flag-meta">
          <span className="eco__cat">{p.category}</span>
          {p.role === 'Contributor' && <span className="eco__role">{p.roleNote ?? 'Contributor'}</span>}
        </div>
        <h3 id={`eco-${p.id}`} className="eco__panel-title">
          {p.title}
          {p.alias && <small> · {p.alias}</small>}
        </h3>
        <p className="eco__text">{p.summary}</p>
        <Features p={p} />
        <Stack p={p} />
        <div className="eco__actions">
          <GithubButton p={p} />
          <LiveButton p={p} />
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectEcosystem() {
  const { reduceMotion } = useMode();
  const [selId, setSelId] = useState(satellites[0].id);
  const panelRef = useRef(null);
  const sel = satellites.find((p) => p.id === selId) ?? satellites[0];

  const choose = (id, scroll) => {
    setSelId(id);
    if (scroll && window.innerWidth < 900) panelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="eco">
      <Flagship p={featuredProject} still={reduceMotion} />

      <div className="eco__system">
        <p className="eco__label">
          Supporting builds <span>· {satellites.length} projects connected to the core</span>
        </p>
        <div className="eco__grid">
          <ol className="eco__rail" aria-label="Projects">
            {satellites.map((p, i) => {
              const on = p.id === sel.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`eco__mod ${on ? 'is-on' : ''}`}
                    aria-pressed={on}
                    onMouseEnter={() => window.matchMedia('(hover: hover)').matches && choose(p.id)}
                    onFocus={() => choose(p.id)}
                    onClick={() => choose(p.id, true)}
                  >
                    <span className="eco__node" aria-hidden="true" />
                    <span className="eco__idx">{String(i + 2).padStart(2, '0')}</span>
                    <span className="eco__mod-text">
                      <span className="eco__mod-title">{p.title}</span>
                      <span className="eco__mod-cat">
                        {p.category}
                        {p.role === 'Contributor' ? ' · Contributor' : ''}
                      </span>
                    </span>
                    <Icon name="arrowRight" size={16} />
                  </button>
                </li>
              );
            })}
          </ol>
          <div ref={panelRef} className="eco__focus" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={sel.id} p={sel} still={reduceMotion} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
