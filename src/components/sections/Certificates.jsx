/**
 * Certificates section — real credentials (src/data/certificates.js).
 *
 * AI mode — "Evidence Archive": one selected certificate is the focal piece
 *   in a large, warm‑ivory preview (sharp, uncropped); its metadata and the
 *   Verify button slide in beside it. A structured archive rail groups the
 *   other credentials by topic (Python · C programming · Web development ·
 *   Community), joined by thin slate topic lines; newer credentials get
 *   larger entries. Selecting one reveals it with a calm wipe while the rail
 *   marker glides to it.
 *
 * Game mode — "Hall of Achievements": a handcrafted explorer's museum.
 *   Certificates hang as framed relics along one wall; the selected relic is
 *   the central display (glass reflection, plinth, nameplate). Left/right
 *   travel moves the camera along the wall; a shelf of plaques below shows
 *   progress. Torches flicker, banners sway, dust drifts, the back wall has
 *   slow parallax.
 *
 * Both open the same accessible detail view (large image, issuer, date,
 * credential ID, skills, Verify credential → new tab).
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { TOPICS, certificates } from '../../data/certificates.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Icon from '../ui/Icon.jsx';

const ease = [0.22, 1, 0.36, 1];

/* ───────── shared detail view ───────── */
function Detail({ c, retro, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div className={`certd ${retro ? 'is-retro' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} onClick={onClose}>
      <motion.div
        className="certd__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`certd-${c.id}`}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="certd__image" style={{ aspectRatio: c.ratio }}>
          <img src={c.image} alt={`Certificate: ${c.title}, issued by ${c.issuer}`} />
        </div>
        <div className="certd__info">
          <p className="certd__kicker">{c.kind}</p>
          <h3 id={`certd-${c.id}`}>{c.title}</h3>
          <Facts c={c} />
          {c.note && <p className="certd__note">{c.note}</p>}
          <Verify c={c} className="certd__verify" />
        </div>
        <button ref={closeRef} type="button" className="certd__close" onClick={onClose} aria-label="Close certificate">
          <Icon name="close" size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

function Facts({ c }) {
  return (
    <dl className="certd__facts">
      <div>
        <dt>Issuer</dt>
        <dd>
          {c.issuer}
          {c.instructor ? ` · ${c.instructor}` : ''}
        </dd>
      </div>
      <div>
        <dt>Issued</dt>
        <dd>{c.date}</dd>
      </div>
      {c.credentialId && (
        <div>
          <dt>Credential ID</dt>
          <dd className="certd__id">{c.credentialId}</dd>
        </div>
      )}
      <div>
        <dt>Skills</dt>
        <dd>
          <ul className="certd__skills">
            {c.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}

function Verify({ c, className }) {
  return (
    <a className={className} href={c.url} target="_blank" rel="noreferrer">
      <Icon name="shield" size={16} /> Verify credential <Icon name="external" size={14} />
    </a>
  );
}

/* ───────── AI: Evidence Archive ───────── */
function EvidenceArchive({ onInspect }) {
  const [selId, setSelId] = useState(certificates[0].id);
  const sel = certificates.find((c) => c.id === selId);
  const topicOf = (id) => TOPICS.find((t) => t.id === id);

  return (
    <div className="ev">
      <div className="ev__stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure key={sel.id} className="ev__preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <motion.button
              type="button"
              className="ev__mat"
              onClick={() => onInspect(sel.id)}
              aria-label={`View ${sel.title} full size`}
              data-cursor="Inspect"
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <img src={sel.image} alt={`Certificate: ${sel.title}, issued by ${sel.issuer}`} style={{ aspectRatio: sel.ratio }} />
            </motion.button>
            <figcaption className="ev__meta">
              <motion.p className="ev__topic" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.45, ease }}>
                <i /> {topicOf(sel.topic).label} · {sel.kind}
              </motion.p>
              <motion.h3 initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32, duration: 0.45, ease }}>
                {sel.title}
              </motion.h3>
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.45, ease }}>
                <Facts c={sel} />
                {sel.note && <p className="ev__note">{sel.note}</p>}
              </motion.div>
              <motion.div className="ev__actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4, ease }}>
                <Verify c={sel} className="ev__verify" />
                <button type="button" className="ev__full" onClick={() => onInspect(sel.id)}>
                  View full size
                </button>
              </motion.div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* the archive: credentials grouped by topic, joined by thin topic lines */}
      <nav className="ev__rail" aria-label="Credential archive">
        {TOPICS.map((t) => {
          const items = certificates.filter((c) => c.topic === t.id);
          return (
            <section key={t.id} className="ev__group">
              <h4 className="ev__group-label">
                {t.label} <span>{items.length}</span>
              </h4>
              <ul>
                {items.map((c) => {
                  const on = c.id === sel.id;
                  return (
                    <li key={c.id} className={c.year >= 2026 ? 'is-recent' : ''}>
                      <button type="button" className={`ev__item ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setSelId(c.id)}>
                        {on && <motion.span layoutId="ev-marker" className="ev__marker" transition={{ type: 'spring', stiffness: 320, damping: 32 }} />}
                        <span className="ev__thumb">
                          <img src={c.image} alt="" loading="lazy" decoding="async" />
                        </span>
                        <span className="ev__item-text">
                          <b>{c.title}</b>
                          <span>
                            {c.issuer} · {c.date}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
    </div>
  );
}

/* ───────── Game: Hall of Achievements ───────── */
const DUST = Array.from({ length: 14 }, (_, i) => ({ x: (i * 37) % 100, y: 20 + ((i * 53) % 60), d: 9 + (i % 5) * 2, delay: i * 0.7 }));

function Torch({ side, live }) {
  return (
    <svg className={`hall__torch hall__torch--${side}`} viewBox="0 0 40 120" aria-hidden="true">
      {/* warm light pool on the wall (muted, no glow) */}
      <motion.ellipse cx="20" cy="34" rx="34" ry="40" fill="#d2c29f" initial={{ opacity: 0.1 }} animate={live ? { opacity: [0.08, 0.14, 0.09, 0.13, 0.08] } : undefined} transition={{ duration: 2.4, repeat: Infinity }} />
      <path d="M14 56 h12 l-3 50 h-6 Z" fill="#5a4029" stroke="#2a1f17" strokeWidth="2" />
      <path d="M10 52 h20 v6 h-20 Z" fill="#b8955a" stroke="#2a1f17" strokeWidth="2" />
      {/* invisible circle centred on the wick, so the flame flickers from its base */}
      <motion.g animate={live ? { scaleY: [1, 1.15, 0.92, 1.08, 1], scaleX: [1, 0.92, 1.05, 0.96, 1] } : undefined} transition={{ duration: 1.1, repeat: Infinity }}>
        <circle cx="20" cy="52" r="32" fill="none" stroke="none" />
        <path d="M20 52 C10 44 14 32 20 22 C26 32 30 44 20 52 Z" fill="#b39356" stroke="#2a1f17" strokeWidth="1.6" />
        <path d="M20 50 C16 45 17 38 20 33 C23 38 24 45 20 50 Z" fill="#8a3d33" />
      </motion.g>
    </svg>
  );
}

function Banner({ side, live }) {
  const a = 'M0 0 H44 V64 L22 52 L0 64 Z';
  const b = 'M0 0 H44 V66 L24 54 L2 62 Z';
  return (
    <svg className={`hall__banner hall__banner--${side}`} viewBox="-4 -8 52 80" aria-hidden="true">
      <path d="M-4 -4 H48" stroke="#2a1f17" strokeWidth="3" />
      <motion.path d={a} fill={side === 'l' ? '#8a3d33' : '#5d6b3f'} stroke="#2a1f17" strokeWidth="2" animate={live ? { d: [a, b, a] } : undefined} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
      <path d="M22 18 l6 10 h-12 Z" fill="#e9dcc0" stroke="#2a1f17" strokeWidth="1.4" />
    </svg>
  );
}

function HallOfAchievements({ onInspect }) {
  const { reduceMotion } = useMode();
  const live = !reduceMotion;
  const [idx, setIdx] = useState(0);
  const n = certificates.length;
  const galleryRef = useRef(null);
  const [gw, setGw] = useState(1000);
  useEffect(() => {
    const el = galleryRef.current;
    const ro = new ResizeObserver(([e]) => setGw(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const slot = Math.max(230, Math.min(440, gw * 0.4));
  const go = (i) => setIdx((i + n) % n);
  const sel = certificates[idx];

  return (
    <div
      className="hall"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(idx + 1);
        if (e.key === 'ArrowLeft') go(idx - 1);
      }}
    >
      <div className="hall__room" aria-hidden="true">
        {/* back wall: slow parallax with the selected display */}
        <motion.div className="hall__wall" animate={{ x: `${-idx * 1.2}%` }} transition={{ duration: 0.9, ease }} />
        <div className="hall__floor" />
        <Banner side="l" live={live} />
        <Banner side="r" live={live} />
        <Torch side="l" live={live} />
        <Torch side="r" live={live} />
        {live &&
          DUST.map((p, i) => (
            <motion.i
              key={i}
              className="hall__dust"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{ y: [0, -40, -70], x: [0, 8, -4], opacity: [0, 0.6, 0] }}
              transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      {/* the gallery: framed relics along the wall; the camera centres the selected one */}
      <div className="hall__gallery" ref={galleryRef} style={{ '--slot': `${slot}px` }}>
        <motion.ul className="hall__track" initial={false} animate={{ x: gw / 2 - idx * slot - slot / 2 }} transition={{ duration: reduceMotion ? 0 : 0.85, ease }}>
          {certificates.map((c, i) => {
            const on = i === idx;
            const dist = Math.abs(i - idx);
            return (
              <motion.li key={c.id} className={`hall__slot ${on ? 'is-on' : ''}`} animate={{ scale: on ? 1 : 0.78, opacity: dist > 2 ? 0 : on ? 1 : 0.55, y: on ? 0 : 26 }} transition={{ duration: 0.7, ease }}>
                <button type="button" className="relic" onClick={() => (on ? onInspect(c.id) : go(i))} aria-label={on ? `Inspect ${c.title}` : `Go to ${c.title}`} tabIndex={dist > 1 ? -1 : 0}>
                  <span className="relic__frame">
                    <span className="relic__mat">
                      <img src={c.image} alt="" loading="lazy" decoding="async" />
                      {/* display‑case reflection: a slow sweep across the glass */}
                      {on && live && <motion.i className="relic__glare" initial={{ x: '-120%' }} animate={{ x: ['-120%', '220%'] }} transition={{ duration: 3.2, delay: 0.6, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }} />}
                    </span>
                  </span>
                  <span className="relic__plinth" />
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
        <button type="button" className="hall__nav hall__nav--prev" onClick={() => go(idx - 1)} aria-label="Previous achievement">
          <Icon name="arrowRight" size={20} />
        </button>
        <button type="button" className="hall__nav hall__nav--next" onClick={() => go(idx + 1)} aria-label="Next achievement">
          <Icon name="arrowRight" size={20} />
        </button>
      </div>

      {/* nameplate for the selected relic */}
      <AnimatePresence mode="wait">
        <motion.div key={sel.id} className="hall__plate" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} aria-live="polite">
          <p className="hall__kicker">
            Achievement {String(idx + 1).padStart(2, '0')} of {String(n).padStart(2, '0')} · {sel.issuer} · {sel.date}
          </p>
          <h3>{sel.title}</h3>
          <div className="hall__actions">
            <button type="button" className="hall__inspect" onClick={() => onInspect(sel.id)}>
              <Icon name="arrowUp" size={15} /> Inspect relic
            </button>
            <Verify c={sel} className="hall__verify" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* the shelf: one plaque per achievement, showing progress */}
      <ol className="hall__shelf" aria-label="All achievements">
        {certificates.map((c, i) => (
          <li key={c.id}>
            <button type="button" className={`plaque ${i === idx ? 'is-on' : ''} ${i < idx ? 'is-seen' : ''}`} onClick={() => go(i)} aria-current={i === idx ? 'true' : undefined} aria-label={`${c.title} — ${c.issuer}`}>
              <span className="plaque__gem" aria-hidden="true" />
              <span className="plaque__text">{c.issuer.split(' · ')[0]}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Certificates() {
  const { isRetro } = useMode();
  const [openId, setOpenId] = useState(null);
  const sel = certificates.find((c) => c.id === openId);
  return (
    <Chapter id="certificates" ghost="Credentials" retroGhost="TROPHIES" className="certs" labelledBy="certs-title">
      <div className="container">
        <SectionHeading
          id="certs-title"
          index="04"
          eyebrow="Credentials"
          retroEyebrow="HALL OF ACHIEVEMENTS"
          title="Proof of continuous learning."
          retroTitle="Hall of achievements"
          intro="Original certificates from HackerRank, Open Source Connect Global, Udemy, Meta and Google — each one verifiable with its issuer."
          retroIntro="Walk the hall: every relic is a certificate earned on the trail. Inspect one to read it in full and verify it with the issuer."
        />
        {isRetro ? <HallOfAchievements onInspect={setOpenId} /> : <EvidenceArchive onInspect={setOpenId} />}
      </div>
      {createPortal(<AnimatePresence>{sel && <Detail key={sel.id} c={sel} retro={isRetro} onClose={() => setOpenId(null)} />}</AnimatePresence>, document.body)}
    </Chapter>
  );
}
