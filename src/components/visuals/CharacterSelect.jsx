import { motion } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { useProfile } from '../../context/ProfileContext.jsx';

/** Retro About visual: an original character‑select screen. Click to open the Player Profile. */
export default function CharacterSelect() {
  const { open } = useProfile();

  return (
    <div className="csel">
      <div className="csel__top">
        <span className="pixel-tag">1P</span>
        <p>SELECT PLAYER</p>
      </div>

      <motion.button
        type="button"
        className="csel__hero"
        onClick={open}
        aria-label={`Select ${profile.name} — open player profile`}
        data-cursor="Select"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        <span className="csel__char"><img src={profile.gamePhoto} alt={`${profile.name}`} className="csel__photo" style={{ objectPosition: profile.gamePhotoPosition }} /></span>
        <span className="csel__name">
          <small>SELECT PLAYER:</small> {profile.firstName.toUpperCase()}
        </span>
        <span className="csel__press blink-slow">▶ PRESS TO VIEW PROFILE</span>
      </motion.button>

      <dl className="csel__stats">
        <div>
          <dt>CLASS</dt>
          <dd>AI/ML + BACKEND</dd>
        </div>
        <div>
          <dt>MAIN SKILL</dt>
          <dd>PYTHON</dd>
        </div>
        <div>
          <dt>SPECIAL</dt>
          <dd>PROBLEM SOLVER</dd>
        </div>
        <div className="csel__lv">
          <dt>LV 21</dt>
          <dd>
            <i>
              <motion.b initial={{ scaleX: 0 }} whileInView={{ scaleX: 0.78 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.4 }} />
            </i>
          </dd>
        </div>
      </dl>

    </div>
  );
}
