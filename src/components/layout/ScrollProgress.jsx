import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';
import { useMode } from '../../context/ModeContext.jsx';
import { chapters } from '../../data/navigation.js';
import useActiveSection from '../../hooks/useActiveSection.js';

/** Discreet vertical progress rail with chapter ticks (desktop only). */
export default function ScrollProgress() {
  const { mode, isRetro, booted } = useMode();
  const list = chapters[mode];
  const active = useActiveSection(list.map((c) => c.id));
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPct(Math.round(v * 100)));
  const activeIdx = Math.max(0, list.findIndex((c) => c.id === active));

  return (
    <motion.nav
      className="rail"
      aria-label="Chapters"
      initial={{ opacity: 0, x: 20 }}
      animate={booted ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <span className="rail__pct" aria-hidden="true">
        {isRetro ? `${String(pct).padStart(3, '0')}%` : `${String(pct).padStart(2, '0')}`}
      </span>
      <div className="rail__track">
        <motion.span className="rail__fill" style={{ scaleY: fill }} />
        <ol className="rail__ticks">
          {list.map((c, i) => (
            <li key={c.id} style={{ top: `${(i / (list.length - 1)) * 100}%` }}>
              <a href={`#${c.id}`} className={`rail__tick ${i <= activeIdx ? 'is-past' : ''} ${c.id === active ? 'is-active' : ''}`} aria-current={c.id === active ? 'true' : undefined}>
                <span className="rail__label">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <span className="rail__chapter" aria-hidden="true">
        {String(activeIdx + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}
      </span>
    </motion.nav>
  );
}
