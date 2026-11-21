import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { navLinks } from '../../data/navigation.js';
import { profile } from '../../data/profile.js';
import useActiveSection from '../../hooks/useActiveSection.js';
import ModeToggle from './ModeToggle.jsx';
import MusicToggle from './MusicToggle.jsx';
import Icon from '../ui/Icon.jsx';
import { startScroll, stopScroll } from '../../lib/smoothScroll.js';

/** Full‑width bar at the top; collapses into a floating control panel on scroll. */
export default function Navbar() {
  const { mode, isRetro, booted } = useMode();
  const links = navLinks[mode];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(links.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    stopScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      startScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--float' : ''}`}
      initial={{ y: -90, opacity: 0 }}
      animate={booted ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav__panel">
        <a href="#home" className="nav__brand" aria-label={`${profile.name} — back to top`} data-cursor="Top">
          <span className="nav__logo" aria-hidden="true">
            {profile.initials}
          </span>
          <span className="nav__brand-text">{isRetro ? 'P1 · HARSHIT' : profile.name}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={`nav__link ${active === l.id ? 'is-active' : ''}`} aria-current={active === l.id ? 'true' : undefined}>
              {active === l.id && <motion.span layoutId={`nav-pill-${mode}`} className="nav__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span>
                {isRetro && active === l.id ? '▶ ' : ''}
                {l.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <MusicToggle />
          <div className="nav__toggle nav__toggle--full">
            <ModeToggle />
          </div>
          <div className="nav__toggle nav__toggle--compact">
            <ModeToggle compact />
          </div>
          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="nav__mobile"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <span className="nav__mobile-idx">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
