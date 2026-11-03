# 8 · Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Blank page, nothing renders | Open DevTools console. A syntax error in a slide script stops registration; or a `<script src>` path is wrong (`../../framework/…` from `decks/<d>/`). |
| Slide missing | It isn't listed in `index.html`, or `Deck.slide` threw (missing `title`). |
| Wrong slide order | Order = `<script>` order, not file names. |
| Step does nothing / empty step | Gaps in `data-step` numbers (1,2,4) or `steps:` larger than used; number contiguously. |
| Element visible before its step | It lacks `data-step`; with only `data-anim` it enters when the slide opens. |
| New plugin/theme/feature "not working" on the site | Stale cache. Bump `?v=` in deck `index.html` files (see [06](06-working-with-ai-harnesses.md#cache-busting)); hard-refresh. |
| Background missing | `plugins/background.js` not loaded in that deck; unknown theme name (console warning); `backgroundMode` is Off/Still in the menu; Reduced motion on (still frame). |
| Background animates but looks faint | Quiet by design in the middle; raise `intensity` (1.5–2) for that slide. |
| Text clipped / overflow | Over the ~848 px content height. Cut text, use steps, or `titlebar:false`. `tools/smoke-test.py` reports overflow. |
| SVG file can't be styled/animated | Files via `<img>` are opaque; use inline `<svg class="s-svg">`. (`file://` can't fetch SVG text.) |
| Fonts differ from the theme | `fonts.css` not linked, or deck CSS sets `font-family` directly; use `var(--deck-font-*)`. |
| Logo invisible | Title bar is dark in both themes; supply a light-on-dark logo. Missing file removes the logo silently. |
| Morph doesn't happen | Different `data-morph` keys; slides further apart than `morph.reach`; reduced motion; element hidden at that moment. |
| Pointer tool keys do nothing | `tools.js` or the tool plugin missing; typewriter/panzoom *explore* mode claims some keys. |
| Keys don't work while typing in a form | Slide inputs own the keyboard; click outside first. |
| Settings "stick" unexpectedly | Menu choices persist in `localStorage["deck.settings.v1"]` (theme, reduced motion, background mode…). Clear it or use a private window. |
| Works in Chrome, odd elsewhere | Only Chrome has been tested by script; check Firefox/Safari manually. Avoid exotic CSS. |
| Animation janky on screen share | Prefer fewer/lighter backgrounds; set Background → Still/Off; check `Deck.background.stats()`. |
| `fetch` / XHR fails | `file://` blocks it; inline data or embed in JS. |
| Headless test reports console warnings | Treat as real: unknown background theme, missing asset 404s. |

## Debug toolbox (browser console)

```js
Deck.state                    // {index, step}
Deck.go(11, 2)                // jump to slide 12, step 2
Deck.stepCount(Deck.state.index)
Deck.slides.map((s,i)=>i+1+" "+s.id)
Deck.settings                 // persisted user settings
Deck.background.stats()       // theme, fps, avg frame cost
Deck.typewriter.state()       // typing progress
Deck.panzoom.views()          // zoom state
localStorage.removeItem("deck.settings.v1")   // reset persisted settings
```
