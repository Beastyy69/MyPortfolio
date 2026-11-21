// Projects. `art` picks a built‑in illustration; set `image` to use a screenshot instead.
// Replace demo links (#) with your real repo / demo URLs.
import mailmind from '../assets/mailmind.jpg';

export const projectFilters = [
  { id: 'all', label: 'All work', retro: 'ALL WORLDS' },
  { id: 'ai', label: 'AI / ML', retro: 'WORLD 1 · AI' },
  { id: 'backend', label: 'Backend', retro: 'WORLD 2 · API' },
  { id: 'data', label: 'Data', retro: 'WORLD 3 · DATA' },
  { id: 'games', label: 'Game AI', retro: 'WORLD 4 · ARCADE' },
];

// Game‑mode mission categories (a project can sit in several).
export const missionFilters = [
  { id: 'all', label: 'All missions' },
  { id: 'ai', label: 'AI' },
  { id: 'backend', label: 'Backend' },
  { id: 'data', label: 'Data' },
  { id: 'web', label: 'Web' },
  { id: 'arcade', label: 'Arcade' },
];

export const projects = [
  {
    id: 'recommendo',
    missionType: 'Recommendation systems',
    tags: ['ai', 'backend'],
    env: 'Signal Routing Station',
    challenge:
      'New items had no interaction history (cold start). The ranker blends content embeddings with collaborative signals, and Redis caches hot results so responses stay real-time.',
    status: 'complete',
    title: 'Recommendo',
    subtitle: 'AI Recommendation Engine',
    category: 'ai',
    level: '1-1',
    difficulty: 4,
    art: 'recommender',
    featured: true,
    summary:
      'Hybrid recommender that blends collaborative filtering with content embeddings to rank items in real time, served through a cached FastAPI endpoint.',
    metric: { value: '+32%', label: 'offline CTR uplift' },
    stack: ['Python', 'PyTorch', 'FastAPI', 'Redis', 'PostgreSQL'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
  {
    id: 'visionsight',
    missionType: 'Computer vision',
    tags: ['ai'],
    env: 'Observation Outpost',
    challenge:
      'Keeping detection fast enough for a live feed on a laptop CPU — a lighter fine‑tuned model, frame skipping and WebSocket streaming keep it smooth.',
    status: 'complete',
    title: 'VisionSight',
    subtitle: 'Real‑time Object Detection',
    category: 'ai',
    level: '1-2',
    difficulty: 4,
    art: 'detection',
    summary:
      'Fine‑tuned detection model that tracks people and vehicles from a live camera feed, streaming annotated frames to the browser over WebSockets.',
    metric: { value: '28 FPS', label: 'on a laptop CPU' },
    stack: ['PyTorch', 'OpenCV', 'FastAPI', 'WebSockets'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
  {
    id: 'atlas',
    missionType: 'API platform',
    tags: ['backend'],
    env: 'API Relay Tower',
    challenge:
      'Holding low latency under bursty traffic: async endpoints, Redis rate limiting and Celery workers for slow jobs, verified with load tests.',
    status: 'complete',
    title: 'Atlas API',
    subtitle: 'Scalable FastAPI Backend',
    category: 'backend',
    level: '2-1',
    difficulty: 5,
    art: 'api',
    summary:
      'Async FastAPI service with JWT auth, rate limiting, background workers and PostgreSQL — containerised and load‑tested for high‑traffic workloads.',
    metric: { value: '<80ms', label: 'p95 latency @ 2k rps' },
    stack: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
  {
    id: 'forecastly',
    missionType: 'Forecasting dashboard',
    tags: ['data', 'web'],
    env: 'Weather Observatory',
    challenge:
      'Making model output usable by non‑technical teams — feature importance and what‑if sliders turn raw predictions into decisions.',
    status: 'complete',
    title: 'Forecastly',
    subtitle: 'ML Prediction Dashboard',
    category: 'data',
    level: '3-1',
    difficulty: 3,
    art: 'dashboard',
    summary:
      'Interactive dashboard that forecasts sales and churn with gradient‑boosted models, with feature importance and what‑if sliders for non‑technical teams.',
    metric: { value: '0.91', label: 'R² on hold‑out data' },
    stack: ['Scikit-learn', 'Pandas', 'Flask', 'Plotly', 'SQL'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
  {
    id: 'pixelpilot',
    missionType: 'Reinforcement learning',
    tags: ['arcade', 'ai'],
    env: 'Prototype Workshop',
    challenge:
      'Learning from raw pixels with sparse rewards — reward shaping and frame stacking give the PPO agent enough signal to clear the stage.',
    status: 'in-progress',
    title: 'Pixel Pilot',
    subtitle: 'RL Agent for a Retro Platformer',
    category: 'games',
    level: '4-1',
    difficulty: 5,
    art: 'rl',
    summary:
      'An original pixel platformer built in Pygame plus a PPO agent that learns to clear it from raw frames — with a live reward graph and replay viewer.',
    metric: { value: '2.1M', label: 'steps to clear stage 1' },
    stack: ['Python', 'Pygame', 'PyTorch', 'Gymnasium'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
  {
    id: 'mailmind',
    missionType: 'Productivity AI',
    tags: ['ai', 'web'],
    env: 'Sorting Post',
    challenge:
      'Noisy inboxes and long threads — one flow sorts mail, summarizes threads and drafts context‑aware replies through the Gemini API.',
    status: 'complete',
    title: 'MailMind AI',
    subtitle: 'AI Inbox Organizer',
    category: 'ai',
    level: '1-3',
    difficulty: 3,
    image: mailmind,
    summary:
      'AI‑powered mail organizer that sorts the inbox, summarizes long threads and drafts context‑aware replies using the Gemini API.',
    metric: { value: '3‑in‑1', label: 'sort · summarize · reply' },
    stack: ['JavaScript', 'Gemini API', 'HTML', 'CSS'],
    github: 'https://github.com/Beastyy69',
    demo: '#',
  },
];
