/**
 * Profile panel opened by clicking a portrait.
 *   AI mode   → "About My Work": photo, roles, interests, links and CV.
 *   Game mode → "Player Profile": tabbed Bio / Skills / Achievements / Links.
 * The clicked photo morphs into the panel via a shared Framer Motion layoutId
 * (see ProfileContext). Escape closes it; focus is kept inside while open.
 * SOCIALS is also used by the hero links.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { profile } from '../../data/profile.js';
import { skillCategories } from '../../data/skills.js';
import { certificates } from '../../data/certificates.js';
import { startScroll, stopScroll } from '../../lib/smoothScroll.js';
import Icon from '../ui/Icon.jsx';
import PixelSprite from '../visuals/PixelSprite.jsx';

export const SOCIALS = [
  { id: 'github', href: profile.github, icon: 'github', label: 'GitHub', retro: 'GITHUB', key: 'A' },
  { id: 'linkedin', href: profile.linkedin, icon: 'linkedin', label: 'LinkedIn', retro: 'LINKEDIN', key: 'B' },
  { id: 'email', href: `mailto:${profile.email}`, icon: 'mail', label: 'Email', retro: 'EMAIL', key: 'X' },
  { id: 'cv', href: profile.resume, icon: 'download', label: 'Résumé / CV', retro: 'RÉSUMÉ', key: 'Y', download: true },
];
const ext = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {});

const BUILDING = 'An RL agent that learns to clear an original pixel platformer — plus production polish on MailMind AI.';

/* ───────── AI: Developer Desk ───────── */
const ROLES = [
  { title: 'AIML Developer', text: 'Training and evaluating models with PyTorch, TensorFlow and scikit‑learn.' },
  { title: 'Python Backend Developer', text: 'FastAPI, Django and Flask services that serve models and data.' },
  { title: 'Web Developer', text: 'React interfaces wired cleanly to the APIs behind them.' },
];
const INTERESTS = ['Applied machine learning', 'API & system design', 'Developer tooling', 'Game AI & classic games'];

function DeveloperDesk({ close, photoId }) {
  return (
    <div className="desk">
      <div className="desk__photo">
        <motion.img layoutId={photoId ?? undefined} src={profile.photo} alt={`Portrait of ${profile.name}`} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        <span className="desk__status">
          <i className="status-dot" /> Available
        </span>
      </div>
      <div className="desk__body">
        <p className="mono-label">About my work</p>
        <h2 id="profile-title">{profile.name}</h2>
        <p className="desk__intro">
          I build machine‑learning systems, the Python services that put them in front of users, and the web interfaces they're used through.
        </p>
        <ul className="desk__roles">
          {ROLES.map((r) => (
            <li key={r.title}>
              <strong>{r.title}</strong>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
        <div className="desk__cols">
          <section>
            <h3>Core interests</h3>
            <p>{INTERESTS.join(' · ')}</p>
          </section>
          <section>
            <h3>Based in</h3>
            <p>
              <Icon name="pin" size={14} /> {profile.location} · remote friendly
            </p>
          </section>
        </div>
        <div className="desk__links">
          {SOCIALS.filter((x) => x.id !== 'cv').map((s) => (
            <a key={s.id} href={s.href} {...ext(s.href)} className="desk__link" aria-label={s.label}>
              <Icon name={s.icon} size={18} /> {s.label}
            </a>
          ))}
          <a href={profile.resume} download className="btn btn--primary desk__cv">
            <Icon name="download" size={16} /> Download CV
          </a>
        </div>
      </div>
      <button type="button" className="modal__close" onClick={close} aria-label="Close profile">
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}

/* ───────── Retro: Player Profile with tabs ───────── */
const TABS = ['BIO', 'SKILLS', 'ACHIEVEMENTS', 'LINKS'];

function PlayerProfile({ close, photoId }) {
  const [tab, setTab] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (n) => {
    setDir(n > tab ? 1 : -1);
    setTab((n + TABS.length) % TABS.length);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(tab + 1);
    if (e.key === 'ArrowLeft') go(tab - 1);
  };

  return (
    <div className="pp" onKeyDown={onKey}>
      <div className="pp__head">
        <span className="pixel-tag">PLAYER PROFILE</span>
        <h2 id="profile-title">P1 · {profile.firstName.toUpperCase()}</h2>
        <button type="button" className="modal__close" onClick={close} aria-label="Close player profile">
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="pp__grid">
        <div className="pp__card">
          <div className="pp__portrait">
            <motion.div layoutId={photoId ?? undefined} className="pp__char" transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <img src={profile.gamePhoto} alt={`${profile.name}`} className="pp__photo" style={{ objectPosition: profile.gamePhotoPosition }} />
            </motion.div>
          </div>
          <dl className="pp__stats">
            <div>
              <dt>CLASS</dt>
              <dd>AI/ML + BACKEND</dd>
            </div>
            <div>
              <dt>MAIN</dt>
              <dd>PYTHON</dd>
            </div>
            <div>
              <dt>SPECIAL</dt>
              <dd>PROBLEM SOLVER</dd>
            </div>
          </dl>
          <div className="pp__xp">
            <span>LV 21</span>
            <i>
              <b />
            </i>
          </div>
        </div>

        <div className="pp__panel">
          <div className="pp__tabs" role="tablist" aria-label="Profile sections">
            <button type="button" className="pp__arrow" onClick={() => go(tab - 1)} aria-label="Previous tab">
              ◀
            </button>
            {TABS.map((t, i) => (
              <button key={t} type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'is-on' : ''} onClick={() => go(i)}>
                {t}
              </button>
            ))}
            <button type="button" className="pp__arrow" onClick={() => go(tab + 1)} aria-label="Next tab">
              ▶
            </button>
          </div>

          <div className="pp__view" role="tabpanel" aria-label={TABS[tab]}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={tab}
                custom={dir}
                initial={{ opacity: 0, x: dir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * 30 }}
                transition={{ duration: 0.18 }}
              >
                {tab === 0 && (
                  <div className="pp__bio">
                    <p>A backend engineer and ML builder who learned to code because classic games made him wonder how worlds work. Now he trains models and ships the Python services that serve them.</p>
                    <p className="pp__quest">CURRENT QUEST · {BUILDING}</p>
                    <p className="pp__loc">
                      <Icon name="pin" size={14} /> {profile.location}
                    </p>
                  </div>
                )}
                {tab === 1 && (
                  <ul className="pp__loadout">
                    {skillCategories.map((c) => (
                      <li key={c.id} className={`tone-${c.tone}`}>
                        <span className="pp__slot">{c.retroName}</span>
                        <span className="pp__items">{c.skills.map((s) => s.name).join(' · ')}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 2 && (
                  <ul className="pp__achs">
                    {certificates.map((c) => (
                      <li key={c.id}>
                        <PixelSprite name="trophy" size={3} />
                        <span>
                          {c.title}
                          <small>
                            {c.issuer} · {c.year}
                          </small>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 3 && (
                  <ul className="pp__menu">
                    {SOCIALS.map((s) => (
                      <li key={s.id}>
                        <a href={s.href} {...ext(s.href)} {...(s.download ? { download: true } : {})}>
                          <span className="pp__key">{s.key}</span>
                          {s.id === 'cv' ? 'DOWNLOAD LOADOUT (CV)' : s.retro}
                          <span className="pp__go">▶</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="pp__hint">◀ ▶ SWITCH TABS · ESC TO EXIT</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfileModal() {
  const { origin, isOpen, close, photoId } = useProfile();
  const { isRetro } = useMode();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    stopScroll();
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.querySelector('button, a')?.focus(), 60);
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = [...dialogRef.current.querySelectorAll('a, button')];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === f.at(-1)) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      startScroll();
    };
  }, [isOpen, close]);

  const at = origin ? `${origin.x}px ${origin.y}px` : '50% 50%';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal"
          onClick={close}
          initial={photoId ? { opacity: 0 } : { clipPath: `circle(0px at ${at})` }}
          animate={photoId ? { opacity: 1 } : { clipPath: `circle(150% at ${at})` }}
          exit={photoId ? { opacity: 0 } : { clipPath: `circle(0px at ${at})` }}
          transition={{ duration: photoId ? 0.25 : 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            ref={dialogRef}
            className={`modal__dialog ${isRetro ? 'modal__dialog--retro' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            onClick={(e) => e.stopPropagation()}
            initial={photoId ? { opacity: 1, y: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: photoId ? 0 : 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
          >
            {isRetro ? <PlayerProfile close={close} photoId={photoId} /> : <DeveloperDesk close={close} photoId={photoId} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
