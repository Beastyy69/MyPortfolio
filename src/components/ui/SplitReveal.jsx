import { motion } from 'framer-motion';

/**
 * Masked word‑by‑word text reveal. Each word slides up from behind a clip.
 * `as` sets the wrapper tag; `animate` (optional) forces state instead of in‑view.
 */
export default function SplitReveal({ text, as = 'span', className = '', delay = 0, stagger = 0.06, animate, once = true }) {
  const Tag = motion[as];
  const words = text.split(' ');
  const inViewProps = animate === undefined ? { whileInView: 'show', viewport: { once, margin: '-60px' } } : { animate: animate ? 'show' : 'hidden' };

  return (
    <Tag className={`split ${className}`} initial="hidden" {...inViewProps} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
        <span className="split__mask" aria-hidden="true">
          <motion.span
            className="split__word"
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {w}
          </motion.span>
        </span>
        {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
