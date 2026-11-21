import { motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { SOCIALS } from '../profile/ProfileModal.jsx';
import Icon from './Icon.jsx';

const ext = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {});

/** Hero contact links: icon buttons with tooltips (AI) or controller prompts (Game). */
export default function HeroLinks() {
  const { isRetro } = useMode();

  if (isRetro) {
    return (
      <ul className="hlinks hlinks--retro" aria-label="Links">
        {SOCIALS.map((s, i) => (
          <motion.li key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 + i * 0.06 }}>
            <a href={s.href} {...ext(s.href)} {...(s.download ? { download: true } : {})} className="hlink-r">
              <span className={`hlink-r__key hlink-r__key--${s.key}`} aria-hidden="true">
                {s.key}
              </span>
              <span className="hlink-r__label">{s.retro}</span>
              <span className="sr-only"> ({s.label})</span>
            </a>
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="hlinks" aria-label="Links">
      {SOCIALS.map((s, i) => (
        <motion.li key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.06 }}>
          <motion.a
            href={s.href}
            {...ext(s.href)}
            {...(s.download ? { download: true } : {})}
            className="hlink"
            aria-label={s.label}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
          >
            <Icon name={s.icon} size={19} />
            <span className="hlink__tip" role="tooltip">
              {s.label}
            </span>
          </motion.a>
        </motion.li>
      ))}
    </ul>
  );
}
