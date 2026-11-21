import { motion } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { useProfile } from '../../context/ProfileContext.jsx';
import Icon from '../ui/Icon.jsx';

/** AI mode About visual: one large portrait with a short editorial caption beside it. */
export default function ModelArchitect() {
  const { open } = useProfile();
  return (
    <figure className="arch">
      <motion.button
        type="button"
        className="arch__photo"
        onClick={open}
        aria-label={`Open ${profile.name}'s profile`}
        data-cursor="Profile"
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
      >
        <img src={profile.photo} alt="" loading="lazy" />
      </motion.button>
      <figcaption className="arch__caption">
        <p>
          <strong>{profile.name}</strong>
          Builds machine‑learning systems and the Python services that ship them.
        </p>
        <button type="button" className="arch__open" onClick={open}>
          Open profile <Icon name="arrowRight" size={16} />
        </button>
      </figcaption>
    </figure>
  );
}
