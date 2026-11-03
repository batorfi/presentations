# Agent guide — presentations repo

Offline HTML presentation framework (`framework/`) + decks (`decks/`). No build step; decks open from `file://` or GitHub Pages.

**Start here:** `docs/README.md` (map) and `docs/CHEATSHEET.md` (one page). Deeper: `docs/02-authoring-slides.md`,
`docs/04-plugins.md`, `docs/06-working-with-ai-harnesses.md`, `docs/07-recipes.md`.

Essentials
* One slide = one file `decks/<deck>/slides/NN-id.js` with `Deck.slide({ id, section, title, html, … })`, listed **in order** in the deck's `index.html`.
* Stage is 1920×1080; content ≈ 1680×848. Use `s-*` classes and `--deck-*` variables only (no hard-coded colours/fonts).
* Reveals via `data-step` / `data-anim` / `data-focus`; deck-specific CSS goes in `decks/<deck>/deck.css` with a prefix. Don't edit `framework/` for one deck.
* After any `framework/` change bump the `?v=` cache-bust suffix in `decks/*/index.html`.
* Verify: `python3 tools/smoke-test.py decks/<deck> --shots /tmp/shots` (errors, overflow, screenshots). Look at the screenshots.
* Be offline-safe: no CDN, no web fonts, no `fetch` of local files; inline SVG for animated diagrams.
* Ask the user when the message/audience is unclear; never invent facts, numbers or logos.
