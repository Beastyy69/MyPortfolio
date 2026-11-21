/**
 * Contact section (the final scene).
 * Oversized heading animated by scroll, contact tiles (availability + local
 * time, email with copy, GitHub, LinkedIn) and a message form.
 * Validation shows only after a field is touched. On submit it sends the
 * message straight to my inbox through FormSubmit (form → email), with the
 * visitor's address as reply‑to, then plays a "Signal received" animation.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { profile } from '../../data/profile.js';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';
import SignalField from '../effects/SignalField.jsx';

// form → email: messages are delivered to my inbox through FormSubmit's AJAX endpoint
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = [
  { name: 'name', label: 'Your name', retro: 'PLAYER NAME', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email address', retro: 'EMAIL', type: 'email', autoComplete: 'email' },
  { name: 'message', label: 'What should we build?', retro: 'MISSION BRIEF', type: 'textarea' },
];
const validators = {
  name: (v) => (v.trim() ? '' : 'Add your name so I know who’s calling.'),
  email: (v) => (EMAIL_RE.test(v) ? '' : 'That email doesn’t look quite right.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'A sentence or two helps — 10+ characters.'),
};

/* ───────── Giant scroll‑driven heading ───────── */
function BigHeading({ words }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 45%'] });
  return (
    <h2 className="finale__title" ref={ref} id="contact-title" aria-label={words.join(' ')}>
      {words.map((w, i) => (
        <Word key={w + i} word={w} i={i} n={words.length} progress={scrollYProgress} />
      ))}
    </h2>
  );
}
function Word({ word, i, n, progress }) {
  const start = (i / n) * 0.6;
  const y = useTransform(progress, [start, start + 0.4], ['70%', '0%']);
  const opacity = useTransform(progress, [start, start + 0.35], [0, 1]);
  const x = useTransform(progress, [0, 1], [i % 2 ? 60 : -60, 0]);
  return (
    <span className="finale__mask" aria-hidden="true">
      <motion.span className="finale__word" style={{ y, opacity, x }}>
        {word}
      </motion.span>
    </span>
  );
}

/* ───────── Contact modules ───────── */
function LocalTime() {
  const fmt = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return <span>{t} IST</span>;
}

function Modules() {
  const { isRetro } = useMode();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  const mod = (i) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="mods">
      <motion.div className="mod mod--status" {...mod(0)}>
        <span className="mod__k">{isRetro ? 'P2 SLOT' : 'Availability'}</span>
        <p className="mod__v">
          <i className="status-dot" /> {isRetro ? 'OPEN — JOIN NOW' : 'Open to work'}
        </p>
        <p className="mod__s">{profile.availability.ai}</p>
        <p className="mod__s">
          Local time · <LocalTime />
        </p>
      </motion.div>
      <motion.div className="mod mod--email" {...mod(1)}>
        <span className="mod__k">Email</span>
        <a className="mod__v mod__link" href={`mailto:${profile.email}`} data-cursor="Write">
          {profile.email}
        </a>
        <button type="button" className="mod__copy" onClick={copy}>
          <Icon name={copied ? 'check' : 'code'} size={14} /> {copied ? 'Copied!' : 'Copy address'}
        </button>
      </motion.div>
      <motion.a className="mod mod--link" href={profile.github} target="_blank" rel="noreferrer" data-cursor="Open" {...mod(2)}>
        <span className="mod__k">GitHub</span>
        <span className="mod__v">
          <Icon name="github" size={22} /> @Beastyy69
        </span>
        <Icon name="arrowRight" size={20} className="mod__arrow" />
      </motion.a>
      <motion.a className="mod mod--link" href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="Open" {...mod(3)}>
        <span className="mod__k">LinkedIn</span>
        <span className="mod__v">
          <Icon name="linkedin" size={22} /> Connect
        </span>
        <Icon name="arrowRight" size={20} className="mod__arrow" />
      </motion.a>
    </div>
  );
}

/* ───────── Console form ───────── */
function SignalReceived({ isRetro, onReset }) {
  return (
    <motion.div className="received" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
      <div className="received__rings" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }} />
        ))}
        <motion.span className="received__core" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
          <Icon name="check" size={34} strokeWidth={2.5} />
        </motion.span>
      </div>
      <h3>{isRetro ? 'SIGNAL RECEIVED · P2 JOINED' : 'Signal received.'}</h3>
      <p>Your message reached my inbox. I’ll reply to the email address you gave.</p>
      <button type="button" className="received__again" onClick={onReset}>
        {isRetro ? '▶ SEND ANOTHER' : 'Send another transmission'}
      </button>
    </motion.div>
  );
}

function Console() {
  const { isRetro } = useMode();
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const errors = Object.fromEntries(Object.entries(validators).map(([k, fn]) => [k, fn(values[k])]));
  const valid = !Object.values(errors).some(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!valid) {
      const first = Object.keys(errors).find((k) => errors[k]);
      e.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    if (e.currentTarget.elements._honey?.value) return; // bots fill the hidden field
    setSending(true);
    setFailed(false);
    try {
      // delivered to my inbox through FormSubmit (form → email); reply-to is the visitor
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          _replyto: values.email,
          _subject: `Portfolio message from ${values.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'send failed');
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="console" onSubmit={onSubmit} noValidate>
      <div className="console__head" aria-hidden="true">
        <span>{isRetro ? 'CO‑OP UPLINK // CH.02' : 'transmission.console'}</span>
        <span className="console__live">
          <i className="status-dot" /> {isRetro ? 'ONLINE' : 'channel open'}
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <SignalReceived
            key="sent"
            isRetro={isRetro}
            onReset={() => {
              setSent(false);
              setValues({ name: '', email: '', message: '' });
              setTouched({});
            }}
          />
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <div className="console__fields">
              {FIELDS.map((f) => {
                const id = `c-${f.name}`;
                const showErr = touched[f.name] && errors[f.name];
                const ok = touched[f.name] && !errors[f.name];
                const Field = f.type === 'textarea' ? 'textarea' : 'input';
                return (
                  <div key={f.name} className={`fld ${f.type === 'textarea' ? 'fld--full' : ''} ${values[f.name] ? 'has-value' : ''} ${showErr ? 'has-error' : ''} ${ok ? 'is-ok' : ''}`}>
                    <Field
                      id={id}
                      name={f.name}
                      type={f.type === 'textarea' ? undefined : f.type}
                      rows={f.type === 'textarea' ? 4 : undefined}
                      autoComplete={f.autoComplete}
                      placeholder=" "
                      value={values[f.name]}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                      onBlur={() => values[f.name] && setTouched((t) => ({ ...t, [f.name]: true }))}
                      aria-invalid={!!showErr}
                      aria-describedby={showErr ? `${id}-hint` : undefined}
                      required
                    />
                    <label htmlFor={id}>{isRetro ? f.retro : f.label}</label>
                    <span className="fld__line" aria-hidden="true" />
                    {ok && <Icon name="check" size={16} className="fld__ok" />}
                    <AnimatePresence>
                      {showErr && (
                        <motion.p id={`${id}-hint`} className="fld__hint" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          {errors[f.name]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {/* hidden from people, tempting to bots */}
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="console__honey" aria-hidden="true" />
            <div className="console__send">
              <Button type="submit" variant="giant" icon="send" cursor="Send" disabled={sending}>
                {sending ? 'Sending…' : 'Send transmission'}
              </Button>
              <p className="console__note" role={failed ? 'alert' : undefined}>
                {failed ? (
                  <>
                    Couldn’t send right now — please email <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </>
                ) : (
                  'Goes straight to my inbox · I reply by email'
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function Contact() {
  const { isRetro } = useMode();
  return (
    <section id="contact" className="section finale" aria-labelledby="contact-title">
      <SignalField />
      <div className="container">
        <p className="finale__eyebrow">
          {isRetro ? (
            <>
              <span className="pixel-tag">LV 08</span> FINAL TRANSMISSION TOWER · OPEN CHANNEL
            </>
          ) : (
            <>
              <span className="section-heading__index">({isRetro ? '07' : '06'})</span> Final transmission
            </>
          )}
        </p>
        <BigHeading words={isRetro ? ['Let’s', 'build', 'something', 'legendary.'] : ['Let’s', 'build', 'something', 'intelligent.']} />
        <div className="finale__grid">
          <Modules />
          <Console />
        </div>
      </div>
    </section>
  );
}
