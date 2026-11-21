import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { profile } from '../../data/profile.js';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useMode } from '../../context/ModeContext.jsx';
import Icon from '../ui/Icon.jsx';

export const HERO_PHOTO_ID = 'photo-hero';

/**
 * "Intelligence portrait": the real photo inside a layered editorial frame —
 * stacked paper planes, soft geometric shadow shapes, a faint neural texture
 * and a few slow curved data lines. Layers shift gently with the pointer.
 * Clicking morphs the photo into the "About My Work" panel.
 */
export default function NeuralPortrait() {
  const { open, isOpen, photoId } = useProfile();
  const { reduceMotion } = useMode();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const layer = (d) => ({ x: useTransform(sx, (v) => v * d), y: useTransform(sy, (v) => v * d) });
  const back = layer(-14);
  const mid = layer(-7);
  const photo = layer(4);

  const onMove = (e) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  const hidden = isOpen && photoId === HERO_PHOTO_ID;
  const rise = () => (reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 });
  const risen = { opacity: 1, y: 0 };
  const reveal = (delay) => ({ duration: reduceMotion ? 0.3 : 0.7, delay: reduceMotion ? 0.2 : delay, ease: [0.22, 1, 0.36, 1] });

  return (
    <figure className="ip" onPointerMove={onMove} onPointerLeave={reset}>
      {/* clean depth: a solid colour block behind + a thin offset outline frame */}
      <motion.span className="ip__block" style={back} aria-hidden="true" initial={{ opacity: 0, x: -20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      <motion.span
        className="ip__outline"
        style={mid}
        aria-hidden="true"
        initial={{ clipPath: 'inset(0 100% 100% 0)' }}
        animate={{ clipPath: 'inset(0 0% 0% 0)' }}
        transition={{ duration: 1.6, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* the photo */}
      <motion.button
        type="button"
        className="ip__frame"
        style={photo}
        onClick={(e) => open(e, HERO_PHOTO_ID)}
        aria-label={`Open About My Work — ${profile.name}`}
        data-cursor="About"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >
        {!hidden && <motion.img layoutId={HERO_PHOTO_ID} src={profile.photo} alt={`Portrait of ${profile.name}`} fetchpriority="high" />}
        <span className="ip__texture" aria-hidden="true" />
      </motion.button>

      {/* caption: settles after the photo — name, then role, then action */}
      <figcaption className="ip__caption">
        <motion.b className="ip__name" initial={rise(0)} animate={risen} transition={reveal(1.35)}>
          {profile.name}
        </motion.b>
        <motion.span className="ip__role" initial={rise(0)} animate={risen} transition={reveal(1.55)}>
          AIML Developer <i>·</i> Python Backend Engineer
        </motion.span>
        <motion.button type="button" className="ip__open" onClick={(e) => open(e, HERO_PHOTO_ID)} initial={rise(0)} animate={risen} transition={reveal(1.75)}>
          About my work <Icon name="arrowRight" size={16} />
        </motion.button>
      </figcaption>
    </figure>
  );
}
