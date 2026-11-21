import { useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useMode } from '../../context/ModeContext.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * AI mode About visual: one editorial portrait. The photo is cropped head‑to‑
 * waist; name, line and "Open profile" sit in a translucent navy caption
 * layered over the bottom of the photo, so image and text read as one piece.
 * The photo shifts a few pixels with the pointer (gentle depth).
 */
export default function ModelArchitect() {
  const { open } = useProfile();
  const { reduceMotion } = useMode();
  const ref = useRef(null);
  const onMove = (e) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current?.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const reset = () => {
    ref.current?.style.setProperty('--mx', '0');
    ref.current?.style.setProperty('--my', '0');
  };

  return (
    <motion.figure
      ref={ref}
      className="arch"
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="arch__photo" onClick={open} aria-label={`Open ${profile.name}'s profile`} data-cursor="Profile">
        <img src={profile.photo} alt={`Portrait of ${profile.name}`} loading="lazy" />
      </button>
      <figcaption className="arch__caption">
        <p>
          <strong>{profile.name}</strong>
          Builds machine‑learning systems and the Python services that ship them.
        </p>
        <button type="button" className="arch__open" onClick={open}>
          Open profile <Icon name="arrowRight" size={16} />
        </button>
      </figcaption>
    </motion.figure>
  );
}
