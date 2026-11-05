/* Text — A toggles. Click anywhere to type text over the slide (built-in theme font).
 * Click, type; Enter = new line; Esc or a click elsewhere finishes the text. Click a text to edit it, drag it to move it.
 * C (or Tab while typing) cycles the colour, mouse wheel / [ ] (or Ctrl/⌘ + ↑ ↓ while typing) change the size,
 * Delete removes the selected text, U undoes the last text, X clears this slide's text while the tool is on,
 * Shift+X clears everything (drawings, highlights and text). Text stays visible when you switch to another tool.
 * Text is HTML in stage coordinates, remembered per slide. Settings: txColor, txSize (stage px), hlBar (shared toolbar). */
(function () {
  "use strict";
  const MIN = 20, MAX = 260, DEFAULT = 56;
  const PRESETS = { s: 36, m: 56, l: 84, xl: 120 };

  Deck.on("ready", () => {
    const { h, clamp } = Deck.helpers;
    const layer = h("div", { class: "deck-tx", "aria-hidden": "false" });
    Deck.el.stage.append(layer);
    const bar = h("div", { class: "deck-hl-bar deck-tx-bar", hidden: true, role: "toolbar", "aria-label": "Text" });
    Deck.el.overlay.append(bar);

    let on = false, sel = null, editing = null, drag = null;
    let touchSeen = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
    const groups = new Map();

    const palette = () => Deck.tools.palette();
    const color = () => Deck.settings.txColor || (palette().find(([n]) => n === "Ink") || palette()[0])[1];
    const size = () => clamp(+Deck.settings.txSize || DEFAULT, MIN, MAX);

    function group(i) {
      let g = groups.get(i);
      if (!g) {
        g = h("div", { class: "tx-group" });
        g.dataset.slide = i;
        g.hidden = i !== Deck.state.index;
        layer.append(g);
        groups.set(i, g);
      }
      return g;
    }
    const items = () => [...(groups.get(Deck.state.index)?.children || [])];
    const changed = () => Deck.emit("ink", { count: items().length });

    function select(el) {
      sel?.classList.remove("is-sel");
      sel = el || null;
      sel?.classList.add("is-sel");
      refresh();
    }

    function startEdit(el) {
      if (editing === el) return;
      finish();
      editing = el;
      select(el);
      el.classList.add("is-editing");
      el.contentEditable = "plaintext-only";
      if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
      el.focus();
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
    /** Stop typing; an empty text is dropped. */
    function finish() {
      const el = editing;
      if (!el) return;
      editing = null;
      el.classList.remove("is-editing");
      el.removeAttribute("contenteditable");
      el.blur();
      if (!el.textContent.trim()) {
        if (sel === el) sel = null;
        el.remove();
      }
      refresh();
      changed();
    }

    function create(x, y) {
      const s = size();
      const el = h("div", { class: "tx-item" });
      el.style.left = x.toFixed(1) + "px";
      el.style.top = (y - s * 0.62).toFixed(1) + "px";
      el.style.fontSize = s + "px";
      el.style.color = color();
      group(Deck.state.index).append(el);
      startEdit(el);
    }

    // ---- pointer: click empty = new text, click text = edit, drag text = move ----
    layer.addEventListener("pointerdown", (e) => {
      if (!on || e.button !== 0) return;
      if (e.pointerType !== "mouse") touchSeen = true;
      const item = e.target.closest(".tx-item");
      if (item && item === editing) return; // caret placement inside the text being edited
      e.preventDefault();
      try { layer.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ }
      const p = Deck.toStage(e.clientX, e.clientY);
      drag = { item, p0: p, moved: false, left: item ? parseFloat(item.style.left) : 0, top: item ? parseFloat(item.style.top) : 0 };
    });
    layer.addEventListener("pointermove", (e) => {
      if (!drag || !drag.item) return;
      const p = Deck.toStage(e.clientX, e.clientY);
      const dx = p.x - drag.p0.x, dy = p.y - drag.p0.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      if (!drag.moved) { finish(); select(drag.item); drag.item.classList.add("is-moving"); }
      drag.moved = true;
      drag.item.style.left = (drag.left + dx).toFixed(1) + "px";
      drag.item.style.top = (drag.top + dy).toFixed(1) + "px";
    });
    const up = (e) => {
      if (!drag) return;
      const d = drag;
      drag = null;
      d.item?.classList.remove("is-moving");
      if (d.moved) return changed();
      if (e.type === "pointercancel") return;
      if (d.item) startEdit(d.item);
      else { finish(); const p = Deck.toStage(e.clientX, e.clientY); create(p.x, p.y); }
    };
    layer.addEventListener("pointerup", up);
    layer.addEventListener("pointercancel", up);

    // ---- keys while typing (the deck ignores key presses in editable text) ----
    layer.addEventListener("keydown", (e) => {
      if (!editing) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); finish(); return; }
      if (e.key === "Tab") { e.preventDefault(); cycleColor(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); resize(e.key === "ArrowUp" ? 1.1 : 1 / 1.1); }
    });
    layer.addEventListener("input", changed);
    layer.addEventListener("wheel", (e) => {
      if (!on || Deck.tools.lens?.active || Deck.tools.spotlight?.active) return;
      e.preventDefault();
      resize(e.deltaY < 0 ? 1.1 : 1 / 1.1);
    }, { passive: false });

    // ---- colour, size, undo, clear ----
    function paint(c) {
      Deck.setSetting("txColor", c);
      if (sel) sel.style.color = c;
    }
    function cycleColor() {
      const list = palette().map(([, v]) => v), i = list.indexOf(color());
      paint(list[(i + 1) % list.length]);
      if (!on) set(true);
      refresh();
    }
    function resize(factor) {
      const base = sel ? parseFloat(sel.style.fontSize) || size() : size();
      const px = Math.round(clamp(base * factor, MIN, MAX));
      Deck.setSetting("txSize", px);
      if (sel) sel.style.fontSize = px + "px";
      if (!on) set(true);
      refresh();
    }
    function setSize(px) {
      Deck.setSetting("txSize", px);
      if (sel) sel.style.fontSize = px + "px";
      refresh();
    }
    function remove(el) {
      if (!el) return;
      if (el === editing) editing = null;
      if (el === sel) sel = null;
      el.remove();
      refresh();
      changed();
    }
    function undo() { finish(); remove(items().pop()); }
    function clear() {
      editing = null;
      sel = null;
      groups.get(Deck.state.index)?.replaceChildren();
      refresh();
      changed();
    }

    // ---- toolbar for touch / pen ----
    const barVisible = () => on && (Deck.settings.hlBar === "always" || (Deck.settings.hlBar !== "hidden" && touchSeen));
    function renderBar() {
      const c = color().toLowerCase();
      bar.innerHTML = `
        <div class="sws">${palette().map(([n, v]) => `<button class="sw${v.toLowerCase() === c ? " is-on" : ""}" style="--sw:${v}" data-color="${v}" title="${n}" aria-label="${n}"></button>`).join("")}</div>
        <button data-act="smaller" aria-label="Smaller text">A−</button><button data-act="bigger" aria-label="Bigger text">A+</button>
        <button data-act="delete">Delete</button><button data-act="undo">Undo</button><button data-act="clear">Clear</button><button data-act="done" class="done">Done</button>`;
    }
    bar.addEventListener("pointerdown", (e) => e.preventDefault()); // keep the caret while using the bar
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.color) paint(b.dataset.color);
      else if (b.dataset.act === "smaller") resize(1 / 1.15);
      else if (b.dataset.act === "bigger") resize(1.15);
      else if (b.dataset.act === "delete") remove(sel);
      else if (b.dataset.act === "undo") undo();
      else if (b.dataset.act === "clear") clear();
      else if (b.dataset.act === "done") set(false);
      refresh();
    });
    function refresh() {
      if (on) renderBar();
      bar.hidden = !barVisible();
    }

    function set(state) {
      if (state === on) return;
      on = state;
      layer.classList.toggle("is-active", on);
      document.body.classList.toggle("tx-on", on);
      if (on) {
        Deck.tools.laser?.active && Deck.tools.laser.set(false);
        Deck.tools.draw?.active && Deck.tools.draw.set(false);
        Deck.tools.highlighter?.active && Deck.tools.highlighter.set(false);
      } else {
        finish();
        select(null);
      }
      refresh();
      Deck.tools.update();
      Deck.emit("tool", { name: "text", active: on });
    }

    window.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" && !touchSeen) { touchSeen = true; refresh(); } }, { capture: true, passive: true });
    Deck.on("beforeleave", () => { finish(); select(null); });
    Deck.on("slidechange", ({ index }) => groups.forEach((g, k) => (g.hidden = k !== index)));
    Deck.on("settings", ({ key }) => key.startsWith("tx") && refresh());
    Deck.on("escape", () => on && set(false));

    Deck.tools.text = {
      get active() { return on; },
      get count() { return items().length; },
      set, toggle: () => set(!on), clear, undo, cycleColor, resize, setSize, palette, presets: PRESETS,
      get size() { return size(); },
    };
    Deck.addKeys(["a"], () => set(!on), "Text on / off (click to type)", "Text");
    Deck.addKeys(["Delete"], () => on && remove(sel), "Text: delete the selected text", "Text");
  });
})();
