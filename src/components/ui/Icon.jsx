// Small inline icon set (stroke icons, 24×24). Brand marks are simplified outlines.
const paths = {
  github: (
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  external: (
    <>
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 21h16" />,
  check: <path d="M20 6 9 17l-5-5" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  brain: (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.1A3 3 0 0 0 4.6 9 3 3 0 0 0 4 14.5 3 3 0 0 0 7 19.5 2.5 2.5 0 0 0 12 20V4.5A2.5 2.5 0 0 0 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v.1A3 3 0 0 1 19.4 9a3 3 0 0 1 .6 5.5 3 3 0 0 1-3 5A2.5 2.5 0 0 1 12 20" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="3" width="18" height="7" rx="1.5" />
      <rect x="3" y="14" width="18" height="7" rx="1.5" />
      <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  cloud: <path d="M17.5 19H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.6 11 4 4 0 0 1 17.5 19z" />,
  puzzle: (
    <path d="M10 3h4v2.5a1.5 1.5 0 1 0 3 0V3h4v7h-2.5a1.5 1.5 0 1 0 0 3H21v8h-7v-2.5a1.5 1.5 0 1 0-3 0V21H3v-7h2.5a1.5 1.5 0 1 0 0-3H3V3z" />
  ),
  gamepad: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="6" />
      <path d="M7 10v4M5 12h4M15.5 11h.01M18 13h.01" />
    </>
  ),
  terminal: (
    <>
      <path d="m4 17 6-5-6-5M12 19h8" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  play: <path d="M7 4v16l13-8L7 4z" />,
  code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  star: <path d="m12 2 3 6.5 7 .8-5.2 4.8L18.2 21 12 17.3 5.8 21l1.4-6.9L2 9.3l7-.8L12 2z" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
