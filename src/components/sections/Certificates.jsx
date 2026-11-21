/**
 * Certificates section.
 *   AI mode   → big counter + credential ledger rows with verify links.
 *   Game mode → trophy badges that unlock on scroll; "Inspect" flips a badge.
 * Data: src/data/certificates.js (demo entries — replace with your own).
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { certificates } from '../../data/certificates.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Counter from '../ui/Counter.jsx';
import Icon from '../ui/Icon.jsx';
import PixelSprite from '../visuals/PixelSprite.jsx';

const XP = { legendary: 1000, epic: 750, rare: 500 };
const linkOf = (c) => (c.credentialUrl && c.credentialUrl !== '#' ? c.credentialUrl : null);

/* ───────── AI: credential ledger ───────── */
function Ledger() {
  const verified = certificates.filter((c) => c.verified).length;
  return (
    <div className="ledger">
      <div className="ledger__aside">
        <p className="ledger__count">
          <Counter value={certificates.length} pad={2} />
        </p>
        <p className="ledger__caption">
          credentials on record
          <br />
          <span>
            <Icon name="shield" size={14} /> {verified} verified
          </span>
        </p>
      </div>
      <ol className="ledger__rows">
        {certificates.map((c, i) => {
          const href = linkOf(c);
          return (
            <motion.li
              key={c.id}
              className="lrow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <span className="lrow__year">{c.year}</span>
              <div className="lrow__main">
                <h3>{c.title}</h3>
                <p>
                  {c.issuer} · {c.skills.join(', ')}
                </p>
              </div>
              <span className={`lrow__badge ${c.verified ? '' : 'is-pending'}`}>{c.verified ? 'Verified' : 'In progress'}</span>
              <a
                className={`lrow__link ${href ? '' : 'is-disabled'}`}
                href={href ?? undefined}
                target={href ? '_blank' : undefined}
                rel="noreferrer"
                aria-disabled={!href}
                aria-label={`View credential: ${c.title}${href ? '' : ' (link coming soon)'}`}
                data-cursor={href ? 'Verify' : undefined}
              >
                <Icon name="arrowRight" size={18} />
              </a>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

/* ───────── Retro: achievement unlocks ───────── */
function Badge({ cert, index, unlocked }) {
  const [flipped, setFlipped] = useState(false);
  const href = linkOf(cert);
  return (
    <motion.li
      className={`ach tier-${cert.tier} ${unlocked ? 'is-unlocked' : ''}`}
      initial={false}
      animate={unlocked ? { filter: 'grayscale(0) brightness(1)', scale: [0.9, 1.06, 1] } : { filter: 'grayscale(1) brightness(0.5)', scale: 0.9 }}
      transition={{ delay: unlocked ? index * 0.18 : 0, duration: 0.45 }}
    >
      <div className={`ach__card ${flipped ? 'is-flipped' : ''}`}>
        <div className="ach__face ach__front">
          <span className="ach__xp">+{XP[cert.tier] ?? 250} XP</span>
          <span className="ach__trophy">
            <PixelSprite name="trophy" size={6} />
          </span>
          <h3>{cert.title}</h3>
          <p>
            {cert.issuer} · {cert.year}
          </p>
          <button type="button" className="ach__btn" onClick={() => setFlipped(true)} data-cursor="Inspect">
            INSPECT
          </button>
        </div>
        <div className="ach__face ach__back" aria-hidden={!flipped}>
          <p className="ach__label">{cert.verified ? 'UNLOCKED ✓' : 'IN PROGRESS'}</p>
          <ul>
            {cert.skills.map((s) => (
              <li key={s}>▸ {s}</li>
            ))}
          </ul>
          <div className="ach__back-actions">
            <a className={`ach__btn ${href ? '' : 'is-disabled'}`} href={href ?? undefined} target={href ? '_blank' : undefined} rel="noreferrer" aria-disabled={!href} tabIndex={flipped ? 0 : -1}>
              {href ? 'VIEW CREDENTIAL' : 'LINK SOON'}
            </a>
            <button type="button" className="ach__btn ach__btn--ghost" onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1}>
              BACK
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const toast = useToast();
  useEffect(() => {
    if (!inView) return undefined;
    const t = setTimeout(() => toast({ title: `${certificates.length} ACHIEVEMENTS UNLOCKED`, text: 'Inspect a trophy to see its loot.' }), certificates.length * 180 + 300);
    return () => clearTimeout(t);
  }, [inView, toast]);

  return (
    <ul className="achs" ref={ref}>
      {certificates.map((c, i) => (
        <Badge key={c.id} cert={c} index={i} unlocked={inView} />
      ))}
      <li className="ach ach--locked">
        <div className="ach__card">
          <div className="ach__face ach__front">
            <Icon name="lock" size={30} />
            <h3>??? LOCKED</h3>
            <p>Keep playing to unlock</p>
          </div>
        </div>
      </li>
    </ul>
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
          retroTitle="Achievement hall"
          retroIntro="Every certificate is a trophy. Inspect one to flip it and see the loot."
        />
        {isRetro ? <Achievements /> : <Ledger />}
      </div>
    </Chapter>
  );
}
