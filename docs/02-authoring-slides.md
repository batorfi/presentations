# 2 · Authoring decks and slides

## Create a deck

1. **Preferred:** `python3 tools/new-deck.py my-deck --title "My deck"` — copies the runnable starter `decks/_template` (see [09](09-deck-template.md)),
   adds the landing-page card. Manual alternative: `cp -r decks/_template decks/my-deck` and replace `{{TITLE}}` / `tpl-` yourself.
2. Edit `decks/my-deck/index.html`:
   * `<title>`, and `Deck.configure({...})` (below).
   * Keep only the plugin `<script>` tags you need; keep `menu.js` last; keep `tools.js` first if you use any pointer tool.
   * List each slide `<script src="slides/NN-id.js">` in presentation order.
3. The script adds the landing card; if you copied manually, add a card to the root `index.html` linking `decks/my-deck/`.
4. Verify with `python3 tools/smoke-test.py decks/my-deck`.

```js
Deck.configure({
  title: "ADLC · Part 1",            // document + title bar fallback
  theme: "light",                     // "light" | "dark"  (T toggles while presenting)
  transition: "slide",                // "slide" | "fade" | "none" — deck default; override per slide
  timer: { minutes: 50 },             // timer default (timer.js)
  logo: { src: "assets/logo.svg", alt: "NewCo", height: 40 },   // or { placeholder: true, label: "LOGO" }
  background: "aurora",               // optional default animated background (background.js)
  morph: { reach: 1 },                // morph.js: how far apart two slides may be (1 neighbours, Infinity any, 0 off)
  sections: [ { id: "opening", label: "Opening" }, { id: "why", label: "Why" } ],  // grouping in title bar + storyline
});
```

## A slide

One file, one call. `title` is the only required field.

```js
Deck.slide({
  id: "challenge",            // stable id (data-id on the section); defaults to "s<N>"
  section: "why",             // matches a sections[].id
  title: "The challenge",     // title bar + storyline + aria-label
  navTitle: "Challenge",      // optional shorter label for the storyline
  titlebar: true,             // false hides the dark title bar (title / full-bleed slides)
  className: "p1-challenge",  // extra classes on the <section> (deck-specific styling hooks)
  transition: "fade",         // per-slide override
  background: "circuit",      // string | {theme,intensity,speed,seed,colors} | "none"
  html: `…`,                  // string, or function(def) returning a string
  notes: "Speaker notes…",    // kept with the slide (shown nowhere yet; used as the outline)
  steps: 0,                   // extra steps beyond the data-step ones (custom visuals)
  setup(ctx) {},              // once, after the DOM is built
  onEnter(ctx, { from, dir }) {},
  onStep(step, dir, ctx) {},  // dir: "forward" | "backward" | "jump"
  onLeave(ctx, { to, dir }) {},
});
```

> **Skeleton convention used in `adlc-part1`:** early slides contain `<div class="s-placeholder">` + the outline in `notes`.
> Replace the placeholder with real content when designing the slide.

## Layout budget

| Area | Size |
|---|---|
| Stage | 1920 × 1080 |
| Content width | 1680 (120 px side padding) |
| Content height, with title bar | ≈ 848 (160 top, 72 bottom) |
| Content height, `titlebar:false` | ≈ 936 (72 top/bottom) |
| Title bar | 96 px, dark |
| Type scale (kiln theme) | hero 112 · h1 76 · lead 36 · body 30 px; minimum comfortable ≈ 24 px |

Design for a **shared screen on a call** (Teams): large type, ≤ 6 lines of text, one idea per slide, steps for reveals.

## Content kit

| Group | Classes |
|---|---|
| Text | `s-kicker` (small caps label) · `s-hero` · `s-title` (h1) · `s-h2` · `s-h3` · `s-lead` (intro sentence) · `s-body` · `s-small` · `s-caption` · `s-mono` · `s-muted` · `s-accent` |
| Layout | `s-stack` (column) · `s-row` (row, centred) · `s-grow` (fill) · `s-center` · `s-grid` + `s-cols-2/3/4` · `s-split` (5fr/7fr) |
| Blocks | `s-card` (`is-accent`, `is-rail`) · `s-chip` / `s-pill` (`is-wait is-ok is-delegated is-info is-danger`) · `s-list` · `s-figure` (caption) · `s-frame` · `s-placeholder` |
| Inline SVG | `<svg class="s-svg">`; children classes `.ink .accent .fill-accent .fill-raised .fill-subtle .line-muted` |

Pills/states: **always pair colour with a word and a shape** (`● Waiting`, `✓ Merged`) — never colour alone.

## Animating elements

Add attributes to any element in the slide `html`:

| Attribute | Meaning |
|---|---|
| `data-anim="up"` | entrance when the slide opens (no `data-step`) |
| `data-step="2"` | hidden until step 2, then enters (default `fade`; combine with `data-anim`) |
| `data-delay="150"`, `data-duration="800"` | ms |
| `data-out-step="4"`, `data-out="down"` | leaves at step 4 |
| `data-out="fade"` (no step) | leaves just before the slide does |

Presets: `fade up down left right zoom pop rise wipe wipe-down blur draw`.
Steps are counted automatically; **don't number gaps** (steps 1, 2, 4 would create an empty step 3).

### Line-by-line focus

```html
<ul class="s-list" data-focus data-focus-release>
  <li>First point</li><li>Second point</li><li>Third point</li>
</ul>
```
Each → focuses the next child and dims the rest. Variants: `data-focus="reveal"` (future items hidden), `data-focus-from="2"`
(first focus at step 2, to combine with other `data-step`s), `data-focus-release` (one extra step restores everything),
`data-focus-items=".point"` (selector instead of direct children).

### Shared-element morphs (needs `plugins/morph.js`)

Same `data-morph="key"` on two slides → the element travels and resizes between them (and back). Options:
`data-morph-fit="uniform"` for pictures/SVG/text, `-duration`, `-delay`. A morph element is not animated by `data-anim`/`data-out`.
Fade transitions look cleanest with morphs.

### Images and SVG

* PNG/JPEG: `<img src="assets/x.png" alt="…">`; `<figure class="s-figure">` for a caption; `class="cover"` crops to fill.
* SVG: file via `<img>` for static pictures; **inline `<svg class="s-svg">`** to theme-colour and animate parts with steps
  (`file://` cannot fetch SVG text).
* Large pictures to explore: `s-panzoom` (see [04](04-plugins.md#pan-and-zoom)).

### Custom visuals (JS-driven)

Declare `steps: N`, build HTML in `html`, drive it in `onStep(step, dir, ctx)`:

```js
onStep(step, dir, ctx) {
  const el = ctx.$(".token");
  ctx.play(el, [{ transform: "translateX(0)" }, { transform: `translateX(${step*200}px)` }], { duration: 600 });
}
```
`ctx.play` animations are tracked so fast navigation can fast-forward them. Use `ctx.cleanup(fn)` for timers/loops.
A complete example: `decks/basic-tools/slides/05-custom.js`.

## Styling a deck

Deck-only CSS goes in `decks/<deck>/deck.css`, prefixed (`.p1-…`, `.demo-…`), using theme variables:

```css
.p1-title-slide { justify-content: center; }
.p1-card { background: var(--deck-raised); border: 1px solid var(--deck-border); border-radius: var(--deck-radius); }
```
See [05-theming.md](05-theming.md) for the variable list.

## Authoring checklist (per slide)

* One message; title that states it. ≤ 6 text lines; type ≥ 24 px.
* Reveals via steps, not walls of text; keep steps ≤ ~6.
* All colours via classes/variables; light **and** dark both legible (press T).
* Alt text on images; meaningful `notes` (the speaker's outline).
* No overflow (`tools/smoke-test.py`), no console errors.
* Listed in `index.html` in the right order; `section` matches a configured section.
