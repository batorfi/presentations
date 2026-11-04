# 4 · Plugins

Each plugin is one file in `framework/plugins/`, loaded by a `<script>` tag **after `deck.js`** (and `menu.js` last). Load only
what the deck uses. Pointer tools need `tools.js` + `tools.css`.

| Plugin | Load | Purpose |
|---|---|---|
| tools | `tools.js`, `tools.css` | shared bookkeeping for the four pointer tools (always load with them) |
| laser | `laser.js` | **L** — glowing dot + optional trail |
| draw | `draw.js` | **D** — annotate live: ellipse/rect/line/arrow/curve; cleared when you leave the slide |
| lens | `lens.js` | **Z** — magnifier following the mouse |
| spotlight | `spotlight.js` | **S** — dims everything except a window under the mouse |
| timer | `timer.js` | **P** countdown in the title bar |
| morph | `morph.js` | shared-element transitions between slides |
| storyline | `storyline.js` | **G/O** — modal map of all slides by section; type a number to jump |
| menu | `menu.js` | right-click menu + `?` shortcut help (**load last**) |
| marquee | `marquee.js` | scrolling headline |
| panzoom | `panzoom.js` | pan & zoom large images/SVG |
| typewriter | `typewriter.js` | text that types itself |
| background | `background.js` | animated algorithmic backgrounds (20 themes) |

Common behaviours: pointer tools draw in screen space (not magnified by the lens); settings persist; reduced motion disables motion.

## Pointer tools (laser · draw · lens · spotlight)

Presenter-only live tools — nothing to author in slides. Settings (menu or `Deck.setSetting`): `laserColor laserSize(s|m|l) laserTrail`,
`inkColor inkWidth(s|m|l) inkShape`, `lensWidth lensSize lensZoom(2–4)`, `spotWidth spotSize spotShape(circle|rect) spotDim(0.5–0.9)
spotBorder(animated|static)`. Spotlight and lens exclude each other; spotlight works with the laser.

## Timer

`Deck.configure({ timer: { minutes: 50 } })`. P start/pause/resume · Shift+P stop · R restart. Ring in the title bar: teal →
amber (last 20 %) → red (last 5 %); counts overrun after zero; survives reload. Title-bar-less slides show a small chip.

## Morph — shared-element transitions

```html
<!-- slide 3 -->  <div class="s-card" data-morph="arch"><h3>Architecture</h3></div>
<!-- slide 4 -->  <div class="s-card big" data-morph="arch"><h3>Architecture</h3><p>More…</p></div>
```
`data-morph-fit="uniform"` (pictures/SVG/text), `data-morph-duration`, `data-morph-delay` (stagger). Config `morph:{reach}`.
Skipped under reduced motion. Only visible elements morph. Rules depending on sibling order or `:hover` don't carry to the clone.
Demos: `decks/focus-morphs/slides/06…15`.

## Marquee — scrolling headline

```html
<div class="s-marquee" data-size="xl" data-wpm="120">Agents write the code. Engineers own the outcome.</div>
```
| Attribute | Meaning |
|---|---|
| `data-size` | `s m l xl` = 56 / 88 / 136 / 208 px |
| `data-wpm` | reading pace (default 120); speed clamped 60–260 px/s |
| `data-width` | CSS length or `bleed` (full stage width) |
| `data-height`, `data-align="center"`, `data-direction="ltr"`, `data-gap` (em), `data-fade="none"` | layout/behaviour |
| classes `is-rail` `is-accent` | dark band / accent text |

Seamless loop, restarts when the slide shows, runs only while on screen; static wrapped text under reduced motion.

## Pan & zoom

```html
<div class="s-panzoom" data-height="640px" data-views="Overview=0,0,4000,2250; Detail=1200,800,900,500">
  <img src="assets/big-map.png" alt="…">
</div>
```
Size: `data-width`/`data-height` (any CSS length, `fill` for remaining height), `data-aspect="16/9"`, `data-bleed` (whole area under the title bar —
use alone on a slide). `data-fit="contain|cover|width|height"`, `data-max-zoom` (default 4× picture size), `data-views="Name=x,y,w,h; …"` (picture pixels,
keys 1–9), `data-content-width/-height`, `data-minimap="off"`, `data-minimap-size`, `data-badge="off"`.
Mouse: drag pans, wheel/pinch zooms to pointer, double-click toggles. Keyboard: arrows keep changing slides; **E**, click, or Enter over it starts
*explore* (arrows pan, `+ −` zoom, `0` fit, `O` 100 %, `1–9` views, Esc/E leaves). Resets on slide change.

## Typewriter

```html
<div class="s-typewriter" data-size="l" data-cps="16" data-width="62%" data-style="bar">
  <p>Code is cheap now. **Judgement** is not.</p>
  <cite>Someone Wise</cite>
</div>
```
`data-size s|m|l|xl` (36/48/68/96 px) or `data-font-size`; `data-cps` (2–120); `data-rhythm="steady|natural"` (natural is deterministic);
`data-width`, `data-align`, `data-text-align`; `data-font serif|sans|mono`; `data-style bar|panel|rail`; `data-delay`; `data-cursor
bar|block|underscore|none`, `data-cursor-end="hide"`; `data-replay="off"`, `data-skip="off"`. Emphasis: `**x**`, `<em> <strong> <mark>`;
`<cite>`/`<footer>`/`.s-tw-by` = attribution typed last. Several on a slide type in sequence. Next-key finishes the text, next press moves on; **Y** retypes.
Whole text is laid out from the start (no reflow). Screen readers get all text; reduced motion shows it finished.

## Animated backgrounds

```js
Deck.configure({ background: "aurora" });                         // deck default
Deck.slide({ …, background: "circuit" });                          // this slide
Deck.slide({ …, background: { theme: "flow", intensity: 1.4, speed: 0.7, seed: 3, colors: ["#0F7B6C", "#3B6FB6"] } });
Deck.slide({ …, background: "none" });                             // plain slide
```
**Themes (20):** `constellation flow aurora ripples grid orbits waves circuit contours bokeh network hexgrid metro lattice branches pcb facets radar zodiac lanes`.

| Option | Meaning |
|---|---|
| `theme` | one of the names above (unknown → console warning, no background) |
| `intensity` | visibility multiplier (default 1; 0.3 whisper … 2 strong) |
| `speed` | pace multiplier (default 1) |
| `seed` | different random layout, identical every time |
| `colors` | 1–3 CSS colours (default: `--deck-accent`, `--deck-info`, `--deck-text-2`) |

Behaviour: one half-resolution `<canvas class="deck-bg">` behind the slides; a radial mask keeps the middle quiet and the edges stronger;
slides with a background get `.has-bg` (transparent). A new theme fades in after the slide settles; the same theme on the next slide carries on.
**Mode** (menu → View → Background, or **B**): Animated → Still → Off (persisted as `backgroundMode`). Reduced motion = one still frame.
**CPU safety:** 30 fps cap, per-theme canvas scale (0.25–0.5), pauses in hidden tabs and while a pointer tool is on (not on window blur —
Teams screen-share blurs the window), governor lowers 30 → 20 → 12 fps then still if frames run long. `Deck.background.stats()` reports it.
Adding a theme: see [07-recipes.md](07-recipes.md#add-a-background-theme). Demo: `decks/backgrounds/`.

## Countdown lobby

`countdown.js` adds a full-screen "The presentation is about to begin in…" screen for the minutes before the talk: headline, big digits, deck title, author and duration, with a generative visual that shows how much time is left. At zero it celebrates (confetti, "Let’s begin") and waits for you; **Begin** (→ / Enter) closes it and replays slide 1's entrance.

```js
Deck.configure({ countdown: { title: "ADLC · Part 1", author: "Zsolt Batorfi", duration: "90 minutes",
                              minutes: 5, visual: "hourglass", show: false } });
```
All options are optional: `title` (default deck title), `author`, `duration` (default timer length), `minutes` (initial time, default **5**), `headline`, `startText`, `visual`, `show` (open at load), `autoStart`, `startTimer` (start the talk timer on Begin). `?lobby` in the URL also opens it.

Keys in the lobby: Space start/pause · `+`/`−` ±5 min · `V`/`Shift+V` next/previous visual · `R` reset · → / Enter begin · `K`/Esc close. `K` toggles it from any slide. Load `countdown.js` before `typewriter.js`/`panzoom.js` and `menu.js`.

Ten visuals (choice is remembered in the `countdownVisual` setting): `hourglass`, `tide`, `mosaic`, `fuse`, `summit`, `pendulum`, `puzzle`, `assembly`, `dominoes`, `sunrise`. The timer uses the wall clock, survives reloads, and drops to one frame per second under reduced motion. API: `Deck.countdown.{open, close, toggle, begin, start, pause, reset, adjust, setRemaining, visual, visuals, isOpen, state, stats}`.

## Storyline and menu

Storyline (G/O): modal listing slides grouped by section; arrows + Enter, or type a number then Enter. Menu (right-click): navigation, tools and their
settings, timer, view (theme, motion, background, fullscreen), help. The menu reads other plugins' registrations when opened, so load order only
matters in that `menu.js` should come after `Deck` exists.

## Writing your own plugin

See [07-recipes.md](07-recipes.md#write-a-plugin). Pattern: an IIFE; `Deck.on("ready", () => { … })`; read `Deck.slides[i].yourField`
and `Deck.config.yourKey`; react to `slidechange/beforeleave/theme/settings`; `Deck.addKeys` for hotkeys; expose `Deck.yourPlugin`; add styles in
`deck.css` or a plugin CSS file; only transform/opacity animation; honour `Deck.context(i).reduced()`; pause when `document.hidden`.
