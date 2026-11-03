# 1 · Architecture — how it works

## Files and load order

A deck's `index.html` loads, in this order (order matters):

1. **Theme CSS** — `themes/kiln/fonts.css`, `tokens.css`, `theme.css` (define `--deck-*` roles).
2. **Engine CSS** — `framework/deck.css`, `plugins/tools.css`, then the deck's own `deck.css`.
3. **`framework/deck.js`** — defines `window.Deck`.
4. **Plugins** — each is an IIFE that registers itself via `Deck.on("ready", …)`. `tools.js` first (shared bookkeeping), then any of
   `laser draw lens spotlight morph timer marquee panzoom typewriter background storyline`, and **`menu.js` last**
   (its right-click menu reads what the other plugins registered).
5. **`Deck.configure({...})`** inline script.
6. **Slide scripts** `slides/01-….js` … each calling `Deck.slide({...})`; the array order is the presentation order.

`deck.js` waits for `DOMContentLoaded`, builds the DOM from the registered slides, emits `ready` (plugins initialise here),
waits for fonts, then goes to the slide in the URL hash (default slide 1) and adds `body.deck-ready`.

## The stage

```
body
└─ .deck-viewport
   ├─ .deck-stage          1920×1080, scaled by Deck.scale and centred (letterboxed); overflow hidden
   │  ├─ canvas.deck-bg     (background plugin) animated backdrop, z-index 0
   │  ├─ .deck-slides       holds one <section class="deck-slide"> per slide (only the current one is visible)
   │  └─ header.deck-titlebar  dark rail: logo · section label + title · progress ticks · counter · timer
   ├─ .deck-ui             scaled overlay for modals (storyline, help) — not magnified by the lens
   └─ .deck-overlay        unscaled screen-space layer for laser, draw canvas, lens, spotlight, menu
```

* Slides are absolutely positioned flex columns: `padding: 160px 120px 72px` (96 px title bar + 64 px) or
  `72px 120px` for `titlebar:false`; `gap: 28px`; opaque `--deck-bg` background (transparent when a background animation is active).
* Screen coordinates → stage coordinates: `Deck.toStage(clientX, clientY)`; `Deck.scale`, `Deck.offset`.
* All motion is **transform / opacity / clip-path** through the Web Animations API (compositor-friendly).

## State and navigation

* `Deck.state = { index, step, busy }`. A slide has `stepCount(i)` steps: the max of `def.steps`, every `data-step` /
  `data-out-step`, and the focus groups. → plays the next step, then moves to the next slide; ← reverses.
* `Deck.go(index, step | "last")`, `next()`, `prev()`, `first()`, `last()`.
* The location hash mirrors position: `#/7.2` = slide 7, step 2. Reload restores it; editing the hash navigates.
* Entering a slide: `applyStepInstant` sets the final state for that step (so jumping/going back is exact), then `data-anim`
  elements without `data-step` play their entrance after the slide transition has started (`dir === forward`).
* Leaving: elements with `data-out` (no step) animate out first (forward only), then `onLeave`, then the transition.

### Slide lifecycle (in order)

```
build():   def.setup(ctx)                          once, DOM exists, slide hidden
go():      emit beforeleave → data-out elements → ctx cleanups → def.onLeave
           applyStepInstant(target) → show → state.index/step = target → title bar → hash
           emit beforeenter (after display, before animation)
           def.onEnter(ctx, {from, dir})
           emit slidechange → autos animate → slide transition runs
step:      def.onStep(step, dir, ctx)  +  emit stepchange   (dir: forward | backward | jump)
```

`ctx.cleanup(fn)` callbacks run when the slide is left — register timers/loops/listeners there.

## Events (`Deck.on(name, fn)` / `Deck.off` / `Deck.emit`)

| Event | Payload | When |
|---|---|---|
| `ready` | `Deck` | DOM built; plugins initialise here |
| `beforeleave` | `{index, to, dir, step}` | about to leave `index` |
| `beforeenter` | `{index, from, dir, step}` | target displayed, not yet animated (not on first load) |
| `slidechange` | `{index, from, dir, step}` | slide became current (also fired for the first slide) |
| `stepchange` | `{index, step, dir}` | a step was applied |
| `settings` | `{key, value}` | `Deck.setSetting` was called |
| `theme` | `"light" \| "dark"` | theme switched |
| `resize` | `{scale, x, y}` | window refit |
| `escape` | — | Esc pressed with nothing to close |

## Settings

`Deck.settings` (persisted in `localStorage["deck.settings.v1"]`, wrapped in try/catch — works without storage):
`theme, laserColor, laserSize, laserTrail, inkColor, inkWidth, inkShape, lensSize, lensWidth, lensZoom, spotSize, spotWidth,
spotShape, spotDim, spotBorder, timerMinutes, reducedMotion, backgroundMode ("on"|"still"|"off")`.
Change with `Deck.setSetting(key, value)` (emits `settings`). **Reduced motion** = the setting *or* the OS preference;
check with `ctx.reduced()`. All engine animations collapse to instant under it.

## Keyboard

Plugins register keys with `Deck.addKeys(keys, fn, label, group, opts)`; the `?` help overlay lists them automatically.
Key identity strings: `"a"`, `"Shift+s"`, `"Mod+z"`, `"ArrowRight"`, `" "`. A capture-phase handler can claim keys:
`Deck.keyTrap = (e) => true` (returning `true` consumes the event; used by the storyline modal). `Deck.pushLayer(name, close)` /
`popLayer` register closable popups so Esc closes the top one; `Deck.hasLayer()` tells whether any is open.

## Rendering rules to remember

* The **title bar is always dark** in both themes — logos must read on dark.
* `.deck-hidden` (opacity 0 + visibility hidden) is the hidden state of stepped elements; don't style it away.
* The **lens** clones the stage; canvas content is copied, video is not.
* A `contain: layout paint` stage clips anything outside 1920×1080.
