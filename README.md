# Harshit Shaw — Portfolio (React + Framer Motion)

Two portfolio experiences in one site, switchable from the top navigation:

- **AI/ML Developer Mode** — navy glass panels, neural mesh background, system‑diagram skills, case‑study projects.
- **Retro Gamer Mode** — CRT screens, pixel HUDs, inventory skills, mission cards, quest timeline. All artwork is original (no game logos, sprites or characters).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

## Edit your content

All copy lives in `src/data/` — no component changes needed:

| File | What it controls |
| --- | --- |
| `profile.js` | Name, role, tagline, email, GitHub, **LinkedIn (placeholder — update it)**, photo, story, stats |
| `skills.js` | Skill categories, levels (0–100) and notes |
| `projects.js` | Project cards, filters, metrics and links (`demo: '#'` shows “Demo soon”) |
| `certificates.js` | Certificates — **demo entries, replace with your own**. Copy an object to add one |
| `journey.js` | Timeline / quest levels — demo periods and text |

Photos are in `src/assets/` (`profile.jpg` is your existing `merapfp.jpg`). To use a screenshot for a project, import it in `projects.js` and set `image:` instead of `art:`.

## Structure

```
src/
  context/ModeContext.jsx   theme state, persisted mode, transition timing
  data/                     all editable content
  hooks/                    active-section, typewriter
  components/
    layout/                 Navbar, ModeToggle, Footer
    preloader/              Preloader, AiBoot, RetroBoot
    effects/                Backdrop (canvas), ModeTransition (full-screen wipe)
    sections/               Hero, About, Skills, Projects, Certificates, Journey, Contact
    visuals/                NeuralPortrait, ArcadePortrait, ArcadeStrip, ProjectArt, PixelSprite
    ui/                     Button, Icon, SectionHeading, Reveal, ModeSwap, Counter
  styles/                   tokens.css (both themes) + one stylesheet per area
```

Theming works through CSS variables on `html[data-mode]`; `ModeSwap` cross‑fades components that render differently per mode.

## Experience highlights

- Lenis smooth scrolling, custom cursor, magnetic buttons, masked text reveals, chapter ghost type and a vertical progress rail.
- Mode switch preserves your scroll position (`src/lib/smoothScroll.js` → `captureAnchor` / `restoreAnchor`).
- AI mode: profile scanner portrait, skills command center, editorial case studies, credential ledger, sticky timeline.
- Game mode: skill tree, mission select, flip‑card achievements, playable campaign map, and the **Data Cores** mini‑game (`src/components/visuals/DataCoresGame.jsx`, high score saved in localStorage).
- Footer “press start” easter egg.

## Notes

- The contact form opens the visitor's mail app (`mailto:`) — swap in Formspree, EmailJS or your own FastAPI endpoint in `Contact.jsx` when ready.
- Respects `prefers-reduced-motion` (Framer Motion `reducedMotion="user"` + CSS), keyboard navigation, skip link and visible focus states.
