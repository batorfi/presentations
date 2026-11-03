# presentations

Offline, single-page HTML presentations: a small deck engine (`framework/`) and the decks built on it (`decks/`).
No server, no build step — open a deck's `index.html` in a desktop browser (Chrome, Edge, Safari, Firefox).

```
framework/                 the engine — shared by every deck
  deck.js                  core: stage, navigation, steps, transitions, title bar, hotkeys
  deck.css                 layout, title bar and the slide content kit (s-* classes)
  plugins/                 laser, draw, lens (zoom), spotlight, timer, storyline, menu (+ help), shared tool styles
  themes/kiln/             the KILN design system as a theme
    tokens/                design tokens, copied from batorfi/kiln (.specify/memory/design-system/tokens)
    tokens.css             CSS variables generated from tokens/ (light + dark)
    fonts.css              Inter and Charter, embedded (generated from fonts/)
    theme.css              maps the design system onto the deck's --deck-* roles
decks/
  demo/                    a feature demo — every capability on a few slides
tools/
  tokens-to-css.mjs        regenerate a theme's tokens.css from DTCG token files
  embed-fonts.mjs          regenerate a theme's fonts.css from fonts/fonts.json
```

## Presenting

| Key | Action |
|---|---|
| → Space PgDn ↓ Enter | next step, then next slide |
| ← PgUp ↑ Backspace | previous step, then previous slide |
| Home / End | first / last slide |
| G or O | storyline — the whole flow by section; type a number + Enter to jump |
| F | fullscreen |
| T | light / dark theme |
| L | laser pointer |
| D | draw · 1 circle · 2 rectangle · 3 line · 4 arrow · 5 curved arrow · Shift = round / square / 45° |
| C · X · U | next ink colour · clear drawings · undo last shape |
| Z | zoom lens · wheel or `[` `]` size · Shift+wheel or `+` `−` zoom |
| S | spotlight: dims everything except a window that follows the mouse · Shift+S rectangle / circle · wheel or `[` `]` size |
| P · Shift+P · R | timer: start / pause / resume · stop · restart |
| ? or H | all shortcuts |
| Esc | close a popup, or turn tools off |
| Right-click | menu: navigation, tools, laser / ink / lens settings, theme, motion |

Settings changed in the menu are remembered in the browser. Drawings clear when you leave a slide.
The address keeps your place (`index.html#/7.2` = slide 7, step 2), so a reload returns to it.

## Making a deck

A deck is a folder with an `index.html`, an optional `deck.css`, `slides/` (one script per slide) and `assets/`.
Copy `decks/demo/` to start. In `index.html`, configure the sections and list the slides in order:

```js
Deck.configure({
  title: "ADLC · Part 1",
  theme: "light",            // light | dark (T switches while presenting)
  transition: "slide",       // slide | fade | none — per slide too
  sections: [{ id: "opening", label: "Opening" }, { id: "why", label: "Why" }],
});
```

### A slide

```js
Deck.slide({
  id: "challenge",
  section: "why",
  title: "The challenge",          // shown in the title bar and the storyline
  titlebar: true,                  // false hides the title bar (title slides)
  className: "",                   // extra classes on the slide
  transition: "slide",
  html: `
    <h2 class="s-title">AI can write most of a feature</h2>
    <p class="s-lead" data-anim="fade">…</p>
    <div class="s-card" data-step="1" data-anim="up">Trust</div>
  `,
  notes: "speaker notes",
  steps: 0,                        // extra steps for custom visuals (data-step counts automatically)
  setup(ctx) {},                   // once, after the DOM is built
  onEnter(ctx, { from, dir }) {},
  onStep(step, dir, ctx) {},       // dir: forward | backward | jump
  onLeave(ctx, { to, dir }) {},
});
```

### Element animations

| Attribute | Meaning |
|---|---|
| `data-anim="up"` | animate in when the slide opens (no `data-step`) |
| `data-step="2"` | appear at step 2 (with `data-anim`, default fade) |
| `data-delay="150"` · `data-duration="800"` | stagger and pace (ms) |
| `data-out-step="4"` · `data-out="down"` | leave at step 4 |
| `data-out="fade"` (no step) | leave just before the slide does |

Presets: `fade up down left right zoom pop rise wipe wipe-down blur draw` (`draw` traces SVG strokes).

### Line-by-line focus

Put `data-focus` on a list (or any container) and each → focuses the next child while the others recede:

```html
<ul class="s-list" data-focus data-focus-release>
  <li>First point</li><li>Second point</li><li>Third point</li>
</ul>
```

| Attribute | Meaning |
|---|---|
| `data-focus` | each child is a point; before the first focus step everything shows normally |
| `data-focus="reveal"` | points that have not come yet stay hidden; passed ones dim |
| `data-focus-from="2"` | the step at which the first point is focused (default 1), to combine with other `data-step`s |
| `data-focus-release` | one extra step at the end that brings everything back |
| `data-focus-items=".point"` | choose the points with a selector instead of the direct children |

The steps are counted for you, ← walks back through them, and re-entering a slide restores the right state.

### Spotlight

`S` dims the whole slide except a window under the mouse, which has an animated boundary (teal outline, marching white
dashes, a soft outward pulse) so its edge is always clear. Settings in the right-click menu: size, shape (circle by default,
or rectangle), dimming (light, medium, heavy) and border (animated or static). The animation is off under reduced motion.
It works together with the laser; turning on the zoom lens turns it off.
Going back reverses each step. Reduced motion (system setting or the menu) turns all motion off.

### Timer

Set the talk length in the right-click menu (20 / 30 / 45 / 50 / 60 / 90 minutes, or −5 / +5), or per deck:
`Deck.configure({ timer: { minutes: 50 } })`. `P` starts the countdown, pauses and resumes it, `Shift+P` stops it and `R`
restarts it from the full length. While it runs, the header shows the time left beside the slide counter with a ring
that drains clockwise (teal, amber for the last 20 %, red for the last 5 %); past zero it counts the overrun in red.
On slides without a title bar a small chip shows the same clock. A running timer survives a reload.

### Images and SVG

PNG and JPEG: `<img src="assets/x.png">`, inside `<figure class="s-figure">` for a caption; add `class="cover"` to crop to fill.
SVG: as a file with `<img src="assets/x.svg">`, or inline `<svg class="s-svg">` to style it with theme colours
(`.ink .accent .fill-accent .fill-raised .fill-subtle .line-muted`) and animate its parts with steps.
Inline SVG is the way to animate; files are fine for static pictures (`file://` cannot fetch SVG text).

### Custom visuals

Hooks get a `ctx`: `ctx.el`, `ctx.$(sel)`, `ctx.$$(sel)`, `ctx.step`, `ctx.animate(el, preset, "in"|"out")`,
`ctx.play(el, keyframes, options)` (a tracked Web Animation that navigation can fast-forward),
`ctx.wait(ms)`, `ctx.reduced()` and `ctx.cleanup(fn)` to stop timers or loops when the slide is left.
See `decks/demo/slides/05-custom.js`.

### Content kit

`s-kicker s-hero s-title s-h2 s-h3 s-lead s-body s-small s-caption s-mono s-muted s-accent` ·
layout `s-stack s-row s-grow s-center s-grid s-cols-2/3/4 s-split` · `s-card` (`is-accent`, `is-rail`) ·
`s-chip`, `s-pill` (`is-wait is-ok is-delegated is-info is-danger` — pair colour with a word and a shape) ·
`s-figure s-frame` · `s-list` · `s-placeholder` for skeletons.

## Performance

The stage is a fixed 1920 × 1080 canvas scaled to the window. Slide transitions and element animations move only
`transform` and `opacity` (plus `clip-path` for wipes) through the Web Animations API, so the browser runs them on
the GPU compositor; `will-change` is set only while a transition runs. The laser and lens move with `translate3d`.

## Themes

A theme provides `tokens.css`, `fonts.css` and `theme.css` that set the `--deck-*` roles; slides never use raw colours.
To refresh the KILN theme after the design system changes:

```sh
cp -r ../kiln/.specify/memory/design-system/tokens/* framework/themes/kiln/tokens/
node tools/tokens-to-css.mjs framework/themes/kiln/tokens framework/themes/kiln/tokens.css --name kiln
node tools/embed-fonts.mjs framework/themes/kiln
```

Fonts: Inter (SIL OFL) and Bitstream Charter (Bitstream licence) — licences in `framework/themes/kiln/fonts/`.
