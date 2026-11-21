import { motion } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { useProfile } from '../../context/ProfileContext.jsx';

/**
 * Game mode hero portrait — an original game‑cartridge cover: moulded shell,
 * printed paper label, cover art (the photo) and a title block.
 */
export default function ArcadePortrait() {
  const { open, isOpen, photoId } = useProfile();
  const hidden = isOpen && photoId === 'photo-cart';
  return (
    <motion.div
      className="cart"
      initial={{ opacity: 0, y: 40, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{ y: -6, rotate: -0.8 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="cart__shell">
        <span className="cart__grip" aria-hidden="true" />
        <div className="cart__label">
          <div className="cart__band">
            <span>VOL. 01</span>
            <span>1 PLAYER</span>
          </div>
          <button type="button" className="cart__art" onClick={(e) => open(e, 'photo-cart')} aria-label={`Open ${profile.name}'s player profile`} data-cursor="Select">
            {!hidden && (
              <motion.div layoutId="photo-cart" className="cart__char">
                <img src={profile.gamePhoto} alt={`${profile.name}`} className="cart__photo" style={{ objectPosition: profile.gamePhotoPosition }} />
              </motion.div>
            )}
          </button>
          <div className="cart__title">
            <small>The adventures of</small>
            <strong>{profile.firstName}</strong>
            <span>AI/ML · Python Backend · Web</span>
          </div>
        </div>
      </div>
      <button type="button" className="cart__open" onClick={(e) => open(e, 'photo-cart')}>
        View player profile
      </button>
    </motion.div>
  );
}
