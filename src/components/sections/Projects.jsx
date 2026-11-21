/**
 * Projects section.
 *   AI mode   → editorial case‑study rows with an image wipe and parallax, plus filters.
 *   Game mode → <MissionSelect />: a mission-selection room with illustrated plaques and briefings.
 * Data: src/data/projects.js. A project without a demo URL shows "Demo soon".
 */
import { forwardRef, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { projects, projectFilters } from '../../data/projects.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import ProjectArt from '../visuals/ProjectArt.jsx';
import MissionSelect from '../game/MissionSelect.jsx';
import Icon from '../ui/Icon.jsx';

const catLabel = Object.fromEntries(projectFilters.map((f) => [f.id, f]));
const hasDemo = (p) => p.demo && p.demo !== '#';

function Media({ project }) {
  return project.image ? <img src={project.image} alt={`${project.title} preview`} loading="lazy" /> : <ProjectArt kind={project.art} />;
}

function Filters({ filter, setFilter, retro }) {
  return (
    <LayoutGroup id={`filters-${retro ? 'r' : 'a'}`}>
      <div className="filters" role="group" aria-label="Filter projects by category">
        {projectFilters.map((f) => (
          <button key={f.id} type="button" className={`filters__btn ${filter === f.id ? 'is-on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {filter === f.id && <motion.span layoutId="filter-pill" className="filters__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span>{retro ? f.retro : f.label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

/* ───────── AI: editorial case-study rows ───────── */
const CaseRow = forwardRef(function CaseRow({ project, index }, outerRef) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const flip = index % 2 === 1;
  const seen = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.article
      ref={outerRef}
      layout
      className={`case ${flip ? 'case--flip' : ''} ${index === 0 ? 'case--lead' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div ref={ref} className="case__media-wrap">
        <motion.a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="case__media"
          data-cursor="View"
          aria-label={`${project.title} on GitHub`}
          initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
          animate={seen ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div className="case__media-inner" style={{ y: mediaY }}>
            <Media project={project} />
          </motion.div>
          <span className="case__cat">{catLabel[project.category].label}</span>
        </motion.a>
      </div>

      <motion.div
        className="case__body"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="case__idx">
          {String(index + 1).padStart(2, '0')} <span>/ {project.subtitle}</span>
        </p>
        <h3 className="case__title">{project.title}</h3>
        <p className="case__summary">{project.summary}</p>
        <div className="case__metric">
          <strong>{project.metric.value}</strong>
          <span>{project.metric.label}</span>
        </div>
        <ul className="case__stack" aria-label="Tech stack">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="case__actions">
          <Button href={project.github} variant="ghost" iconLeft="github">
            GitHub
          </Button>
          {hasDemo(project) ? (
            <Button href={project.demo} variant="subtle" icon="external">
              Live demo
            </Button>
          ) : (
            <span className="cta-soon" role="note" title="Live demo coming soon">
              <Icon name="lock" size={14} /> Demo coming soon
            </span>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
});

function CaseStudies() {
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  return (
    <>
      <Filters filter={filter} setFilter={setFilter} />
      <div className="cases">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <CaseRow key={p.id} project={p} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Projects() {
  const { isRetro } = useMode();
  return (
    <Chapter id="projects" ghost="Selected work" retroGhost="MISSIONS" className="projects" labelledBy="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Selected work"
          retroEyebrow="MISSION SELECT"
          title="Products that ship intelligence."
          retroTitle="Choose your mission"
          intro="Case studies across machine learning, backend engineering and game‑inspired AI."
          retroIntro="Every project is a mission on the board. Pick a plaque, then open the briefing for the challenge, the approach, the outcome and the source."
        />
        {isRetro ? <MissionSelect /> : <CaseStudies />}
      </div>
    </Chapter>
  );
}
