import { useMotionValue, useSpring } from 'framer-motion';
import { useMode } from '../context/ModeContext.jsx';

const finePointer = typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

/**
 * Magnetic pull toward the cursor. Returns motion values + handlers to spread
 * onto a motion element. No‑op on touch devices and with reduced motion.
 */
export default function useMagnetic(strength = 0.35) {
  const { reduceMotion } = useMode();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const enabled = finePointer && !reduceMotion;

  const onPointerMove = (e) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: { x: sx, y: sy }, onPointerMove, onPointerLeave };
}
