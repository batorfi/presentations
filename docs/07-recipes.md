# 7 · Recipes — copy, paste, adapt

All snippets are slide files (`decks/<deck>/slides/NN-id.js`) unless noted. Class names use the kiln theme's content kit.

## Title slide (no title bar, centred)

```js
Deck.slide({
  id: "title", section: "opening", title: "Modern Software Engineering with ADLC", navTitle: "Title",
  titlebar: false, className: "p1-title-slide", background: "branches",
  html: `
    <p class="s-kicker">ADLC webinar series · Part 1 of 3</p>
    <h1 class="s-hero" data-anim="up">Modern Software Engineering</h1>
    <p class="s-lead" data-anim="up" data-delay="150">Foundations for the agentic development lifecycle</p>
  `,
});
```
`deck.css`: `.p1-title-slide { justify-content: center; }`

## Title + lead + three cards that appear one by one

```js
Deck.slide({
  id: "three-things", section: "why", title: "Three things change",
  html: `
    <h2 class="s-title">Three things change</h2>
    <p class="s-lead" data-anim="fade">What agents alter about everyday engineering.</p>
    <div class="s-grid s-cols-3">
      <div class="s-card" data-step="1" data-anim="up"><h3>Trust</h3><p>Who checks the work?</p></div>
      <div class="s-card" data-step="2" data-anim="up"><h3>Control</h3><p>Where does a person decide?</p></div>
      <div class="s-card" data-step="3" data-anim="up"><h3>Ownership</h3><p>Whose outcome is it?</p></div>
    </div>`,
  notes: "Trust → Control → Ownership.",
});
```

## Text left, picture right (`s-split`)

```html
<div class="s-split">
  <div class="s-stack"><h2 class="s-h2">Message</h2><p class="s-body">One idea.</p></div>
  <figure class="s-figure" data-anim="right"><img src="assets/diagram.svg" alt="Pipeline from idea to merge"><figcaption>Source: …</figcaption></figure>
</div>
```

## Points that focus one at a time

```html
<ul class="s-list" data-focus data-focus-release>
  <li>Specify</li><li>Delegate</li><li>Verify</li><li>Own</li>
</ul>
```
`data-focus="reveal"` hides future items; `data-focus-from="2"` lets a card appear at step 1 first.

## Status pills

```html
<span class="s-pill is-wait">● Waiting for review</span>
<span class="s-pill is-ok">✓ Merged</span>
<span class="s-pill is-delegated">→ Delegated to agent</span>
<span class="s-pill is-info">ⓘ Note</span>
<span class="s-pill is-danger">▲ Blocked</span>
```

## Inline SVG that draws itself and recolours with the theme

```html
<svg class="s-svg" viewBox="0 0 800 200" width="1200">
  <g data-step="1" data-anim="draw"><path class="line-muted" d="M40 100 H760" fill="none" stroke-width="4"/></g>
  <circle class="fill-accent" data-step="2" data-anim="pop" cx="400" cy="100" r="24"/>
</svg>
```

## Shared element between two slides (morph; load `morph.js`)

Slide A: `<div class="s-card" data-morph="arch" data-morph-fit="uniform"><h3>Architecture</h3></div>`
Slide B (bigger, elsewhere): same `data-morph="arch"`. Prefer `transition: "fade"` on both.

## Pan & zoom a huge diagram

```html
<div class="s-panzoom" data-height="fill" data-views="Overview=0,0,4000,2250; Planner=300,200,900,500">
  <img src="assets/platform-map.png" alt="Platform map">
</div>
```

## Quote that types itself

```html
<div class="s-typewriter" data-size="l" data-cps="16" data-width="62%" data-style="bar">
  <p>Code is cheap now. **Judgement** is not.</p><cite>Someone Wise</cite>
</div>
```

## A custom, step-driven visual

```js
Deck.slide({
  id: "lane", section: "what", title: "Walking the lane", steps: 4,
  html: `<h2 class="s-title">Walking the lane</h2><div class="p1-lane"><div class="p1-token"></div></div>`,
  onStep(step, dir, ctx) {
    ctx.play(ctx.$(".p1-token"), [{ transform: "translateX(var(--x, 0px))" }, { transform: `translateX(${step * 300}px)` }],
             { duration: 600, easing: "cubic-bezier(0.65,0,0.35,1)", fill: "forwards" });
  },
});
```
Rules: use `ctx.play`/`ctx.animate` (tracked & reduced-motion aware); `ctx.cleanup(fn)` for timers; derive state from `step`, not from history
(slides can be entered at any step). Full example: `decks/basic-tools/slides/05-custom.js`.

## Hide the title bar / add a section

`titlebar: false` on the slide. Sections: add `{ id, label }` to `Deck.configure({ sections })` and set `section: "id"` on slides.

## Add a deck to the landing page

In root `index.html` add inside `<main>`:
```html
<a class="card" href="decks/my-deck/"><b>My deck</b><span>One-line description.</span></a>
```

## Write a plugin

`framework/plugins/hello.js` — load with `<script src="../../framework/plugins/hello.js?v=…"></script>` before `menu.js`.

```js
/* hello — shows a badge on slides that set `hello: "text"`. Usage: Deck.slide({ …, hello: "Draft" }) */
(function () {
  "use strict";
  Deck.on("ready", () => {
    const { h } = Deck.helpers;
    const badge = h("div", { class: "deck-hello", hidden: true });
    Deck.el.stage.append(badge);
    Deck.on("slidechange", ({ index }) => {
      const text = Deck.slides[index].hello;
      badge.hidden = !text;
      badge.textContent = text || "";
    });
    Deck.addKeys(["j"], () => (badge.hidden = !badge.hidden), "Toggle hello badge", "View");
    Deck.hello = { get visible() { return !badge.hidden; } };
  });
})();
```
Add styles to `framework/deck.css` (`.deck-hello { position:absolute; right:24px; bottom:24px; z-index:6; … }`), document it in
[04-plugins.md](04-plugins.md) and the README, add a demo slide, run the smoke test, bump `?v=`.

## Add a background theme

Edit `framework/plugins/background.js`. A theme is a function `name(e)` inside the `THEMES` object returning `{ res, step(dt), draw(ctx), persistent? }`:

```js
dots(e) {                                  // e.rand() seeded PRNG · e.col.a / e.col.b / e.col.m colour strings · e.al(a) alpha scaled by intensity
  const pts = Array.from({ length: 40 }, () => ({ x: e.rand() * 1920, y: e.rand() * 1080, p: e.rand() * 6.28 }));
  let t = 0;
  return {
    res: 0.5,                              // canvas scale: 0.25 soft/blurry themes, 0.5 line work
    step(dt) { t += dt; },                 // simulate; dt in seconds (already × speed)
    draw(c) {                              // c = 2D context in 1920×1080 logical coordinates; canvas is cleared before each draw
      c.fillStyle = e.col.a;
      for (const p of pts) { c.globalAlpha = e.al(0.3 + 0.2 * Math.sin(t + p.p)); c.beginPath(); c.arc(p.x, p.y, 4, 0, 6.28); c.fill(); }
    },
  };
},
```
Then: add `dots: 1.3` to the `GAIN` table (tune visibility), list it in the header comment and in `docs`/README, add a demo slide in
`decks/backgrounds/`, and keep it cheap: **no per-frame allocations in hot loops, ≤ ~2 ms per frame**, batch strokes into one path per colour/alpha,
no `shadowBlur`, no big gradients every frame (use `res: 0.25` for soft looks). `persistent: true` keeps the canvas between frames
(for trails: fade with `globalCompositeOperation = "destination-out"`). Check `Deck.background.stats().avgCostMs`.

## Hash links for review

Share `…/decks/adlc-part1/#/12` to point a reviewer at slide 12.
