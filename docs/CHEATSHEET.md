# Cheat sheet — everything essential on one page

## Create a deck
```
python3 tools/new-deck.py my-deck --title "My deck" --prefix md --minutes 45     # copies decks/_template, adds landing card
```
Then fill `decks/my-deck/BRIEF.md` with the author, edit `index.html` (sections, logo, plugins, slide `<script>` tags **in order**) and the slides in `slides/`.
Details: [09-deck-template.md](09-deck-template.md).

## index.html skeleton
```html
<link rel="stylesheet" href="../../framework/themes/kiln/fonts.css">
<link rel="stylesheet" href="../../framework/themes/kiln/tokens.css">
<link rel="stylesheet" href="../../framework/themes/kiln/theme.css">
<link rel="stylesheet" href="../../framework/deck.css">
<link rel="stylesheet" href="../../framework/plugins/tools.css">
<link rel="stylesheet" href="deck.css">
<script src="../../framework/deck.js"></script>
<script src="../../framework/plugins/tools.js"></script>   <!-- then laser, draw, highlighter, lens, spotlight, timer, morph, marquee, panzoom, typewriter, background, countdown, storyline -->
<script src="../../framework/plugins/menu.js"></script>     <!-- menu LAST among plugins -->
<script>Deck.configure({ title, theme:"light", transition:"slide", timer:{minutes:50}, logo:{src:"assets/logo.svg",alt:"X",height:40},
  background:"aurora" /*optional deck default*/, sections:[{id:"intro",label:"Intro"}] });</script>
<script src="slides/01-title.js"></script> …
```

## One slide (file `slides/NN-id.js`)
```js
Deck.slide({
  id: "challenge", section: "why", title: "The challenge",   // title is required
  navTitle: "Challenge", titlebar: true, className: "p1-x", transition: "fade",
  background: "circuit",            // or {theme,intensity,speed,seed,colors} or "none"  (needs plugins/background.js)
  html: `<h2 class="s-title">…</h2><p class="s-lead" data-anim="fade">…</p>
         <div class="s-card" data-step="1" data-anim="up">…</div>`,
  notes: "speaker notes",
  steps: 0,                                         // extra steps for custom visuals (data-step counted automatically)
  setup(ctx){}, onEnter(ctx,{from,dir}){}, onStep(step,dir,ctx){}, onLeave(ctx,{to,dir}){},
});
```

## Stage & layout
1920×1080 px. Padding 120 px left/right → **content width 1680**. With title bar content height ≈ **848** (top 160, bottom 72);
without (`titlebar:false`) ≈ 936. Slide = flex column, gap 28.

## Element attributes
| Attribute | Effect |
|---|---|
| `data-anim="fade\|up\|down\|left\|right\|zoom\|pop\|rise\|wipe\|wipe-down\|blur\|draw"` | entrance preset (`draw` traces SVG strokes) |
| `data-step="N"` | appears at step N (→ press) |
| `data-delay="ms"` `data-duration="ms"` | stagger / pace |
| `data-out-step="N"` `data-out="preset"` | leaves at step N (or before the slide leaves if no step) |
| `data-focus` / `="reveal"` on a list | each → focuses next child; `data-focus-from`, `data-focus-release`, `data-focus-items` |
| `data-morph="key"` (+`-fit`,`-duration`,`-delay`) | same key on two slides = shared-element move (plugin `morph.js`) |
| `s-marquee` `data-size data-wpm data-width…` | scrolling headline (`marquee.js`) |
| `s-panzoom` `data-views data-bleed data-fit…` | pan/zoom large image (`panzoom.js`) |
| `s-typewriter` `data-size data-cps data-style…` | typed text (`typewriter.js`) |

## Content kit (`framework/deck.css`)
Text: `s-kicker s-hero s-title s-h2 s-h3 s-lead s-body s-small s-caption s-mono s-muted s-accent` ·
Layout: `s-stack s-row s-grow s-center s-grid s-cols-2|3|4 s-split` · Blocks: `s-card (is-accent|is-rail) s-chip s-pill (is-wait|is-ok|is-delegated|is-info|is-danger) s-figure s-frame s-list s-placeholder` ·
Inline SVG: `<svg class="s-svg">` with `.ink .accent .fill-accent .fill-raised .fill-subtle .line-muted`.

## Keys (presenting)
→/Space/PgDn next · ←/PgUp prev · Home/End · **G/O** storyline · **F** fullscreen · **K** countdown lobby · **T** theme · **L** laser · **H** highlighter (wheel or [ ] width, M keep/fade, C colour, U undo, X clear) · **D** draw (1–5 shapes, C colour, X clear, U undo) ·
**Z** lens · **S** spotlight · **P** timer · **B** background Animated/Still/Off · **E** panzoom explore · **Y** retype · **?** help · Esc close · Right-click menu.
URL hash `#/7.2` = slide 7 step 2.

## Background themes (20)
constellation flow aurora ripples grid orbits waves circuit contours bokeh network hexgrid metro lattice branches pcb facets radar zodiac lanes

## ctx (hook argument)
`ctx.el ctx.$(sel) ctx.$$(sel) ctx.step ctx.maxStep ctx.animate(el,preset,"in|out",opts) ctx.play(el,frames,opts) ctx.wait(ms) ctx.reduced() ctx.cleanup(fn)`

## Verify
```
python3 tools/smoke-test.py decks/my-deck --shots /tmp/shots     # errors + overflow + screenshots
```
Then `git add -A && git commit && git push` → Pages deploys in ~1 min. Bump `?v=` after framework edits.
