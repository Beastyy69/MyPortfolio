/* ─────────────────────────────────────────────────────────────
   Projects — real repositories only. GitHub is the source of truth.

   Verified on 2026‑11‑21 by reading each repository's SOURCE CODE, not
   just its README: dependency files (package.json / requirements.txt),
   the main modules, API routes and commit history. Where a README and
   the code disagree, the code wins. Nothing here is invented.

   Fields
     repo      "owner/name" — GitHub link and live star count
     role      'Owner' (my repository) or 'Contributor' (verified commits)
     roleNote  what my contribution was, when I'm a contributor
     live      only when the repository lists a homepage AND it responds
     stars     verified snapshot; the UI fetches the live count and falls
               back to this
     place     Game Mode location — chosen to match what the project does
   ───────────────────────────────────────────────────────────── */

const gh = (repo) => `https://github.com/${repo}`;

export const projects = [
  {
    id: 'hologram',
    featured: true,
    title: 'Hologram With AI',
    repo: 'Beastyy69/Hologram-With-AI',
    role: 'Owner',
    category: 'Computer Vision · Human‑Computer Interaction',
    tagline: 'Control 3D holograms, your mouse and a drawing canvas with bare hands.',
    // verified in hand.py (≈1,900 lines, build "v7 — curriculum 3D models")
    summary:
      'A real‑time, webcam‑based gesture interface. MediaPipe tracks up to two hands, a Kalman filter smooths the motion, and OpenCV renders rotating 3D wireframe models you can grab, scale and spin. The same hand tracking drives a touchless mouse and an air‑drawing canvas, and an optional Gemini mode turns spoken or typed requests into 3D shapes.',
    features: [
      'Five modes on keys 1–5: 3D shapes, touchless mouse, air drawing, AI shapes, 3D models',
      '23 built‑in 3D models — DNA helix, benzene, NaCl lattice, Bohr atom, sin/cos waves, prism…',
      'Two open hands rotate and scale; index pinch = left click, middle pinch = right click, both = double‑click',
      'Kalman‑filter smoothing for a stable cursor and steady AR objects',
      'Optional Gemini + speech recognition: say or type a shape and it is built in 3D',
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'Kalman filter', 'pynput', 'PyAutoGUI', 'SpeechRecognition', 'Gemini API (optional)'],
    stars: 7,
    forks: 12,
    place: 'Hologram Observatory',
  },
  {
    id: 'mailmind',
    title: 'Mail Mind Pro',
    repo: 'Beastyy69/Mail-Mind-Pro',
    role: 'Owner',
    category: 'AI Productivity · Web App',
    tagline: 'Gemini reads your Gmail inbox and tells you what matters.',
    // verified in js/auth.js, js/gmail.js, js/ai-processor.js, js/app.js
    summary:
      'A browser app that signs in with Google, loads the latest 50 inbox emails through the Gmail API, and sends each one to Gemini 2.5 Flash. Gemini returns a summary, the email’s intent, urgency and sentiment, plus ready‑to‑use reply suggestions — all shown on one dashboard.',
    features: [
      'Google sign‑in (OAuth) with Gmail read access',
      'Per‑email AI analysis: summary, intent, urgency, sentiment, suggested replies',
      'Process one email or the whole inbox in batches',
      'Filter, search and export results to CSV; processed emails cached in the browser',
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Gmail API', 'Google OAuth', 'Gemini 2.5 Flash'],
    live: 'https://mailmind-rkj5.onrender.com',
    place: 'Inbox Relay Station',
  },
  {
    id: 'rugradar',
    title: 'RugRadar',
    repo: 'Beastyy69/RugRadar',
    role: 'Owner',
    category: 'Web3 Security · Full‑stack',
    tagline: 'Paste a crypto address, get a transparent risk report.',
    // verified in ml-service/app (scorer.py, chain_detect.py, *_client.py), client/, server/
    summary:
      'A full‑stack crypto‑address risk scanner. It auto‑detects the chain, gathers security data from public sources, and scores the address with a transparent, rule‑based scorer (0–100, low / medium / high) where every point is explained as a finding. Scans are saved to a MongoDB history.',
    features: [
      'Auto chain detection: Ethereum, BSC, Polygon, Base and Arbitrum; Bitcoin and Litecoin addresses too',
      'Data from GoPlus Security, Chainabuse, OFAC lists, ScamSniffer, MEW darklist, Blockscout and Etherscan',
      'Rule‑based score with a written finding behind every point',
      'React report UI, Express API with MongoDB scan history, FastAPI scoring service',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Express', 'MongoDB', 'FastAPI', 'Python'],
    place: 'Risk Radar Outpost',
  },
  {
    id: 'roastme',
    title: 'RoastMe AI',
    repo: 'Beastyy69/RoastMe',
    role: 'Owner',
    category: 'Machine Learning · Generative AI',
    tagline: 'Safe, personalised roasts — on the web and on Android.',
    // verified in backend/app (classifier.py, ai_provider.py, routes), web/, mobile/
    summary:
      'A comedy app with a React website and an Expo Android app on one FastAPI backend. A scikit‑learn classifier (TF‑IDF + Logistic Regression) predicts the topic of your bio; NVIDIA Nemotron or Gemini writes the roast under strict safety rules, with hand‑written templates when no AI is available.',
    features: [
      'Real ML: TF‑IDF + Logistic Regression topic classifier with a confidence fallback',
      'NVIDIA Nemotron first, Gemini as backup, local templates as a last resort',
      'NPC Meter: a fresh AI quiz scored on the server, then a roast of your answers',
      'Camera Roast with live AR filters (MediaPipe on web, ML Kit on Android)',
    ],
    stack: ['FastAPI', 'scikit‑learn', 'React', 'Vite', 'Tailwind CSS', 'Expo', 'React Native', 'MediaPipe', 'Gemini API', 'NVIDIA NIM', 'MongoDB (optional)'],
    live: 'https://roast-me-nu-khaki.vercel.app',
    place: 'Roast Campfire',
  },
  {
    id: 'cinesense',
    title: 'Movie Recommendation',
    alias: 'CineSense',
    repo: 'Beastyy69/MovieRecomendation',
    role: 'Owner',
    category: 'Recommendation Systems · Full‑stack',
    tagline: 'Content‑based movie discovery that learns what you like.',
    // verified in main.py (TF‑IDF matrix, cosine_similarity, sqlite3, /assistant/chat) and frontend/
    summary:
      'CineSense recommends films from a ~45,000‑movie metadata catalogue using TF‑IDF and cosine similarity, blended with genre overlap and your likes and dislikes. Preferences are stored in SQLite, watched titles drop out of future picks, and an optional Gemini assistant turns plain‑language requests into genre and mood filters.',
    features: [
      'TF‑IDF + cosine‑similarity recommendations over ~45,000 films',
      'Likes and dislikes re‑rank results; watched titles are excluded',
      'Natural‑language search with an optional Gemini assistant (local fallback without a key)',
      'TMDB posters and trailers when a key is configured; Docker‑ready deploy',
    ],
    stack: ['Python', 'FastAPI', 'pandas', 'scikit‑learn', 'SQLite', 'React', 'Vite', 'Framer Motion', 'Gemini API (optional)', 'TMDB API', 'Docker'],
    place: 'Cinema Archive',
  },
  {
    id: 'discordbot',
    title: 'MultiDiscord Bot',
    repo: 'Beastyy69/MultiDiscord-Bot',
    role: 'Owner',
    category: 'Community Automation · Bot',
    tagline: 'One bot for music, moderation, economy and community.',
    // verified in index.js, package.json and commands/ (131 command files, 14 categories)
    summary:
      'A multi‑purpose Discord bot on Node.js and Discord.js v12, organised into 130+ prefix commands. It plays music, moderates, runs giveaways, an economy and levels, backs up servers, collects suggestions and generates image cards — with SQLite storage and a small keep‑alive web server for free hosting.',
    features: [
      'Music: play, queue, loop, shuffle, volume and playlists',
      'Moderation: ban, kick, mute, warn, lock, slowmode and a mod log',
      'Economy and levels: balance, work, shop, slots, leaderboard, rank cards',
      'Giveaways, server backups, suggestions, chatbot replies and welcome images',
    ],
    stack: ['JavaScript', 'Node.js', 'Discord.js v12', 'quick.db (SQLite)', 'discord-giveaways', 'discord-music-player', 'Canvas'],
    place: 'Discord Command Hub',
  },
  {
    id: 'scheduler',
    title: 'Scheduler AI',
    repo: 'joydeep-devx/scheduler.ai',
    role: 'Contributor',
    roleNote: 'Contributor · built the face‑recognition service',
    category: 'AI · Smart Campus (team project)',
    tagline: 'Smart classroom management with face‑recognition attendance.',
    // verified: repo owned by joydeep‑devx; my 5 commits added ai-service/src/face/*,
    // ai-service/src/routes/face_routes.py and student-controller changes
    summary:
      'A team project for managing classrooms: attendance, timetables and staff. I built the AI attendance service — face detection, 128‑dimension face embeddings, matching and recognition exposed through FastAPI routes — and worked on the student backend controller. The repository is owned by joydeep‑devx.',
    features: [
      'My part: face registration and recognition service (FastAPI + face_recognition + OpenCV)',
      'My part: 128‑d face embeddings and matching for attendance',
      'Team backend: Express + MongoDB with JWT auth for students, teachers, subjects and timetables',
    ],
    stack: ['Python', 'FastAPI', 'face_recognition', 'OpenCV', 'NumPy', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    place: 'Timetable Tower',
  },
];

export const githubUrl = (p) => gh(p.repo);
export const featuredProject = projects.find((p) => p.featured);
