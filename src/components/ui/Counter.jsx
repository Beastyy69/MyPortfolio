import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

/** Counts up from 0 to `value` when scrolled into view. */
export default function Counter({ value, suffix = '', duration = 1.6, pad = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(pad, '0') + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, pad]);

  return <span ref={ref}>{String(0).padStart(pad, '0') + suffix}</span>;
}
