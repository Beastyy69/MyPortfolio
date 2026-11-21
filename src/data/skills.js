// Six skill domains. `level` (0–100) only drives the word‑based tier and the
// small level bar — it is never shown as a number.
const s = (name, abbr, level, note, tools) => ({ name, abbr, level, note, tools });

export const skillCategories = [
  {
    id: 'ai',
    name: 'Machine Learning',
    capability: 'Model Training',
    summary: 'Training, evaluating and fine‑tuning models — from classical ML to deep learning.',
    learning: ['LLM fine‑tuning', 'MLflow'],
    retroName: 'NEURAL ARTS',
    icon: 'brain',
    tone: 'violet',
    skills: [
      s('PyTorch', 'PT', 85, 'Custom architectures, training loops and fine‑tuning pre‑trained models.', ['torchvision', 'Lightning', 'CUDA']),
      s('TensorFlow', 'TF', 82, 'Keras pipelines, CNNs and exporting models for serving.', ['Keras', 'TF Serving', 'TensorBoard']),
      s('Scikit-learn', 'SK', 90, 'Classical ML, feature pipelines, cross‑validation and model selection.', ['Pipelines', 'XGBoost', 'Optuna']),
      s('Pandas', 'PD', 92, 'Wrangling messy data, feature engineering and fast exploratory analysis.', ['Jupyter', 'Polars', 'Matplotlib']),
      s('NumPy', 'NP', 90, 'Vectorised maths, tensors and the numerical core under everything.', ['SciPy', 'Numba']),
    ],
  },
  {
    id: 'backend',
    name: 'Python Backend',
    capability: 'API Architecture',
    summary: 'Clean, typed, async services that put models and data in front of real users.',
    learning: ['GraphQL'],
    retroName: 'BACKEND FORGE',
    icon: 'server',
    tone: 'blue',
    skills: [
      s('Python', 'PY', 95, 'My main language — async, typing, packaging and clean, tested code.', ['asyncio', 'pytest', 'Poetry']),
      s('FastAPI', 'FA', 90, 'Async APIs with Pydantic validation, auth and ML model serving.', ['Pydantic', 'Uvicorn', 'OAuth2/JWT']),
      s('Django', 'DJ', 80, 'ORM‑driven apps, admin tooling and full‑stack products.', ['DRF', 'Celery', 'Admin']),
      s('Flask', 'FL', 84, 'Lightweight services, internal tools and data dashboards.', ['Blueprints', 'Jinja', 'Gunicorn']),
      s('REST APIs', 'RE', 92, 'Resource‑oriented endpoints with versioning, pagination and auth.', ['OpenAPI', 'Postman', 'HTTP caching']),
    ],
  },
  {
    id: 'data',
    name: 'Data & APIs',
    capability: 'Data Processing',
    summary: 'Schemas, queries and contracts — the layer everything else depends on.',
    learning: ['Redis Streams'],
    retroName: 'DATA VAULT',
    icon: 'database',
    tone: 'cyan',
    skills: [
      s('SQL', 'SQ', 88, 'Schema design, joins, window functions and query tuning.', ['PostgreSQL', 'MySQL', 'SQLAlchemy']),
      s('MongoDB', 'MG', 80, 'Document modelling and aggregation pipelines.', ['Motor', 'Atlas', 'Aggregation']),
      s('Redis', 'RD', 76, 'Caching, rate limiting and lightweight queues in front of APIs.', ['redis-py', 'TTL caches', 'Pub/Sub']),
      s('API Design', 'AD', 86, 'Contracts first: consistent naming, errors, pagination and docs.', ['OpenAPI', 'Versioning', 'Error models']),
      s('Pydantic', 'PD', 88, 'Typed validation and settings for every request and config.', ['Validators', 'Settings', 'Schemas']),
    ],
  },
  {
    id: 'tools',
    name: 'Deployment & Tools',
    capability: 'Deployment Pipeline',
    summary: 'Getting code from a laptop to a server, reproducibly.',
    learning: ['Kubernetes'],
    retroName: 'UTILITY BELT',
    icon: 'cloud',
    tone: 'green',
    skills: [
      s('Docker', 'DK', 78, 'Reproducible images, multi‑service compose stacks and slim builds.', ['Compose', 'Multi‑stage', 'Registry']),
      s('Git', 'GT', 90, 'Branching strategies, reviews and a clean, readable history.', ['GitHub', 'Rebase', 'Code review']),
      s('Linux', 'LX', 82, 'Shell scripting, servers, processes and debugging in production.', ['Bash', 'systemd', 'Nginx']),
      s('GitHub Actions', 'GA', 76, 'CI pipelines that lint, test, build and ship containers.', ['Workflows', 'Docker build', 'Secrets']),
      s('Cloud Deploy', 'CL', 72, 'Deploying services and static sites — Render, VMs and managed databases.', ['Render', 'Env config', 'Logs']),
    ],
  },
  {
    id: 'web',
    name: 'Web Development',
    capability: 'Interfaces',
    summary: 'Interfaces that talk to the APIs I build — responsive, accessible and fast.',
    learning: ['TypeScript', 'Next.js'],
    retroName: 'WEB WORKSHOP',
    icon: 'code',
    tone: 'violet',
    skills: [
      s('HTML', 'HT', 92, 'Semantic, accessible markup as the base of every page.', ['ARIA', 'Forms', 'SEO basics']),
      s('CSS', 'CS', 88, 'Layouts, design tokens and motion without bloat.', ['Grid', 'Flexbox', 'Custom properties']),
      s('JavaScript', 'JS', 86, 'Modern JS for interactivity, fetch and DOM work.', ['ES2023', 'Fetch', 'Modules']),
      s('React', 'RC', 84, 'Component UIs with hooks, context and Framer Motion — like this site.', ['Hooks', 'Vite', 'Framer Motion']),
      s('Responsive UI', 'RU', 86, 'Layouts that hold up from 360px phones to wide desktops.', ['Mobile‑first', 'Fluid type']),
      s('Frontend Integration', 'FI', 82, 'Wiring UIs to FastAPI / Django backends with clean data flow.', ['REST', 'Auth flows', 'Error states']),
    ],
  },
  {
    id: 'core',
    name: 'Programming Foundations',
    capability: 'Fundamentals',
    summary: 'The fundamentals that make every other tool easier to learn.',
    learning: ['Rust basics'],
    retroName: 'THE BASICS',
    icon: 'puzzle',
    tone: 'blue',
    skills: [
      s('Java', 'JV', 88, 'Core Java and OOP — where structured programming clicked.', ['Collections', 'OOP', 'JVM basics']),
      s('C', 'C', 80, 'Memory, pointers and how programs really run.', ['Pointers', 'Memory', 'gcc']),
      s('Data Structures', 'DS', 88, 'Arrays to graphs — picking the right structure for the job.', ['Trees', 'Graphs', 'Hashing']),
      s('OOP', 'OO', 90, 'Object‑oriented design: encapsulation, interfaces and composition.', ['SOLID', 'Patterns', 'Abstraction']),
      s('Problem Solving', 'PS', 92, 'Breaking big problems into small, testable steps.', ['Algorithms', 'Debugging', 'Complexity']),
    ],
  },
];

export const allSkills = skillCategories.flatMap((c) => c.skills.map((x) => ({ ...x, cat: c })));

export function rarityOf(level) {
  if (level >= 90) return { id: 'legendary', label: 'LEGENDARY' };
  if (level >= 85) return { id: 'epic', label: 'EPIC' };
  if (level >= 80) return { id: 'rare', label: 'RARE' };
  return { id: 'common', label: 'UNCOMMON' };
}

// Proficiency expressed in words, not percentages.
export const TIERS = [
  { id: 'strong', label: 'Strongest tools', rank: 'A', min: 90 },
  { id: 'daily', label: 'Daily tools', rank: 'B', min: 84 },
  { id: 'working', label: 'Working knowledge', rank: 'C', min: 0 },
];
export const tierOf = (level) => TIERS.find((t) => level >= t.min);
