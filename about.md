# About this website

The personal portfolio of **Harshit Shaw**, an AIML developer and Python backend engineer. It is a single‑page **React** site with **two complete visual themes** that you can switch between at any time:

| | **AI/ML Mode** (default) | **Game Mode** |
|---|---|---|
| Feel | Calm, editorial engineering portfolio | Vintage game manual / home console |
| Colours | Ink navy, charcoal, warm ivory, slate blue, dusty indigo, a little muted teal and amber | Espresso, burgundy, vintage cream, muted gold, faded red, dusty forest green |
| Type | Sora (headings), Inter (body), JetBrains Mono (labels) | Chakra Petch (headings + body), Press Start 2P and VT323 (labels, scores, badges) |
| Rule | No neon, no glow, no scanning effects, no repeated decorative logos — in either mode |

Every visit starts in AI/ML Mode. The toggle in the top‑right switches worlds.

---

## Tech stack

- **React 18** with **Vite 5** (dev server + production build)
- **Framer Motion 11** for every animation: reveals, layout transitions, the photo‑to‑panel morph, the mode switch
- **Lenis** for smooth scrolling
- Plain **CSS** with design tokens (CSS custom properties) — no CSS framework
- `<canvas>` for the moving background, the skills particle field and the two mini‑games
- Hosted on **Render** as a static site, deployed automatically from GitHub

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in dist/
```

Render settings: build command `npm install && npm run build`, publish directory `dist`.

---

## Page structure (top to bottom)

1. **Preloader** — a split “two worlds” boot screen (AI on the left, arcade on the right) that builds an “HS” monogram, then opens like two doors. Skip with any key or click.
2. **Hero** — name, role, tagline, a “View Projects” button and contact links.
3. **About** — portrait, short story, roles and stats.
4. **Skills** — “My Skills” neural graph (AI) / “The Cartridge Shelf” (Game).
5. **Projects** — editorial case studies (AI) / mission select (Game).
6. **Certificates** — credential ledger (AI) / flip‑card achievements (Game).
7. **Journey** — sticky timeline (AI) / walkable campaign map (Game).
8. **Arcade** — Game Mode only: the *Data Cores* mini‑game in a cabinet.
9. **Contact** — oversized heading, contact tiles and a message form.
10. **Footer** — name, “Let’s connect / View résumé / Back to top”, links.

---

## How the theme switch works

1. Both themes are just two sets of **CSS variables** in `src/styles/tokens.css`, selected by `html[data-mode="ai" | "retro"]`.
2. `ModeContext` (`src/context/ModeContext.jsx`) owns the current mode. When you press the toggle it:
   - records which section you are reading and how far into it (`captureAnchor`),
   - plays a full‑screen transition (`ModeTransition.jsx`) — a panel sweep for AI, an “insert coin” pixel wipe for Game,
   - swaps the mode while the screen is covered,
   - scrolls you back to the same spot (`restoreAnchor`), then reveals the page.
3. Components that look completely different in each mode render one of two versions (for example `isRetro ? <SkillConsole /> : <NeuralUniverse />`). Smaller differences are handled purely in CSS with `[data-mode='retro'] …` selectors.

---

## Feature walkthrough

### Hero
- **AI Mode — “intelligence portrait”**: your photo inside layered paper planes, soft geometric shapes, a faint dot texture and slow curved lines. Layers shift gently with the mouse. Clicking the photo (or “About my work”) **morphs the photo into the “About My Work” panel** using a shared Framer Motion `layoutId`.
- **Game Mode — cartridge cover**: your second photo printed on an original game‑cartridge label (“The adventures of Harshit”). Clicking it opens the **Player Profile** with Bio / Skills / Achievements / Links tabs (← → keys switch tabs).
- **Links**: GitHub, LinkedIn, Email and CV appear as icon buttons with tooltips (AI) or controller‑button prompts (Game). They are real links.
- **Code Runner** (Game Mode): a pixel version of Harshit runs **automatically and non‑stop** — jumping corrupted blocks, broken bridges and falling debris and collecting data cores. When it crashes it saves the high score and starts the next run.

### Skills
- **AI Mode — “My Skills” neural graph** (`NeuralUniverse.jsx`)
  - Six domains placed around a quiet **MY SKILLS** hub: Machine Learning, Python Backend, Data & APIs, Deployment & Tools, Web Development, Programming Foundations.
  - Skills sit on arcs facing away from the hub so clusters never overlap.
  - Only meaningful relationships are drawn (`LINKS`), e.g. Python → Pandas / NumPy / Pydantic / Docker, React → REST APIs, Java → OOP.
  - **Click** a skill to select it: neighbours highlight, everything else fades, and the details band shows the explanation, a practical use (`USES`) and related technologies. Domain tabs zoom the view toward a cluster.
  - On phones it becomes one domain at a time with large tap targets.
- **Game Mode — “The Cartridge Shelf”** (`SkillConsole.jsx`)
  - Each domain is an original cartridge on a wooden shelf. Clicking one “loads” it into a vintage console (“HS‑16 Home System”).
  - The console screen lists that domain’s abilities as a menu with a ▶ cursor (mouse or ↑/↓) and shows rank, use, a project example and related skills.
- Proficiency is always shown in **words and ranks** (Strongest tools = A, Daily tools = B, Working knowledge = C) — never percentages.

### Projects
- **AI**: alternating editorial rows with a wiping image reveal and gentle parallax; filter by category.
- **Game**: a mission list on the left and a briefing screen on the right with difficulty, outcome, status, stack and high‑contrast “Source code” / “Demo soon” buttons.

### Certificates
- **AI**: a large counter beside a clean ledger of credentials with verify links.
- **Game**: trophy badges that unlock in sequence as you scroll in; “Inspect” flips a badge to show its skills and credential link.

### Journey
- **AI**: a sticky year on the left that changes as you scroll the steps on the right.
- **Game**: a maze‑style campaign map. Click a level (or use the arrow keys) and the robot walks the path there.

### Arcade (Game Mode only)
- **Data Cores** — move left/right to collect cores and dodge bugs. Keyboard, touch pad and drag controls; pause/resume; high score saved.

### Contact
- An oversized heading whose words slide in on scroll, contact tiles (availability with live local time, email with copy button, GitHub, LinkedIn) and a calm form.
- Validation only appears after you leave a field. “Send transmission” opens the visitor’s mail app with the message filled in, then shows a “Signal received” animation. *(No backend; swap in Formspree/EmailJS/your own API later.)*

### Background (both modes)
`Backdrop.jsx` draws one quiet canvas of drifting dots with connecting lines that fade in and out, plus a drifting grid and slowly morphing soft shapes. Its behaviour eases between “moods” depending on the section in view:

| Section | Motion |
|---|---|
| Hero | calm flowing currents |
| Skills | richer neural connections |
| Projects | straight, structured paths |
| Journey | particles travelling down lanes |
| Contact | signals converging toward one point |

### Site‑wide details
- Floating navigation bar that shrinks into a panel on scroll; game‑menu labels in Game Mode.
- Vertical progress rail with chapter ticks (desktop).
- Custom cursor with contextual labels (desktop, not on touch).
- Magnetic buttons and word‑by‑word heading reveals.
- Large outlined “ghost” words drifting behind each section.

---

## Accessibility & performance

- **Reduced motion** (`prefers-reduced-motion`) turns off smooth scrolling, particles, auto‑running games and decorative motion; content still appears.
- Keyboard: skip link, visible focus styles, Escape closes panels, arrow keys in tabs/menus/maps.
- Real links stay real links; buttons have accessible labels.
- Canvases pause when off‑screen or when the tab is hidden.
- Each game and the background are wrapped in `SafeBoundary`, so if one ever fails only that piece disappears — the page stays up.

---

## Project structure

```
src/
  main.jsx                 entry: providers + all stylesheets
  App.jsx                  page layout and section order
  context/
    ModeContext.jsx        current theme, mode switch, scroll preservation
    ProfileContext.jsx     open/close state for the profile panel (+ photo morph id)
    ToastContext.jsx       small pop‑up messages
  lib/smoothScroll.js      Lenis setup, anchor links, capture/restore scroll position
  data/                    ← all editable content lives here
    profile.js             name, role, links, photos, story, stats
    skills.js              six skill domains, levels, tiers
    projects.js            project cards
    certificates.js        certificates (demo — replace with yours)
    journey.js             timeline / campaign levels (demo)
    navigation.js          nav labels per mode
  components/
    layout/                Navbar, ModeToggle, ScrollProgress, Footer
    preloader/             Preloader (dual‑world boot)
    effects/               Backdrop, ModeTransition, Cursor, SignalField
    sections/              Hero, About, Skills, Projects, Certificates, Journey, Arcade, Contact
    visuals/               portraits, NeuralUniverse, SkillConsole, games, project art
    profile/               ProfileModal (About My Work / Player Profile)
    ui/                    Button, Icon, SectionHeading, SplitReveal, Chapter, SafeBoundary…
  styles/
    tokens.css             the two colour/typography themes
    refine.css             final design layer (loaded last)
    …one stylesheet per area
```

---

## Editing content

| To change… | Edit |
|---|---|
| Name, role, email, GitHub, **LinkedIn**, photos | `src/data/profile.js` |
| Skills and their levels | `src/data/skills.js` |
| “Practical use” lines and skill connections | `USES` and `LINKS` in `src/components/visuals/NeuralUniverse.jsx` |
| Projects | `src/data/projects.js` |
| Certificates | `src/data/certificates.js` |
| Journey levels | `src/data/journey.js` |
| Profile panel roles / interests | top of `src/components/profile/ProfileModal.jsx` |
| Colours or fonts for a theme | `src/styles/tokens.css` |

**Still placeholder:** the LinkedIn URL, certificates, journey dates, project demo links and some “practical use” / “currently learning” examples.
