/* ─────────────────────────────────────────────────────────────
   Projects — every entry is a real repository. GitHub is the source of
   truth: summaries, features and stacks below come only from each repo's
   README, description and language data (checked 2026‑11‑21). Nothing
   here is invented; for full details every project links to its repo.

   Fields
     repo        "owner/name" — used for the GitHub link and live star count
     role        'Creator' or 'Contributor' (verified from commit history)
     live        only when the repository itself lists a homepage
     stars       snapshot verified on the date above; the UI fetches the
                 live count from GitHub and falls back to this
     place       Game Mode location on the Code Frontier map
   ───────────────────────────────────────────────────────────── */

const gh = (repo) => `https://github.com/${repo}`;

export const projects = [
  {
    id: 'hologram',
    featured: true,
    title: 'Hologram With AI',
    repo: 'Beastyy69/Hologram-With-AI',
    role: 'Creator',
    category: 'Computer Vision · HCI',
    tagline: 'Touchless, gesture‑controlled AR and mouse control from a webcam.',
    summary:
      'A real‑time hand‑gesture interaction system built with OpenCV and MediaPipe. Using only a webcam, you can manipulate 3D AR shapes, control the mouse pointer, clicks and drag, and draw in the air — with Kalman‑filter smoothing for stable tracking.',
    highlights: [
      '3D AR object mode — rotate, scale and move shapes with gestures',
      'Touchless mouse — pinch to click, fist to drag',
      'Air drawing with the index finger in multiple colours',
      'Optional AI voice shapes via Gemini (disabled in the public version)',
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'Kalman filter', 'PyAutoGUI', 'pynput', 'Gemini API (optional)'],
    stars: 7,
    forks: 12,
    place: 'The Observatory',
    placeNote: 'Flagship mission',
  },
  {
    id: 'mailmind',
    title: 'Mail Mind Pro',
    repo: 'Beastyy69/Mail-Mind-Pro',
    role: 'Creator',
    category: 'AI Productivity',
    tagline: 'AI email intelligence for Gmail, powered by Gemini.',
    summary:
      'An AI‑powered email manager for Gmail: it classifies emails by intent, detects urgency and sentiment, writes short summaries and suggests context‑aware replies using Google Gemini — with secure Gmail OAuth2 and in‑browser processing.',
    highlights: ['Intent classification and urgency detection', 'AI summaries and smart reply suggestions', 'Dashboard with filters by urgency, intent and status'],
    stack: ['JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Gemini API', 'Gmail API', 'OAuth2'],
    live: 'https://mailmind-rkj5.onrender.com',
    place: 'Message Relay Station',
  },
  {
    id: 'rugradar',
    title: 'RugRadar',
    repo: 'Beastyy69/RugRadar',
    role: 'Creator',
    category: 'Security · Full‑stack',
    tagline: 'A full‑stack crypto‑address risk scanner.',
    summary:
      'Scan a crypto address and review its risk report and history. A React client talks to an Express API with MongoDB‑backed scan history, and a FastAPI service assembles the risk assessment from blockchain and security data sources.',
    highlights: ['Address risk reports and scan history', 'Three services: React client, Express API, FastAPI scoring', 'Returns risk signals — not financial advice'],
    stack: ['React', 'Vite', 'Express', 'MongoDB', 'FastAPI', 'Python'],
    place: 'Tracking Outpost',
  },
  {
    id: 'roastme',
    title: 'RoastMe AI',
    repo: 'Beastyy69/RoastMe',
    role: 'Creator',
    category: 'ML · Generative AI',
    tagline: 'Safe, personalised roasts from your bio and habits.',
    summary:
      'An AI humour app with a React website and an Expo Android app on one FastAPI backend. A TF‑IDF + Logistic Regression classifier predicts the topic; the jokes come from NVIDIA Nemotron or Gemini, with local templates as a fallback. Includes an NPC Meter quiz and a Camera Roast with AR filters.',
    highlights: ['Real scikit‑learn topic classifier', 'Multi‑provider LLM generation with template fallback', 'NPC Meter quiz and Camera Roast with MediaPipe filters'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Expo', 'React Native', 'FastAPI', 'scikit‑learn', 'MediaPipe', 'MongoDB'],
    live: 'https://roast-me-nu-khaki.vercel.app',
    place: 'Creative Camp',
  },
  {
    id: 'cinesense',
    title: 'Movie Recommendation',
    alias: 'CineSense',
    repo: 'Beastyy69/MovieRecomendation',
    role: 'Creator',
    category: 'Recommendation Systems',
    tagline: 'CineSense — local TF‑IDF movie recommendations.',
    summary:
      'CineSense recommends movies with local TF‑IDF similarity, remembers likes and watched titles in SQLite, and can explain picks with an optional local Gemma model through Ollama. A React frontend talks to a FastAPI backend; TMDB adds posters and trailers when configured.',
    highlights: ['TF‑IDF content‑based recommendations', 'Watched titles are excluded from future picks', 'Optional local Gemma explanations — no cloud AI key needed'],
    stack: ['Python', 'FastAPI', 'TF‑IDF', 'SQLite', 'React', 'Ollama · Gemma', 'Docker'],
    place: 'Cinema Archive',
  },
  {
    id: 'discordbot',
    title: 'MultiDiscord Bot',
    repo: 'Beastyy69/MultiDiscord-Bot',
    role: 'Creator',
    category: 'Community Automation',
    tagline: 'A multi‑purpose Discord bot for active, well‑run servers.',
    summary:
      'A multi‑purpose Discord bot built with Node.js and Discord.js: music playback, moderation tools, reaction‑based giveaways, chatbot replies, welcome images and lightweight SQLite storage, with a small web server for free hosting platforms.',
    highlights: ['Music, moderation and giveaways', 'Chatbot replies and welcome image cards', 'SQLite storage; runs on Replit, Railway or Render'],
    stack: ['JavaScript', 'Node.js', 'Discord.js', 'SQLite'],
    place: 'Communications Hub',
  },
  {
    id: 'scheduler',
    title: 'Scheduler AI',
    repo: 'joydeep-devx/scheduler.ai',
    role: 'Contributor',
    roleNote: 'Contributor — face registration and face recognition',
    category: 'AI · Smart Campus',
    tagline: 'AI‑powered smart classroom management.',
    summary:
      'A team project that automates student attendance with face recognition and manages timetables, classroom occupancy and resources from central dashboards. Owned by joydeep‑devx; my commits cover face registration, face recognition and backend changes.',
    highlights: ['Face‑recognition attendance', 'AI timetable generation and occupancy tracking', 'Dashboards for admins and faculty'],
    stack: ['React', 'Node.js', 'Python', 'Face recognition'],
    place: 'Planning Tower',
  },
];

export const githubUrl = (p) => gh(p.repo);
export const featuredProject = projects.find((p) => p.featured);
