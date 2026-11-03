# 9 · Starting a new deck from the template

`decks/_template/` is a complete, runnable starter deck (9 slides covering the common patterns). `tools/new-deck.py` copies it, so an
AI harness (or a person) never starts from a blank page. Folders beginning with `_` are not decks and never appear on the landing page.

## Create a deck

```sh
python3 tools/new-deck.py adlc-part2 --title "ADLC · Part 2 — Practice" --prefix p2 --minutes 90 \
        --description "Hands-on: building the agentic pipeline."
```

| Option | Meaning |
|---|---|
| `slug` | folder `decks/<slug>/` — lowercase letters, digits, single dashes; must not start with `_` or already exist |
| `--title` | deck title (title bar, `<title>`, title slide); quotes and `&` are escaped safely |
| `--prefix` | CSS class prefix for this deck's own styles (`p2-…`); default = initials of the slug |
| `--minutes` | timer default (`Deck.configure({ timer })`), default 45 |
| `--description` | one line for the landing-page card |
| `--no-landing` | don't add a card to the root `index.html` |

What it does: copies `decks/_template` → `decks/<slug>`, replaces `{{TITLE}}`, the timer minutes and the `tpl-` class prefix, removes
`TEMPLATE.md`, appends the landing-page card, prints next steps. It never touches `framework/`.

## What you get

| File | Pattern |
|---|---|
| `index.html` | theme + engine + plugins (menu last; marquee/panzoom/typewriter present as commented lines), `Deck.configure`, slide list |
| `BRIEF.md` | the brief to fill in with the author **before** building slides |
| `deck.css` | deck-only styles using the prefix |
| `slides/01-title.js` | title (no title bar, animated background) |
| `02-agenda.js` | agenda as a focus list |
| `03-section.js` | section divider with big number |
| `04-three-cards.js` | message + 3 cards revealed by steps |
| `05-split.js` | text + picture |
| `06-focus-list.js` | process, `data-focus="reveal"` |
| `07-compare.js` | before / after with pills |
| `08-statement.js` | one statement to remember |
| `09-closing.js` | takeaways + next step |
| `assets/` | put the logo and pictures here |

Each slide file starts with `// PATTERN:` and has `// TODO:` markers. They are examples, not content — **delete, duplicate and reorder freely**
(order is the `<script>` order in `index.html`).

## Recommended flow (harness + author, side by side)

1. **Create** the deck with the script above.
2. **Brief** — open `decks/<slug>/BRIEF.md`; ask the author for audience, goal, the one sentence to remember, sections with minutes, outline,
   source material. Don't invent content. Save the answers into the file.
3. **Configure** `index.html`: `sections` (ids/labels from the brief), logo (`{ src, alt, height }` once the file is in `assets/`), optional deck-wide
   `background`, plugins you need (uncomment marquee/panzoom/typewriter; remove unused).
4. **Skeleton first**: one slide file per outline line with title, section, `notes` (speaker outline) and a placeholder; review the flow with the author
   via the storyline (**G**).
5. **Fill slides** one at a time, side by side in the browser; reuse the template patterns and the recipes in [07](07-recipes.md).
6. **Verify**: `python3 tools/smoke-test.py decks/<slug> --shots /tmp/shots`; look at the screenshots; check dark mode (T) and Reduced motion.
7. **Clean up**: `grep -rn "TODO\|s-placeholder\|{{" decks/<slug>` must return nothing; delete unused template slides and assets.
8. **Publish**: commit and push; the deck is at `https://batorfi.github.io/presentations/decks/<slug>/`.

## Changing the template itself

Edit `decks/_template/` like any deck (it must pass `tools/smoke-test.py decks/_template`). Keep tokens exactly as they are:
`{{TITLE}}` (only as `title: "{{TITLE}}"` in JS or as HTML text), `timer: { minutes: 45 }` in `index.html`, and class names starting `tpl-`.
Update this page and the cache-bust `?v=` in the template's `index.html` when framework files change
(the sed command in [06](06-working-with-ai-harnesses.md#cache-busting) uses `decks/*/index.html`, which includes the template).
