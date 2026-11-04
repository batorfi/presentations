# 6 · Working with AI harnesses (Claude Code, Claude Cowork, others)

This repo is meant to be co-authored: a person decides *what to say*, an agent builds slides, and both look at the result **side by side**
(editor/agent on one half, the deck in a browser on the other). This page is the workflow and the rules for the agent.

## Orientation checklist for an agent starting a session

1. Read `docs/README.md` and `docs/CHEATSHEET.md` (≈ 5 minutes). For a **new deck** read [09-deck-template.md](09-deck-template.md) and start from `tools/new-deck.py`. Skim `docs/02-authoring-slides.md` for the task.
2. `ls decks/` and open the target deck's `index.html` (slide order, plugins, config) and `deck.css` (its classes).
3. Look at 1–2 existing slides in the same deck for tone, density and class usage; reuse before inventing.
4. Never edit `framework/` unless the user asked for an engine/plugin change.
5. Ask the user when intent is unclear (message, audience, depth) — one short question beats a rework.

## Side-by-side loop

No server or build is required.

1. **Open the deck** in a desktop browser: the file `decks/<deck>/index.html` (double-click, or `file://…` URL), or the live Pages URL
   `https://batorfi.github.io/presentations/decks/<deck>/`. Keep it on one half of the screen; **F** is fullscreen, **?** lists shortcuts.
2. Jump straight to a slide with the hash: `index.html#/7` (slide 7) or `#/7.2` (slide 7, step 2). Reload after each change — the hash keeps your place.
3. The agent edits `slides/NN-id.js` / `deck.css`; the person reloads and reacts ("make the cards smaller", "reveal one by one").
4. When the person approves a slide, move to the next. Keep slides **skeleton → content → polish** (placeholders are fine early).
5. Before reporting done: run the smoke test (below) and look at screenshots of the changed slides.
6. Commit and push when asked (Pages publishes in ~1 minute).

Tip: use **G** (storyline) to navigate, **T** to check dark mode, **B** to check backgrounds, the right-click menu to toggle Reduced motion.

## Typical tasks → what to touch

| Task | Files |
|---|---|
| New slide | create `decks/<d>/slides/NN-id.js` (renumber neighbours if inserting), add `<script src>` in `index.html` at the right position |
| Reorder slides | change the order of `<script>` tags in `index.html` (file numbers are just names; renaming is optional but keep them in sync) |
| Remove slide | delete the `<script>` tag (and the file) |
| Reveal items one by one | `data-step` on elements, or `data-focus` on a list |
| Slide-specific style | `decks/<d>/deck.css` with a `.xx-` prefix; add `className` on the slide |
| Image | put in `decks/<d>/assets/`, reference relatively; give `alt` |
| Animated background | add `plugins/background.js` to `index.html`, then `background: "<theme>"` on slides or in `Deck.configure` |
| New deck | `python3 tools/new-deck.py <slug> --title "…"` then follow [09](09-deck-template.md) |
| Engine/plugin change | edit `framework/…`, **bump `?v=`**, run smoke tests on *all* decks (see below) |

## Verification

```sh
pip install playwright            # once; plus a Chrome/Chromium
python3 tools/smoke-test.py decks/<deck> --shots /tmp/shots [--chrome /usr/bin/google-chrome]
```
It loads the deck headless at 1920×1080, visits every slide, presses through every step, collects page/console errors, flags content that
overflows the slide, and saves a PNG per slide. Open the PNGs of changed slides and check: nothing clipped, hierarchy clear, both themes
if the slide uses custom colours. After engine changes run it for every deck (`for d in decks/*/; do python3 tools/smoke-test.py $d; done`).

Notes: headless software rendering makes performance numbers indicative only; Firefox/Safari are not covered by the script — mention that.

## Cache-busting

Browsers and GitHub Pages cache `.js`/`.css` for minutes. Deck pages load framework files as `…/framework/deck.js?v=20261104a`. After you change
anything under `framework/`, bump that suffix in every `decks/*/index.html`, e.g.:

```sh
sed -i -E 's#(\.\./\.\./framework/[^"?]+\.(js|css))\?v=[A-Za-z0-9]+"#\1?v=NEWVERSION"#g' decks/*/index.html
```
Without this a viewer can run a stale plugin ("my new theme doesn't animate" was exactly this).
Slide files that are *new* don't need it; edited slide/deck files may — a hard refresh (Ctrl/Cmd+Shift+R) always works.

## Commit and publish

* Remote `origin` → `github.com/batorfi/presentations`, branch `main`; GitHub Pages builds on push (`gh run list -R batorfi/presentations -L 1`).
* Small, focused commits: "Part 1: slide 7 content", "Add X plugin". Don't commit `node_modules/` or screenshots.
* Follow any attribution/trailer rules given by the harness or the user's CLAUDE.md.

## Do / Don't for agents

| Do | Don't |
|---|---|
| Reuse `s-*` classes and `--deck-*` variables | hard-code colours, fonts, pixel sizes that fight the theme |
| One slide per file, listed in order | put several slides in one file or leave slides unlisted |
| Use `data-step`/`data-focus` for reveals | build long text walls or manual show/hide JS when attributes suffice |
| Keep deck CSS in the deck, prefixed | edit `framework/deck.css` for one slide |
| Use inline SVG for diagrams that animate | `fetch()`/XHR local files, load CDN scripts or web fonts |
| Honour reduced motion in custom JS | start timers/rAF loops without `ctx.cleanup` |
| Ask when the message is unclear | invent claims, numbers, quotes or logos |
| Keep slides readable on a shared Teams screen | shrink text below ~24 px to fit more |

## Content guidance for the ADLC series

`decks/adlc-part1` (21 slides) is the *Modern Software Engineering with Agentic Development Lifecycle Management* webinar, Part 1 — Foundations (Teams, 90 min,
for all SWE roles in Nokia Enterprise Campus Edge R&D). Slides are currently skeletons: a title, a section, an outline in `notes`, and a
`s-placeholder`. When designing a slide: read its `notes`, keep the one message, replace the placeholder, add steps for reveals, and consider a
background theme only on title/transition slides so content slides stay calm.
