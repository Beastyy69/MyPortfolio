import { useMode } from '../../context/ModeContext.jsx';
import { profile } from '../../data/profile.js';
import { navLinks } from '../../data/navigation.js';
import Icon from '../ui/Icon.jsx';

const socials = [
  { href: profile.github, icon: 'github', label: 'GitHub' },
  { href: profile.linkedin, icon: 'linkedin', label: 'LinkedIn' },
  { href: `mailto:${profile.email}`, icon: 'mail', label: 'Email' },
];

/** Minimal footer: name, a few useful actions, readable social links. */
export default function Footer() {
  const { isRetro, mode } = useMode();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__name">{isRetro ? 'Thanks for playing.' : profile.name}</p>
            <p className="footer__tag">{isRetro ? `${profile.name} — ${profile.role}` : profile.role}</p>
          </div>
          <div className="footer__actions">
            <a href="#contact" className="footer__action">
              Let’s connect <Icon name="arrowRight" size={16} />
            </a>
            <a href={profile.resume} className="footer__action" download>
              View résumé <Icon name="download" size={16} />
            </a>
            <a href="#home" className="footer__action">
              {isRetro ? 'Return to menu' : 'Back to top'} <Icon name="arrowUp" size={16} />
            </a>
          </div>
        </div>

        <div className="footer__rule" aria-hidden="true" />

        <div className="footer__bottom">
          <nav className="footer__links" aria-label="Footer">
            {navLinks[mode].map((l) => (
              <a key={l.id} href={`#${l.id}`}>
                {l.label}
              </a>
            ))}
          </nav>
          <ul className="footer__socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <Icon name={s.icon} size={16} /> {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="footer__copy">
          © {year} {profile.name}. Built with React &amp; Framer Motion.
        </p>
      </div>
    </footer>
  );
}
