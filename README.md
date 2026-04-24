# Widget Studio

> A widget platform for building customizable, embeddable widgets for Notion, websites, dashboards, and custom apps.

<p align="center">
  <a href="https://www.linkedin.com/in/bilalabdulhadii/"><img src="https://img.shields.io/badge/Chat-Let's%20chat-darkseagreen?labelColor=gray&style=flat" alt="Chat" /></a>
  <a href="https://www.buymeacoffee.com/bilalabdulhadii"><img src="https://img.shields.io/badge/Donate%20$-Buy%20me%20a%20coffee-darkkhaki?labelColor=gray&style=flat" alt="Donate $" /></a>
  <a href="https://github.com/bilalabdulhadii/react-widget-studio"><img src="https://img.shields.io/badge/Coding-Work%20Together-cornflowerblue?labelColor=gray&style=flat" alt="Coding" /></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#feature-tour">Feature Tour</a> •
  <a href="#widget-catalog">Widget Catalog</a> •
  <a href="#embed-model">Embed Model</a> •
  <a href="#theme--appearance">Theme & Appearance</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation--setup">Installation & Setup</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#email-me">Email Me</a> •
  <a href="#about-me">About Me</a> •
  <a href="#support">Support</a>
</p>

---

## Overview

**Widget Studio** is a widget platform built around a simple marketplace and builder flow:

- browse widgets on the marketplace page
- open a dedicated builder page for each widget
- customize settings locally in the editor
- copy a public embed URL or iframe snippet
- use the widget anywhere iframe embeds are supported

The builder page keeps a clean product URL such as `/widgets/flip-clock`, while the generated embed URL carries the actual configuration in query params such as `/embed/flip-clock?...`.

Widget Studio is designed for:

- **Notion dashboards**
- **personal websites**
- **internal dashboards**
- **custom products and tools**

Each widget can be customized in the builder and exported as an embed URL or iframe snippet for use anywhere iframe embeds are supported.

---

## Feature Tour

### Marketplace

- **Dedicated widget catalog:** browse widgets by category from a polished `/widgets` marketplace.
- **Search and autocomplete:** search by widget title, aliases, and keywords.
- **Preview thumbnails:** marketplace cards use dedicated preview components instead of raw embed renders.
- **Featured section:** the home page highlights selected widgets in a looping showcase.
- **Reusable marketplace UI:** category badge, free price badge, description, and preview treatment are shared across cards.

### Widget Builder

- **Clean builder URLs:** each widget has its own route such as `/widgets/audio-bar` or `/widgets/event-board`.
- **Live preview:** changes update instantly in the editor preview.
- **Export panel:** copy the embed link or iframe directly from the builder.
- **Responsive editor layout:** settings and preview sit side by side on large screens and stack cleanly on smaller screens.
- **Widget-specific controls:** each builder only shows the settings relevant to that widget.

### Embed System

- **Slug-based embed routes:** embeds use `/embed/:slug`.
- **Query-param configuration:** embed output is controlled through the generated query string, not through persisted server state.
- **Iframe-ready output:** the embed page renders widget output without app chrome.
- **Backward compatibility redirects:** older editor-style routes redirect into the current product routes where possible.

### Widget Behavior

- **Interactive widgets:** timers, counters, habits, progress, and audio widgets can be interacted with directly inside the widget surface.
- **Audio players:** support play/pause, scrubbing, optional time, volume, loop visibility, and visualizer display depending on style.
- **Clock variants:** include digital, flip, ring, split, and analog layouts.
- **Productivity blocks:** timers, event countdowns, progress tracking, day tracking, habits, focus surfaces, notes, links, quotes, and counters.

---

## Widget Catalog

Current widget set:

### Audio

- **Audio Bar** — minimal horizontal player inspired by clean embed bars
- **Mono Player** — compact player with optional audio visualizer
- **Focus Player** — large, distraction-free audio surface
- **Studio Player** — richer player with metadata and optional visualizer

### Clock

- **Digital Clock**
- **Flip Clock**
- **Ring Clock**
- **Split Clock**
- **Analog Clock**

### Productivity

- **Pomodoro Timer**
- **Event Board**
- **Progress Tracker**
- **Day Tracker**
- **Habit Board**
- **Focus Board**
- **Streak Counter**

### Utility

- **Quote Board**
- **Greeting Card**
- **Quick Links**
- **Note Board**

All widgets currently ship with a **Free · 0$** marketplace label.

---

## Embed Model

Widget Studio uses a simple split between builder routes and embed routes:

### Builder route

```text
/widgets/flip-clock
```

### Embed route

```text
/embed/flip-clock?appearance=dark&customBackground=false&seconds=true
```

### Iframe example

```html
<iframe
    src="https://widget.bilalabdulhadi.com/embed/flip-clock?appearance=dark&customBackground=false&seconds=true"
    title="Flip Clock"
    style="width:100%;height:360px;border:0;border-radius:24px;overflow:hidden;"
    loading="lazy"></iframe>
```

Key behavior:

- builder settings are stored in local React state
- the browser URL for the builder stays clean
- the generated embed link contains the widget configuration
- only the embed route reads widget settings from query params

---

## Theme & Appearance

Widget Studio uses a shared theme system across the app and widgets.

### App theme

- **Light**
- **Dark**

### Widget appearance

- **Light**
- **Dark**
- **Optional custom background color**

Custom background changes only the outer page/background color. The widget card itself stays on the selected light or dark appearance.

When custom background is off, embed pages use the default outer background for the selected appearance. In light mode, embeds default to a pure white outer background so they blend cleanly into Notion light pages.

The widget renderer uses centralized token layers instead of ad hoc per-widget base colors:

- background
- surface
- surfaceElevated
- innerCard
- text
- mutedText
- border
- shadow

Accent colors remain optional and affect highlights only. They do not replace the base theme system.

---

## Tech Stack

- **React 19**
- **React Router 6**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **FlipClock** for the flip clock implementation
- **CRA** (`react-scripts`) for build tooling
- **Jest + React Testing Library** for tests

<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" height="40" alt="React" /></a>
<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40" height="40" alt="JavaScript" /></a>
<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" width="40" height="40" alt="HTML" /></a>
<a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" width="40" height="40" alt="CSS" /></a>

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/bilalabdulhadii/react-widget-studio
```

2. **Move into the project folder**

```bash
cd widget
```

3. **Install dependencies**

```bash
npm install
```

4. **Start the development server**

```bash
npm start
```

5. **Create a production build**

```bash
npm run build
```

6. **Run tests**

```bash
npm test
```

The default audio asset lives in `public/default-audio.mp3`.

---

## Project Structure

```text
public/
  default-audio.mp3
  index.html
  logo.png
  manifest.json

src/
  components/   Shared UI parts such as the header, footer, cards, price badge, and widget preview system
  data/         Central widget catalog, defaults, slugs, metadata, and preview config
  pages/        Home, About, marketplace, builder, and embed routes
  widgets/      Shared widget renderer, theme tokens, flip clock wrapper, and widget styles
  hooks/        App theme handling
  utils/        Query-string and embed helpers
```

Core areas:

- **`src/data/widgets.js`** is the source of truth for widget slugs, titles, defaults, descriptions, and routing metadata.
- **`src/pages/WidgetsPage.js`** handles the marketplace experience.
- **`src/pages/EditorPage.js`** handles the widget builder and export flow.
- **`src/pages/EmbedPage.js`** handles iframe-safe output.
- **`src/widgets/WidgetRenderer.js`** owns the runtime widget rendering system.
- **`src/components/WidgetPreview.js`** owns marketplace-only preview thumbnails.

---

## Email Me

If this project helped you, or you want to collaborate, email me at:

**<a href="mailto:bilalabdulhadi88@gmail.com">bilalabdulhadi88@gmail.com</a>**

---

## About Me

Designing practical interfaces and clean product surfaces.  
Focused, modern, and built with attention to details that matter.

---

## Support

<p><a href="https://www.buymeacoffee.com/bilalabdulhadii"><img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="Buy me a coffee" /></a></p><br><br>

---

> Website [@bilalabdulhadi.com](https://bilalabdulhadi.com/) &nbsp;&middot;&nbsp;
> GitHub [@bilalabdulhadii](https://github.com/bilalabdulhadii/) &nbsp;&middot;&nbsp;
> LinkedIn [@bilalabdulhadii](https://www.linkedin.com/in/bilalabdulhadii/)
