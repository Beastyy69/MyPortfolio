import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { journey } from '../../data/journey.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import CareerMap from '../game/CareerMap.jsx';

/* ───────── AI: sticky editorial timeline ───────── */
function Timeline() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
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
            {step.period.split(' ')[0]}
          </motion.p>
        </AnimatePresence>
        <p className="tl__counter">
          <strong>{String(active + 1).padStart(2, '0')}</strong> / {String(journey.length).padStart(2, '0')}
        </p>
        <div className="tl__bar">
          <motion.i style={{ scaleX: fill }} />
        </div>
      </div>

      <ol className="tl__list" ref={listRef}>
        {journey.map((s, i) => (
          <motion.li
            key={s.level}
            data-step={i}
            className={`tl__item ${i === active ? 'is-active' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="tl__num">{s.level}</span>
            <div>
              <p className="tl__when">
                {s.period}
                {s.current && (
                  <span className="tl__now">
                    <i className="status-dot" /> Now
                  </span>
                )}
              </p>
              <h3>{s.aiTitle}</h3>
              <p className="tl__text">{s.text}</p>
              <ul className="tl__tags">
                {s.loot.map((l) => (
                  <li key={l} className="chip">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
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
          title="From first lines of code to real products."
          retroTitle="Campaign trail"
          retroIntro="Every stage of my career is a place in Code Frontier. Pick a destination, or drag the map to look around."
        />
        {isRetro ? <CareerMap /> : <Timeline />}
      </div>
    </Chapter>
  );
}
