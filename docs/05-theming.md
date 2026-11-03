# 5 · Theming and styling

## The rule

The framework and all slides read **only `--deck-*` CSS variables**. A *theme* provides three files that define those variables;
swapping the theme re-skins every deck without touching slides.

```
framework/themes/<theme>/
  tokens.css   CSS variables generated from design-token JSON (light on :root, dark on :root[data-theme="dark"])
  fonts.css    @font-face with the fonts embedded as base64 (works from file://)
  theme.css    maps the design-system variables onto the --deck-* roles
```
Current theme: **KILN** (sand page, white raised surfaces, deep-teal rail, teal accent; Charter display + Inter + mono).

## `--deck-*` roles

| Group | Variables |
|---|---|
| Surfaces | `--deck-bg` page · `--deck-raised` cards · `--deck-sunken` · `--deck-rail` / `--deck-rail-raised` (title bar) · `--deck-letterbox` |
| Text | `--deck-text` · `--deck-text-2` · `--deck-muted` · `--deck-on-accent` · `--deck-on-rail` · `--deck-muted-on-rail` |
| Lines | `--deck-border` · `--deck-border-strong` |
| Accent | `--deck-accent` · `--deck-accent-hover` · `--deck-accent-subtle` · `--deck-accent-on-rail` · `--deck-focus` |
| States (pair with a word + shape) | `--deck-wait[-bg]` `--deck-ok[-bg]` `--deck-delegated[-bg]` `--deck-info[-bg]` `--deck-danger[-bg]` |
| Shape | `--deck-radius-sm 8px` · `--deck-radius 14px` · `--deck-radius-lg 22px` · `--deck-radius-pill` · `--deck-shadow-menu` |
| Type | `--deck-font-display` (Charter) · `--deck-font-sans` (Inter) · `--deck-font-mono` · sizes `--deck-fs-hero 112 / h1 76 / h2 56 / h3 40 / lead 36 / body 30 / small 24 / caption 20` · `--deck-lh-tight` `--deck-lh-body` |
| Layout | `--deck-titlebar-h 96px` · `--deck-pad-x 120px` · `--deck-pad-top 64px` · `--deck-pad-bottom 72px` · `--deck-gap 32px` |
| Motion | `--deck-ease` · `--deck-ease-out` · `--deck-slide-ms 700` · `--deck-el-ms 600` |
| Tools | `--deck-palette` (comma list: red, amber, teal, blue, violet, ink, white) · `--deck-laser-default` · `--deck-ink-default` |

Light/dark is `html[data-theme="light|dark"]`; the tokens switch automatically (the title bar stays dark in both). Test both with **T**.

> Starting a new deck? Use the template ([09](09-deck-template.md)); its `deck.css` already shows the prefix convention.

## Styling one deck

Put rules in `decks/<deck>/deck.css`:

* Prefix every class with a short deck code (`.p1-`, `.demo-`).
* Use variables (`var(--deck-raised)`, `var(--deck-radius)`), never hex colours or font names.
* Use the 1920×1080 pixel space directly — the stage is scaled for you.
* Animate `transform`/`opacity` only; check `prefers-reduced-motion` or use `html[data-reduced-motion]` selectors for CSS transitions.
* Promote to `framework/deck.css` only when a second deck needs the same pattern.

## Regenerating the KILN theme

When the design system (`batorfi/kiln`) changes:

```sh
cp -r ../kiln/.specify/memory/design-system/tokens/* framework/themes/kiln/tokens/
node tools/tokens-to-css.mjs framework/themes/kiln/tokens framework/themes/kiln/tokens.css --name kiln
node tools/embed-fonts.mjs framework/themes/kiln          # regenerates fonts.css from fonts/fonts.json
```
Token JSON is DTCG format: `primitive.tokens.json`, `semantic.tokens.json`, optional `component.tokens.json` and `modes/dark.tokens.json`.
Every token becomes a variable (`color.surface.page` → `--color-surface-page`). Fonts: Inter (SIL OFL) and Bitstream Charter — licences in
`framework/themes/kiln/fonts/`.

## Adding another theme

1. Create `framework/themes/<name>/` with `tokens.css`, `fonts.css`, `theme.css` (copy `kiln/theme.css` and remap every `--deck-*` role).
2. In a deck's `index.html` point the three `<link>`s at the new folder.
3. Check contrast in light and dark (WCAG AA for text), and that the title bar and `--deck-accent-on-rail` read on the rail colour.

## Accessibility defaults to keep

Contrast AA; never colour alone for state; visible focus (`--deck-focus`); alt text on images; reduced-motion respected (engine,
marquee, typewriter, morph, backgrounds all degrade); text ≥ 24 px for shared screens.
