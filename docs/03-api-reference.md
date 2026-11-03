# 3 · API reference

Everything public hangs off `window.Deck`. Unlisted internals may change.

## Registration

| Call | Purpose |
|---|---|
| `Deck.configure(cfg)` | merge into `Deck.config` (see [02](02-authoring-slides.md#create-a-deck)). Call before slides. |
| `Deck.slide(def)` | register a slide (throws without `title`). Returns `def`. |
| `Deck.slides` | array of slide definitions (all your fields are preserved, e.g. `background`, `section`, `notes`). |
| `Deck.config` | the live config object (plugins read `config.timer`, `config.logo`, `config.background`, `config.morph`). |
| `Deck.sections()` | `[{id,label,slides:[…]}]` grouping used by the title bar and storyline. |

## Navigation and state

| Call | Notes |
|---|---|
| `Deck.state` | `{ index, step, busy }` — current 0-based slide, step. |
| `Deck.go(i, step=0 \| "last")` | jump; plays transition; clamps step. |
| `Deck.next()` / `Deck.prev()` | step-then-slide semantics (what → / ← do). |
| `Deck.first()` / `Deck.last()` | |
| `Deck.stepCount(i)` | number of steps on slide `i`. |
| `Deck.slideEl(i?)` | the `<section>` of slide `i` (default current). |
| `Deck.context(i?)` | the `ctx` for slide `i`. |
| `Deck.animate(el, preset, "in"\|"out", {duration,delay,easing})` | animate any element with a preset or `[hiddenFrame, shownFrame]`; returns a Promise. |
| `Deck.finishAll()` | fast-forward every tracked animation. |
| `Deck.track(animation)` | register a Web Animation so navigation can fast-forward it. |

## Events

`Deck.on(name, fn)` returns an unsubscribe function; `Deck.off(name, fn)`; `Deck.emit(name, detail)`. Names and payloads are in
[01-architecture.md](01-architecture.md#events-deckonname-fn--deckoff--deckemit).

## Settings, theme, layers, keys

| Call | Purpose |
|---|---|
| `Deck.settings` | persisted user settings object (read directly). |
| `Deck.setSetting(key, value)` | write + persist + emit `settings`. |
| `Deck.setTheme("light"\|"dark")` / `Deck.toggleTheme()` | sets `html[data-theme]`; emits `theme`. |
| `Deck.toggleFullscreen()` | |
| `Deck.addKeys(keys, fn, label, group, opts)` | register hotkeys; `opts.allowRepeat`. Listed in `?` help by `group`. |
| `Deck.keymap` | registered bindings. |
| `Deck.keyTrap` | assign `(e)=>true` to consume keys (modals). Reset to `null` when done. |
| `Deck.pushLayer(name, closeFn)` / `popLayer(name)` / `hasLayer()` / `closeTopLayer()` | closable popups; Esc closes the top. |
| `Deck.scale`, `Deck.offset {x,y}`, `Deck.toStage(cx,cy)` | stage ↔ screen mapping. |
| `Deck.el` | `{ viewport, stage, titlebar, slides, ui, overlay }`. |
| `Deck.helpers` | `{ $, $$, h(tag,attrs,html), clamp, cssNumber(name,fb), cssList(name) }`. |
| `Deck.escapeHtml(s)` | |
| `Deck.version` | `"0.1.0"` |

## Slide `ctx` (hook argument)

| Member | Purpose |
|---|---|
| `ctx.el` | the slide `<section>` |
| `ctx.$(sel)`, `ctx.$$(sel)` | query inside the slide |
| `ctx.index`, `ctx.def` | position, definition |
| `ctx.step`, `ctx.maxStep` | current step (0 if not the current slide), total |
| `ctx.animate(el, preset, "in"\|"out", opts)` | tracked preset animation |
| `ctx.play(el, keyframes, opts)` | tracked `el.animate` (fill both; duration collapses under reduced motion) |
| `ctx.wait(ms)` | promise; instant under reduced motion |
| `ctx.reduced()` | true when reduced motion is on (setting or OS) |
| `ctx.cleanup(fn)` | run `fn` when the slide is left (LIFO) |

## Plugin namespaces

| Namespace | Members |
|---|---|
| `Deck.tools.laser / draw / lens / spotlight` | `active` (getter), `set(bool)`, `toggle()`; draw also `pick(shape) clear() undo() cycleColor() count`; lens/spotlight `resize(factor) presets`; spotlight `toggleShape()` |
| `Deck.tools.timer` | `status` (`idle\|running\|paused`), `minutes`, `left`, `start pause resume toggle stop restart adjust(±min)`, `presets` |
| `Deck.tools.palette()` | `[[name,value],…]` from `--deck-palette` |
| `Deck.storyline` | `show()`, `hide()`, `open` |
| `Deck.help` | `toggle()` |
| `Deck.morph` | `running`, `pairs`, `end()` |
| `Deck.marquee` | `speeds()` → px/s per visible marquee |
| `Deck.panzoom` | `views()` → state of visible pan-zoom elements |
| `Deck.typewriter` | `replay()`, `complete()`, `state()` |
| `Deck.background` | `themes` (names), `mode` (`on\|still\|off`), `setMode(m)`, `stats()` → `{theme,running,fps,avgCostMs,frames,res,canvas}` |

`body.tool-active` is set while any pointer tool (laser/draw/lens/spotlight) is on — plugins like `background` use it to pause.

## Presets for `data-anim` / `ctx.animate`

`fade · up · down · left · right · zoom · pop · rise · wipe · wipe-down · blur · draw`. Custom: pass `[hiddenFrame, shownFrame]`
(objects of CSS properties) instead of a name.

## Keys registered by the engine

`→ Space PgDn ↓ Enter` next · `← PgUp ↑ Backspace Shift+Space` previous · `Home` · `End` · `F` fullscreen · `T` theme.
Plugins add: `L D 1-5 C X U Z [ ] + - S Shift+S P Shift+P R G O E Y B ? H`.
