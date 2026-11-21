import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { journey } from '../../data/journey.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import CareerMap from '../game/CareerMap.jsx';

/* ───────── AI: technical growth timeline ─────────
   A sticky year on the left; on the right, milestones joined by a path
   that grows as you scroll. Each card: year, focus, story, what I did,
   key technologies. Content: src/data/journey.js (my real history). */
function Timeline() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const items = [...listRef.current.querySelectorAll('[data-step]')];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.step))),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  const step = journey[active];
  return (
    <div className="tl">
      <div className="tl__aside">
        <p className="mono-label">Now viewing</p>
        <AnimatePresence mode="wait">
          <motion.p key={step.period} className="tl__period" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            {step.period}
          </motion.p>
        </AnimatePresence>
        <p className="tl__counter">
          <strong>{String(active + 1).padStart(2, '0')}</strong> / {String(journey.length).padStart(2, '0')}
        </p>
        <div className="tl__bar">
          <motion.i style={{ scaleX: fill }} />
        </div>
      </div>

      <div className="tl__track">
        {/* the growth path: a calm line that draws itself as you scroll */}
        <svg className="tl__spine" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M12 0 C20 14 4 26 12 38 S20 62 12 74 S4 92 12 100" className="tl__spine-base" vectorEffect="non-scaling-stroke" />
          <motion.path d="M12 0 C20 14 4 26 12 38 S20 62 12 74 S4 92 12 100" className="tl__spine-grow" vectorEffect="non-scaling-stroke" style={{ pathLength: fill }} />
        </svg>
        <ol className="tl__list" ref={listRef}>
          {journey.map((s, i) => (
            <motion.li
              key={s.level}
              data-step={i}
              className={`tl__item ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* milestone marker: the year sits on the path, joined to its card */}
              <span className="tl__marker" aria-hidden="true">
                <i />
                <b>{s.period}</b>
              </span>
              <article className="tl__card">
                <p className="tl__when">
                  <span>Milestone {s.level}</span>
                  {s.current && (
                    <span className="tl__now">
                      <i className="status-dot" /> Now
                    </span>
                  )}
                </p>
                <h3>
                  <span className="tl__year">{s.period}</span> {s.aiTitle}
                </h3>
                <p className="tl__text">{s.text}</p>
                <ul className="tl__did">
                  {s.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <ul className="tl__tags" aria-label="Key technologies">
                  {s.loot.map((l) => (
                    <li key={l} className="chip">
                      {l}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Journey() {
  const { isRetro } = useMode();
  return (
    <Chapter id="journey" ghost="Journey" retroGhost="CAMPAIGN" className="journey" labelledBy="journey-title">
      <div className="container">
        <SectionHeading
          id="journey-title"
          index="05"
          eyebrow="Journey"
          retroEyebrow="CAMPAIGN TRAIL"
          title="From first web pages to AI systems."
          retroTitle="Campaign trail"
          intro="2020 → 2026: community and web design, core programming, building, then AI/ML and backend."
          retroIntro="Every stage of my learning is a place in Code Frontier. Pick a destination and the explorer walks the trail there."
        />
        {isRetro ? <CareerMap /> : <Timeline />}
      </div>
    </Chapter>
  );
}
