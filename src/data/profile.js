// ─────────────────────────────────────────────────────────────
// Personal details. Edit this file to update your info site‑wide.
// ─────────────────────────────────────────────────────────────
import photo from '../assets/profile.jpg';
import gamePhoto from '../assets/profile-game.webp';

export const profile = {
  name: 'Harshit Shaw',
  firstName: 'Harshit',
  initials: 'HS',
  role: 'AIML Developer & Python Backend Engineer',
  tagline: 'Building intelligent systems by day. Always chasing the next high score.',
  location: 'West Bengal, India',
  email: 'mohitshaw236@gmail.com',
  github: 'https://github.com/Beastyy69',
  // TODO: replace with your real LinkedIn profile URL
  linkedin: 'https://www.linkedin.com/',
  resume: '/Harshit_Shaw_Resume.pdf',
  photo,
  // Second photo used in Game mode (cartridge cover, player profile).
  gamePhoto,
  gamePhotoPosition: '30% 42%',
  // Where your face sits inside the photo — keeps crops centred on you.
  photoPosition: '46% 18%',
  availability: {
    open: true,
    ai: 'Open to internships, freelance & full‑time roles',
    retro: 'PLAYER 2 SLOT OPEN',
  },
  roles: [
    { id: 'aiml', label: 'AIML Developer', icon: 'brain', stat: 'INT', value: 92 },
    { id: 'backend', label: 'Python Backend Developer', icon: 'server', stat: 'DEF', value: 88 },
    { id: 'solver', label: 'Problem Solver', icon: 'puzzle', stat: 'WIS', value: 90 },
    { id: 'gamer', label: 'Retro Gamer', icon: 'gamepad', stat: 'DEX', value: 99 },
  ],
  stats: [
    { value: 3, suffix: '+', label: 'Years coding', retro: 'YEARS' },
    { value: 15, suffix: '+', label: 'Technologies', retro: 'POWER‑UPS' },
    { value: 10, suffix: '+', label: 'Projects built', retro: 'STAGES' },
    { value: 99, suffix: '', label: 'Continues left', retro: 'CONTINUES' },
  ],
  story: [
    {
      title: 'Player one, since day one',
      retroTitle: 'ORIGIN STORY',
      text: 'I grew up on classic games — the kind with tight controls, brutal difficulty and a high‑score table that never forgot you. Wondering how those worlds actually worked is what pulled me into code.',
    },
    {
      title: 'From scripts to models',
      retroTitle: 'SKILL UNLOCK',
      text: 'Python started as a way to automate things and quickly became my main language. NumPy, Pandas and scikit‑learn led to deep learning with TensorFlow and PyTorch — training models, cleaning data and learning to read the loss curve.',
    },
    {
      title: 'Shipping the backend',
      retroTitle: 'BOSS FIGHT',
      text: 'A model is only useful when people can reach it. I build FastAPI, Flask and Django services that serve ML in production — clean APIs, solid databases and Docker‑ready deployments.',
    },
  ],
};
