# Deck template

Starting point for a new deck. **Do not present or edit this folder directly** — create a copy with

```sh
python3 tools/new-deck.py my-deck --title "My deck title" --prefix md --minutes 45
```

(`--prefix` is the CSS class prefix for this deck, default = initials of the slug; `--minutes` the timer default.)
The script copies this folder to `decks/my-deck/`, fills `{{TITLE}}`, the timer minutes and the `tpl-` class prefix, adds a card
to the root `index.html`, and prints the next steps. Then follow `docs/06-working-with-ai-harnesses.md`.

## What the template contains

| File | Pattern |
|---|---|
| `slides/01-title.js` | title slide: no title bar, centred, animated background |
| `02-agenda.js` | agenda as a focus list (`data-focus`) |
| `03-section.js` | section divider with a big number |
| `04-three-cards.js` | message + three cards revealed by steps |
| `05-split.js` | text left, picture right |
| `06-focus-list.js` | numbered process, `data-focus="reveal"` |
| `07-compare.js` | before/after comparison with status pills |
| `08-statement.js` | one statement to remember |
| `09-closing.js` | takeaways + next step |
| `BRIEF.md` | the brief to fill in before authoring |
| `deck.css` | deck-only styles (`tpl-` prefix) |

Every slide file begins with a `// PATTERN:` comment and `// TODO:` markers. **Delete slides you don't need, duplicate the ones you do,
and keep `index.html`'s `<script>` list in presentation order.** Before presenting, remove all `TODO` text and placeholders
(`grep -rn "TODO\|s-placeholder\|{{" decks/my-deck`).

## Harness checklist for a new deck

1. Read `docs/README.md`, `docs/CHEATSHEET.md`, then this deck's `BRIEF.md` (ask the user to fill gaps — don't invent content).
2. Turn the brief's outline into slides: one file per slide, reuse these patterns, `notes` = the speaker's outline.
3. Set `sections` in `index.html`, the logo, and (optionally) a deck-wide `background`.
4. `python3 tools/smoke-test.py decks/my-deck --shots /tmp/shots` and review the screenshots with the user.
