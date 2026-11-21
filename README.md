<div align="center">

# Harshit Shaw — Portfolio

**AIML Developer · Python Backend Engineer · Builder**

One portfolio, two worlds: a calm, editorial **AI/ML environment** and an original,
hand‑crafted **Game world** called *Code Frontier* — switchable at any moment
without losing your place.

![React](https://img.shields.io/badge/React-18-20232a?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-1b1f24?style=flat-square&logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-1b1f24?style=flat-square&logo=framer)
![CSS](https://img.shields.io/badge/Plain_CSS-design_tokens-1b1f24?style=flat-square&logo=css3)

</div>

---

## Contents

- [The idea](#the-idea)
- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Editing the content](#editing-the-content)
- [Accessibility & performance](#accessibility--performance)
- [Deployment](#deployment)
- [Commit history guide](#commit-history-guide)
- [Design rules](#design-rules)

---

## The idea

|  | **AI/ML Mode** (always the default) | **Game Mode** — *Code Frontier* |
|---|---|---|
| Feel | A quiet, precise engineering portfolio | A premium, original adventure world |
| Palette | Deep ink `#0C1018`, ivory `#F4F0E8`, sage `#A7B9A3`, brass `#B89B68` | Espresso, burgundy, parchment, mustard, olive, dusty red |
| Skills | Neural "My Skills" universe | Code Frontier Atlas (campaign map of skill zones) |
| Projects | Editorial case studies | Mission Select Gallery |
| Journey | Sticky timeline | Career campaign map |
| Extra | — | *Core Run*: a 30‑round platformer |

The site **always opens in AI/ML Mode**. Game Mode only appears when the visitor
switches deliberately using the toggle in the navbar.

---

## Highlights

### Opening — *"Scattered identities become one signature."*
24 nodes start scattered across the full screen with a few identity words
(*Coder, Gamer, Biker, Roaster, Builder, AIML*). They discover their connections,
travel on calm curves to the centre and land on the skeleton of a custom **HS**
monogram, which thickens stroke by stroke into solid, variable‑width ivory letters.
The name and role appear beneath it, then a few paths extend outward into the hero.

- Centred exactly on any screen (the SVG covers the viewport and the mark is anchored to its centre)
- Progress is gated by **real asset loading**, never a fake counter
- Plays **once per session**, skippable after one second (click, Enter or Escape)
- Reduced motion: a short fade straight to the finished mark

### World change — a full‑screen tile takeover (~1.4 s)
- **AI/ML → Game:** the page dims, neural nodes detach and multiply into large square tiles that form a diamond‑ring board — **GAME WORLD UNLOCKED** — then the bottom rows turn to terrain, a row folds into platforms, flags rise and the tiles flip away onto Game Mode.
- **Game → AI/ML:** terrain breaks into tile fragments that settle into a structured ink grid — **SYSTEM WORLD RESTORED** — and shrink back into connected neural nodes.
- The page swaps **while the tiles cover it**, so the visitor stays on the same section at the same scroll position. The preloader never replays.

### Sections
| Section | AI/ML Mode | Game Mode |
|---|---|---|
| **Hero** | Intelligence portrait with layered frame; photo morphs into the *About My Work* panel | Cartridge cover + World Preview Strip under the navbar |
| **About** | Statement, story chapters, roles, counting stats | Character‑select screen |
| **Skills** | Neural universe: hover depth, click focus, connection animation, detail panel | Code Frontier Atlas: hand‑drawn map of skill zones |
| **Projects** | Case‑study rows with image wipe, parallax and filters | Mission Select Gallery: brass‑framed plaques, category tokens, expandable mission briefings |
| **Certificates** | Counter + credential ledger | Trophy badges that unlock and flip |
| **Journey** | Sticky editorial timeline | Career campaign map |
| **Core Run** | — | 30 rounds, timers, core targets, a new mechanic every 5 rounds, saved progress, keyboard + touch |
| **Contact** | Oversized heading, contact tiles with live local time, validated form | Same, in the game palette |

### Everywhere
Lenis smooth scrolling · custom cursor with contextual labels · magnetic buttons ·
word‑by‑word heading reveals · scroll‑linked chapter transitions · vertical progress
rail · layered parallax world backgrounds · optional background music (off by default).

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | **React 18** |
| Build / dev server | **Vite 5** |
| Animation | **Framer Motion 11** (layout animations, shared `layoutId` morphs, SVG path animation) |
| Scrolling | **Lenis** |
| Styling | Plain **CSS** with design tokens (CSS custom properties), no framework |
| Graphics | Inline **SVG** for every illustration and the monogram; `<canvas>` for the background and *Core Run* |

No UI kit, no icon font, no third‑party game assets — every illustration is original.

---

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/Beastyy69/MyPortfolio.git
cd MyPortfolio
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

**Dev‑only helpers** (they do nothing in production builds):

- `/?intro=60` — jump to and hold the opening film at 60 % (`?intro=hold` keeps it on screen)
- `window.__holdTransition({ to: 'retro', phase: 'in' })` in the console freezes the world‑change scene; `window.__holdTransition(null)` clears it

---

## Project structure

```
├── index.html                 HTML entry: meta tags, fonts, #root
├── public/
│   ├── favicon.svg            HS tab icon
│   ├── Harshit_Shaw_Resume.pdf
│   └── audio/                 optional background track
└── src/
    ├── main.jsx               mounts the app, providers and every stylesheet
    ├── App.jsx                section order, preloader, transition, cursor, backdrop
    │
    ├── context/
    │   ├── ModeContext.jsx    AI/ML ⇄ Game state, world‑change timing, scroll preservation
    │   ├── ProfileContext.jsx open/close state for the profile panel (+ photo morph id)
    │   └── ToastContext.jsx   short pop‑up notices
    │
    ├── lib/smoothScroll.js    Lenis setup, anchor links, captureAnchor / restoreAnchor
    ├── hooks/                 useActiveSection · useMagnetic · useTypewriter
    │
    ├── data/                  ← all editable content
    │   ├── profile.js         name, roles, links, photos, story, stats
    │   ├── skills.js          skill domains and levels
    │   ├── projects.js        projects, filters, mission categories
    │   ├── journey.js         timeline / campaign levels, achievements
    │   ├── certificates.js    certificates
    │   └── navigation.js      nav labels per mode
    │
    ├── components/
    │   ├── preloader/         Preloader — the HS signature film
    │   ├── effects/           ModeTransition (tile takeover), Backdrop, SignalField,
    │   │                      WorldLayers (parallax worlds), Cursor
    │   ├── layout/            Navbar, ModeToggle, MusicToggle, ScrollProgress, Footer
    │   ├── sections/          Hero, About, Skills, Projects, Certificates, Journey,
    │   │                      Arcade (Core Run), Contact
    │   ├── visuals/           NeuralPortrait, NeuralUniverse, ProjectArt, ArcadePortrait,
    │   │                      CharacterSelect, ArcadeStrip, PixelSprite, ModelArchitect
    │   ├── game/              Game Mode pieces:
    │   │   ├── MissionSelect.jsx   project gallery + briefings
    │   │   ├── MissionScenes.jsx   one original scene per project
    │   │   ├── AbilityMap.jsx / AtlasArt.jsx   Code Frontier Atlas (skills)
    │   │   ├── CareerMap.jsx       career campaign route
    │   │   ├── WorldPreview.jsx    strip under the navbar
    │   │   └── CoreRun.jsx · engine.js · render.js · sprites.jsx   the mini‑game
    │   ├── profile/           ProfileModal (About My Work / Player Profile)
    │   └── ui/                Button, Icon, Chapter, SectionHeading, Reveal, SplitReveal,
    │                          Counter, HeroLinks, ModeSwap, SafeBoundary
    │
    ├── assets/                profile photos, project screenshot
    └── styles/
        ├── tokens.css         both colour + type systems
        ├── base.css · layout.css · effects.css
        ├── preloader.css · transition.css · world.css
        ├── one stylesheet per section (hero, about, skills, projects, cases,
        │   missions, journey, certificates, arcade, runner, contact, profile, portraits)
        ├── refine.css         final design layer
        └── fhd.css            Full‑HD (1920 px+) polish, loaded last
```

---

## How it works

### Two themes, one set of components
Both worlds are sets of **CSS variables** in `src/styles/tokens.css`, selected by
`html[data-mode="ai" | "retro"]`. Small differences live in CSS
(`[data-mode='retro'] …`). Sections that are completely different per world render
one of two components, e.g.

```jsx
{isRetro ? <MissionSelect /> : <CaseStudies />}
```

### The world switch keeps your place
`ModeContext.switchMode()`:
1. records which section you are reading and how far into it (`captureAnchor`)
2. plays the *in* half of the tile scene until the screen is fully covered
3. swaps `data-mode` underneath
4. scrolls back to the same spot (`restoreAnchor`)
5. plays the *out* half to reveal the new world

With reduced motion it does the same with a ~0.35 s colour crossfade.

### The HS monogram
The letters are real filled shapes: two pillars and a slanted bridge for the **H**,
and an **S** whose outline is generated from a Catmull–Rom centreline with
direction‑based stroke width (thick verticals and spine, finer horizontals).
During the film an SVG **mask** of growing centreline strokes reveals those shapes,
which is how thin connections "thicken" into solid letters.

### Core Run
`engine.js` is a pure module — fixed 60 Hz step, per‑axis AABB collisions, coyote
time, jump buffering, moving platforms and a seeded round generator — so it can be
tested headlessly. `render.js` draws to canvas and `CoreRun.jsx` handles input,
timers and saved progress (`localStorage`).

---

## Editing the content

Everything visitors read lives in **`src/data/`** — no component changes needed.

| To change… | Edit |
|---|---|
| Name, roles, email, GitHub, LinkedIn, photos | `src/data/profile.js` |
| Skills and levels | `src/data/skills.js` |
| Skill connections and "practical use" lines | `LINKS` / `USES` in `src/components/visuals/NeuralUniverse.jsx` |
| Projects (summary, challenge, metric, stack, links) | `src/data/projects.js` |
| Certificates | `src/data/certificates.js` |
| Journey / campaign levels | `src/data/journey.js` |
| Colours and fonts of either world | `src/styles/tokens.css` |

Tips:
- A project with `demo: '#'` shows **"Demo in development"** instead of a live link.
- To use a screenshot for a project, import it in `projects.js` and set `image:` instead of `art:`.

> **Still to personalise:** the LinkedIn URL, certificate entries, journey dates and project demo links are placeholders.

---

## Accessibility & performance

- **`prefers-reduced-motion`** turns off smooth scrolling, the film, decorative motion and auto‑running animation — content still appears.
- Skip link, visible focus styles, Escape closes panels and briefings, arrow keys in tabs, menus and maps.
- Real links stay real links; icon buttons have accessible labels.
- Canvases pause when off‑screen or when the tab is hidden.
- Every heavy visual is wrapped in `SafeBoundary`: if one fails, only that piece disappears.
- Responsive from phones to Full‑HD screens; the opening film is centred and tested at 1920×1080, 1440×900, tablet and mobile.

---

## Deployment

Any static host works — the build is plain files in `dist/`.

**Render (static site)**
- Build command: `npm install && npm run build`
- Publish directory: `dist`

**Vercel / Netlify** detect Vite automatically (`npm run build`, output `dist`).

---

## Commit history guide

The history is organised so each commit explains one part of the project, in the
order you would read it:

| Commits | Area |
|---|---|
| 1–3 | Tooling, HTML entry, documentation |
| 4–5 | Design tokens and global styles |
| 6–7 | Smooth scrolling, hooks, contexts (mode switch logic) |
| 8–10 | Content data |
| 11–14 | UI building blocks, navbar, music toggle |
| 15–18 | Backgrounds, cursor, preloader, world‑change transition |
| 19–23 | Portraits, Hero, About, Skills, Projects (AI/ML) |
| 24–25 | Game Mode: Mission Select Gallery, atlas and maps |
| 26–27 | Journey, Certificates, *Core Run* |
| 28 | Contact section and final app assembly |

---

## Design rules

- **No neon** — no cyan glow, purple glow, hot pink, fluorescent green, RGB gradients or glowing outlines, in either world.
- **Original art only** — no logos, sprites, characters or assets from existing games.
- Depth comes from **shadow, grain and layering**, never glow.
- Motion is **calm and purposeful**: soft easing, staggered timing, no snapping or random bouncing.

---

<div align="center">

Designed and built by **Harshit Shaw** · [GitHub](https://github.com/Beastyy69)

</div>
