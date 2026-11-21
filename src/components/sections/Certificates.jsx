/**
 * Certificates section — real credentials (src/data/certificates.js).
 *   AI mode   → a credential archive: an editorial grid of original
 *               certificate thumbnails with calm technical rules.
 *   Game mode → an achievement wall: each certificate framed like an
 *               earned trophy, with a brass nameplate.
 * Both: hover lifts a card and reveals issuer + date; click expands the
 * card (shared layout) into an accessible detail view with the large
 * image, details, skills and a "Verify credential" link (new tab).
 * Thumbnails keep each certificate's own aspect ratio and use
 * object-fit: contain, so nothing is stretched or cropped.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { certificates } from '../../data/certificates.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Icon from '../ui/Icon.jsx';

const ease = [0.22, 1, 0.36, 1];

function Card({ c, i, retro, onOpen }) {
  return (
    <motion.li
      className={c.ratio === '500 / 652' ? 'is-tall' : undefined}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease }}
    >
      <button type="button" className={`cert ${retro ? 'is-retro' : ''}`} onClick={(e) => onOpen(c.id, e.currentTarget)} aria-label={`${c.title} — ${c.issuer}. Open details.`}>
        <motion.span layoutId={`cert-img-${c.id}`} className="cert__frame" style={{ aspectRatio: c.ratio }} transition={{ duration: 0.5, ease }}>
          <img src={c.image} alt="" loading="lazy" decoding="async" />
        </motion.span>
        <span className="cert__body">
          <span className="cert__issuer">{c.issuer}</span>
          <span className="cert__title">{c.title}</span>
          <span className="cert__meta">
            <span>{c.date}</span>
            {retro && <span className="cert__stamp">Earned</span>}
          </span>
        </span>
      </button>
    </motion.li>
  );
}

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
      <div className="certd__panel" role="dialog" aria-modal="true" aria-labelledby={`certd-${c.id}`} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <motion.div layoutId={`cert-img-${c.id}`} className="certd__image" style={{ aspectRatio: c.ratio }} transition={{ duration: 0.55, ease }}>
          <img src={c.image} alt={`Certificate: ${c.title}, issued by ${c.issuer}`} />
        </motion.div>
        <motion.div className="certd__info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4, ease } }}>
          <p className="certd__kicker">{c.kind}</p>
          <h3 id={`certd-${c.id}`}>{c.title}</h3>
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
          {c.note && <p className="certd__note">{c.note}</p>}
          <a className="certd__verify" href={c.url} target="_blank" rel="noreferrer">
            <Icon name="shield" size={16} /> Verify credential <Icon name="external" size={14} />
          </a>
        </motion.div>
        <button ref={closeRef} type="button" className="certd__close" onClick={onClose} aria-label="Close certificate">
          <Icon name="close" size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function Archive({ retro }) {
  const [openId, setOpenId] = useState(null);
  const returnFocus = useRef(null);
  const open = (id, el) => {
    returnFocus.current = el;
    setOpenId(id);
  };
  const close = () => {
    setOpenId(null);
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  };
  const sel = certificates.find((c) => c.id === openId);
  const years = [...new Set(certificates.map((c) => c.year))];

  return (
    <LayoutGroup id={`certs-${retro ? 'r' : 'a'}`}>
      <div className={`certs__wrap ${retro ? 'is-retro' : ''}`}>
        <p className="certs__summary">
          <strong>{certificates.length}</strong> {retro ? 'achievements earned' : 'verified credentials'} · {years[years.length - 1]}–{years[0]} · each links to its issuer
        </p>
        <ul className="certs__grid">
          {certificates.map((c, i) => (
            <Card key={c.id} c={c} i={i} retro={retro} onOpen={open} />
          ))}
        </ul>
      </div>
      {createPortal(<AnimatePresence>{sel && <Detail key={sel.id} c={sel} retro={retro} onClose={close} />}</AnimatePresence>, document.body)}
    </LayoutGroup>
  );
}

export default function Certificates() {
  const { isRetro } = useMode();
  return (
    <Chapter id="certificates" ghost="Credentials" retroGhost="TROPHIES" className="certs" labelledBy="certs-title">
      <div className="container">
        <SectionHeading
          id="certs-title"
          index="04"
          eyebrow="Credentials"
          retroEyebrow="ACHIEVEMENT HALL"
          title="Proof of continuous learning."
          retroTitle="Achievement wall"
          intro="Original certificates from HackerRank, Open Source Connect Global, Udemy, Meta and Google — open any one to verify it with the issuer."
          retroIntro="Every certificate is an achievement earned on the trail. Select one to inspect it and verify it with the issuer."
        />
        <Archive retro={isRetro} />
      </div>
    </Chapter>
  );
}
