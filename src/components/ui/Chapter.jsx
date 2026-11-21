import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';

/**
 * A section framed as a full‑screen "chapter" of the scroll journey.
 *  - entering: the stage rises out of a rounded mask and settles to full size
 *  - leaving:  it eases back slightly so the next chapter takes the foreground
 *  - an oversized ghost word drifts horizontally behind the content
 * Every value is scroll‑linked (no timers), so landing mid‑page is always
 * correct. With reduced motion the chapter is simply static.
 */
export default function Chapter({ id, ghost, retroGhost, className = '', labelledBy, children }) {
  const ref = useRef(null);
  const { isRetro, reduceMotion } = useMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ['end 0.3', 'end start'] });

  const x = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const scale = useTransform([enter, leave], ([a, b]) => 0.92 + 0.08 * a - 0.04 * b);
  const y = useTransform(enter, [0, 1], [90, 0]);
  const opacity = useTransform([enter, leave], ([a, b]) => Math.min(1, 0.3 + a * 1.1) - b * 0.35);
  // a widening mask: the chapter opens from a framed panel to full bleed
  const inset = useTransform(enter, [0, 0.85], [5, 0], { clamp: true });
  const radius = useTransform(enter, [0, 0.85], [isRetro ? 4 : 32, 0], { clamp: true });
  const clipPath = useTransform([inset, radius], ([i, r]) => (i < 0.05 ? 'none' : `inset(0% ${i}% 0% ${i}% round ${r}px)`));

  const stageStyle = reduceMotion ? undefined : { scale, y, opacity, clipPath };

  return (
    <section id={id} ref={ref} className={`section chapter ${className}`} aria-labelledby={labelledBy}>
      <motion.div className="chapter__ghost" style={reduceMotion ? undefined : { x }} aria-hidden="true">
        {isRetro ? retroGhost ?? ghost : ghost}
      </motion.div>
      <motion.span
        className="chapter__rule"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div className="chapter__stage" style={stageStyle}>
        {children}
      </motion.div>
    </section>
  );
}
