import { motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';

/**
 * Renders the AI or Retro version of a slot. The swap is instant (so layout
 * height settles under the transition overlay) and the new version eases in.
 */
export default function ModeSwap({ ai, retro, className, style }) {
  const { mode } = useMode();
  return (
    <motion.div
      key={mode}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {mode === 'retro' ? retro : ai}
    </motion.div>
  );
}
