# Presentation framework — documentation

An **offline, single-page HTML presentation engine** plus the decks built on it. No server, no build step, no
dependencies: every deck is an `index.html` that opens from `file://` (or GitHub Pages) in any desktop browser.

These docs are written for two readers at once: **people** who author decks, and **AI harnesses** (Claude Code, Claude
Cowork, other coding agents) that author decks *with* them. Every page is plain Markdown, short sections, tables and copy-paste
snippets, so it can be scanned quickly. **If you are an AI agent, read this page and [`CHEATSHEET.md`](CHEATSHEET.md) first.**

## The 60-second mental model

```
presentations/
  framework/            the engine — NEVER edit for a single deck's needs
    deck.js             core: stage, navigation, steps, animations, title bar, hotkeys, settings
    deck.css            layout + the "s-*" content kit
    plugins/*.js|css    opt-in features (laser, draw, lens, spotlight, timer, morph, storyline, menu,
                        marquee, panzoom, typewriter, background)
    themes/kiln/        design tokens, fonts and the mapping to --deck-* roles
  decks/<name>/         one folder per presentation (decks/_template/ = starter, copied by tools/new-deck.py)
    index.html          loads engine + plugins + theme, calls Deck.configure, lists slide scripts in order
    slides/NN-id.js     one file per slide: a single Deck.slide({...}) call with an HTML template string
    deck.css            styles that belong to this deck only
    assets/             images, SVG, logo
  docs/                 this documentation
  tools/                token/font generators, smoke-test.py, new-deck.py
  index.html            landing page that links every deck
```

* The stage is a fixed **1920 × 1080** canvas scaled to fit the window. You design in those pixels.
* A deck is **data + HTML**: `Deck.configure({...})`, then one `Deck.slide({ id, section, title, html, ... })` per slide.
* Behaviour is declared with **`data-*` attributes** in the slide HTML (`data-step`, `data-anim`, `data-focus`, `data-morph`, …).
* Optional features are **plugins** loaded with a `<script>` tag. A deck loads only what it uses.
* Colours, fonts and sizes come from **`--deck-*` CSS variables** supplied by the theme. Slides never hard-code colours.

## Which page do I need?

| I want to… | Read |
|---|---|
| Understand how it works, the load order and slide lifecycle | [01-architecture.md](01-architecture.md) |
| Create a deck or add/edit slides | [02-authoring-slides.md](02-authoring-slides.md) |
| Look up a function, event, setting, hook or key binding | [03-api-reference.md](03-api-reference.md) |
| Use laser, draw, lens, spotlight, timer, morph, marquee, pan & zoom, typewriter, backgrounds, countdown lobby | [04-plugins.md](04-plugins.md) |
| Change colours/fonts, build a theme, style a single deck | [05-theming.md](05-theming.md) |
| Work interactively with an AI harness (workflow, verification, deploy) | [06-working-with-ai-harnesses.md](06-working-with-ai-harnesses.md) |
| Copy a ready pattern (title slide, two columns, code focus, custom visual, new plugin…) | [07-recipes.md](07-recipes.md) |
| Start a new deck from the template (`tools/new-deck.py`) | [09-deck-template.md](09-deck-template.md) |
| Fix something that does not work | [08-troubleshooting.md](08-troubleshooting.md) |
| One page with everything essential | [CHEATSHEET.md](CHEATSHEET.md) |

## Golden rules (the ones that prevent most mistakes)

1. **One slide = one file** in `decks/<deck>/slides/`, numbered (`07-beyond-vibe.js`), and **listed in that deck's `index.html` in
   the order they are presented**. A slide not listed does not exist.
2. **Never edit `framework/` to satisfy one deck.** Put deck-specific CSS in `decks/<deck>/deck.css`, prefixed with a deck
   abbreviation (`.p1-…`). Promote a pattern into `framework/deck.css` only once a second deck needs it.
3. **No hard-coded colours or fonts** in slides — use `s-*` classes and `var(--deck-…)`.
4. **Animate only `transform` and `opacity`** (the engine does; keep custom code the same). Respect reduced motion
   (`ctx.reduced()`).
5. **Offline only**: no CDN links, no web fonts, no `fetch()` of local files (`file://` forbids it). Inline SVG when it must be
   styled/animated; images by relative path.
6. **Content area is 1680 × ~848 px** (with title bar) — keep slides sparse; overflow is a bug (`tools/smoke-test.py` flags it).
7. After changing framework files, **bump the cache-bust `?v=` suffix** in deck `index.html` files (browsers and GitHub Pages
   cache aggressively) — see [06](06-working-with-ai-harnesses.md#cache-busting).
8. **Verify before claiming done**: run `python3 tools/smoke-test.py decks/<deck>` and look at screenshots.

## Repo facts

* Remote: `github.com/batorfi/presentations`, published via GitHub Pages at `https://batorfi.github.io/presentations/`
  (deck URLs: `…/decks/<name>/`). `.nojekyll` is present.
* The theme (KILN design system) is generated from `batorfi/kiln` tokens — see [05-theming.md](05-theming.md).
* Demo decks double as living documentation of every feature: `basic-tools`, `focus-morphs`, `branding-typewriter`,
  `backgrounds`, `countdown-demo` (10 lobby visuals), `slide-patterns` (10 diagram patterns × 2 variants — copy a slide as a starting point), `slide-patterns-2` (16 more: orbit, sunburst, radar, honeycomb, Sankey, metro, funnel, gauges …). `eng-infographics` (22 technical infographics for software engineers — HTTP, TLS, OAuth, CI/CD, Kubernetes, CAP, B-trees, RAG … — each with a one-line takeaway and a step-by-step build; copy a slide as a starting point for your own explainers). The real series deck is `adlc-part1` (ADLC webinar series, Part 1 — Foundations; skeleton slides).
