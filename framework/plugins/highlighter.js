/* Highlighter — H toggles. Freehand glowing strokes with a mouse, finger or pen.
 * M switches "keep" (strokes stay until you clear them) and "fade" (each stroke fades out a moment after you lift).
 * C cycles the colour, U undoes the last stroke, X clears the slide's strokes, Esc turns the tool off. Hold Shift while
 * dragging for a straight line. A ring follows the pointer while the tool is on.
 * Strokes are SVG in stage coordinates (sharp at any window size, visible in the lens) and are remembered per slide.
 * On touch devices a small toolbar (mode, colour, width, undo, clear, done) and a launcher button appear.
 * Settings: hlColor, hlWidth (s | m | l), hlMode (keep | fade), hlBar (auto | always | hidden). */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const WIDTHS = { s: 22, m: 34, l: 52 };
  const COLORS = ["Teal", "Amber", "Red", "Blue"]; // names in the theme's --deck-palette
  const HOLD = 1200, FADE = 1600; // fade mode: hold, then fade (ms)

  Deck.on("ready", () => {
    const { h, clamp } = Deck.helpers;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "deck-hl");
    svg.setAttribute("viewBox", `0 0 ${Deck.W} ${Deck.H}`);
    const layer = document.createElementNS(NS, "g");
    svg.append(layer);
    Deck.el.stage.append(svg);

    const tip = h("div", { class: "deck-hl-tip", hidden: true }, '<i class="ping"></i><i class="ring"></i><i class="core"></i>');
    const bar = h("div", { class: "deck-hl-bar", hidden: true, role: "toolbar", "aria-label": "Highlighter" });
    const launch = h("button", { class: "deck-hl-launch", hidden: true, title: "Highlighter (H)", "aria-label": "Highlighter" });
    launch.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M4 20l1.2-4.2L15 6l3 3-9.8 9.8L4 20z M13.5 7.5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
    Deck.el.overlay.append(tip, bar, launch);

    let on = false;
    let touchSeen = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
    let cur = null; // the stroke being drawn { g, paths, pts, start }
    let x = -100, y = -100, down = false;
    const groups = new Map(); // slide index -> <g>

    const palette = () => {
      const all = Deck.tools.palette();
      const picked = COLORS.map((n) => all.find(([name]) => name === n)).filter(Boolean);
      return picked.length ? picked : all.slice(0, 4);
    };
    const color = () => Deck.settings.hlColor || palette()[0][1];
    const widthKey = () => (WIDTHS[Deck.settings.hlWidth] ? Deck.settings.hlWidth : "m");
    const width = () => WIDTHS[widthKey()];
    const mode = () => (Deck.settings.hlMode === "fade" ? "fade" : "keep");
    const reduced = () => Deck.settings.reducedMotion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const light = () => (Deck.helpers.cssList("--deck-palette").find((c) => /^#f{3,6}$/i.test(c)) || "#FFFFFF");

    function group(i) {
      let g = groups.get(i);
      if (!g) {
        g = document.createElementNS(NS, "g");
        g.dataset.slide = i;
        g.style.display = i === Deck.state.index ? "" : "none";
        layer.append(g);
        groups.set(i, g);
      }
      return g;
    }
    const show = (i) => groups.forEach((g, k) => (g.style.display = k === i ? "" : "none"));

    function pathD(pts) {
      const f = (n) => n.toFixed(1);
      if (pts.length === 1) return `M${f(pts[0].x)} ${f(pts[0].y)}h.01`;
      let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
      if (pts.length === 2) return d + `L${f(pts[1].x)} ${f(pts[1].y)}`;
      for (let i = 1; i < pts.length - 1; i++) {
        d += ` Q${f(pts[i].x)} ${f(pts[i].y)} ${f((pts[i].x + pts[i + 1].x) / 2)} ${f((pts[i].y + pts[i + 1].y) / 2)}`;
      }
      const l = pts[pts.length - 1];
      return d + ` L${f(l.x)} ${f(l.y)}`;
    }

    function make() {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "hl-stroke");
      const c = color(), w = width();
      const paths = [[w, 0.26, c], [w * 0.62, 0.5, c], [Math.max(3, w * 0.14), 0.8, light()]].map(([sw, op, col]) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("stroke", col);
        p.setAttribute("stroke-width", sw);
        p.setAttribute("stroke-opacity", op);
        g.append(p);
        return p;
      });
      return { g, paths, pts: [], start: null };
    }
    const render = (s, pts) => { const d = pathD(pts); s.paths.forEach((p) => p.setAttribute("d", d)); };

    svg.addEventListener("pointerdown", (e) => {
      if (!on || e.button !== 0) return;
      e.preventDefault();
      if (e.pointerType !== "mouse") touchSeen = true;
      try { svg.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events have no active pointer */ }
      const p = Deck.toStage(e.clientX, e.clientY);
      cur = make();
      cur.start = p;
      cur.pts = [p];
      render(cur, cur.pts);
      group(Deck.state.index).append(cur.g);
      down = true;
      tip.classList.add("is-down");
    });
    svg.addEventListener("pointermove", (e) => {
      if (!cur) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs.length ? evs : [e]) {
        const p = Deck.toStage(ev.clientX, ev.clientY), last = cur.pts[cur.pts.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) >= 1.5) cur.pts.push(p);
      }
      const p = Deck.toStage(e.clientX, e.clientY);
      render(cur, e.shiftKey ? [cur.start, p] : cur.pts);
    });
    const end = () => {
      if (!cur) return;
      const s = cur;
      cur = null;
      down = false;
      tip.classList.remove("is-down");
      if (mode() === "fade") {
        setTimeout(() => {
          if (reduced()) return s.g.remove();
          s.g.style.setProperty("--hl-fade", FADE + "ms");
          s.g.classList.add("is-fading");
          setTimeout(() => s.g.remove(), FADE + 60);
        }, HOLD);
      }
      Deck.emit("highlight", { count: count() });
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);

    const strokes = () => [...(groups.get(Deck.state.index)?.children || [])].filter((el) => !el.classList.contains("is-fading"));
    const count = () => strokes().length;
    function clear() {
      groups.get(Deck.state.index)?.replaceChildren();
      Deck.emit("highlight", { count: 0 });
    }
    function undo() {
      strokes().pop()?.remove();
      Deck.emit("highlight", { count: count() });
    }
    function cycleColor() {
      const list = palette().map(([, v]) => v), i = list.indexOf(color());
      Deck.setSetting("hlColor", list[(i + 1) % list.length]);
      if (!on) set(true);
    }
    function toggleMode() {
      if (on) Deck.setSetting("hlMode", mode() === "keep" ? "fade" : "keep");
    }

    // ---- the ring that follows the pointer ----
    function styleTip() {
      const size = clamp(width() * (Deck.scale || 1) * 1.7, 46, 120);
      tip.style.setProperty("--hl-color", color());
      tip.style.setProperty("--hl-size", size + "px");
      tip.classList.toggle("is-fade", mode() === "fade");
    }
    function place() { tip.style.transform = `translate3d(${x}px, ${y}px, 0)`; }
    window.addEventListener("pointermove", (e) => {
      if (!on) return;
      if (e.pointerType !== "mouse") touchSeen = true;
      x = e.clientX; y = e.clientY;
      const over = e.target.closest && e.target.closest(".deck-hl-bar, .deck-menu, .deck-modal, .deck-hl-launch");
      tip.hidden = !!over;
      place();
    }, { passive: true });
    window.addEventListener("pointerup", (e) => { if (on && e.pointerType === "touch") tip.hidden = true; }, { passive: true });
    window.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" && !touchSeen) { touchSeen = true; refresh(); } }, { capture: true, passive: true });

    // ---- toolbar (touch / pen) and launcher ----
    function barVisible() {
      const m = Deck.settings.hlBar;
      return on && (m === "always" || (m !== "hidden" && touchSeen));
    }
    function renderBar() {
      const w = widthKey(), c = color().toLowerCase(), m = mode();
      bar.innerHTML = `
        <div class="seg"><button data-mode="keep" class="${m === "keep" ? "is-on" : ""}">Keep</button><button data-mode="fade" class="${m === "fade" ? "is-on" : ""}">Fade</button></div>
        <div class="sws">${palette().map(([n, v]) => `<button class="sw${v.toLowerCase() === c ? " is-on" : ""}" style="--sw:${v}" data-color="${v}" title="${n}" aria-label="${n}"></button>`).join("")}</div>
        <div class="seg">${["s", "m", "l"].map((k) => `<button data-w="${k}" class="wd wd-${k}${k === w ? " is-on" : ""}" aria-label="Width ${k}"><i></i></button>`).join("")}</div>
        <button data-act="undo">Undo</button><button data-act="clear">Clear</button><button data-act="done" class="done">Done</button>`;
    }
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.mode) Deck.setSetting("hlMode", b.dataset.mode);
      else if (b.dataset.color) Deck.setSetting("hlColor", b.dataset.color);
      else if (b.dataset.w) Deck.setSetting("hlWidth", b.dataset.w);
      else if (b.dataset.act === "undo") undo();
      else if (b.dataset.act === "clear") clear();
      else if (b.dataset.act === "done") set(false);
    });
    launch.addEventListener("click", () => set(true));
    function refresh() {
      styleTip();
      if (on) renderBar();
      bar.hidden = !barVisible();
      launch.hidden = on || !touchSeen;
    }

    function set(state) {
      on = state;
      svg.classList.toggle("is-active", on);
      document.body.classList.toggle("hl-on", on);
      if (on) {
        Deck.tools.laser?.active && Deck.tools.laser.set(false);
        Deck.tools.draw?.active && Deck.tools.draw.set(false);
        tip.hidden = !(x > 0 || y > 0) || (touchSeen && !down && x < 0);
        place();
      } else {
        end();
        tip.hidden = true;
      }
      refresh();
      Deck.tools.update();
      Deck.emit("tool", { name: "highlighter", active: on });
    }

    Deck.on("slidechange", ({ index }) => show(index));
    Deck.on("settings", ({ key }) => key.startsWith("hl") && refresh());
    Deck.on("resize", styleTip);
    Deck.on("escape", () => on && set(false));
    show(Deck.state.index);
    refresh();

    Deck.tools.highlighter = {
      get active() { return on; },
      get count() { return count(); },
      set, toggle: () => set(!on), clear, undo, cycleColor, toggleMode, palette, widths: WIDTHS,
    };
    Deck.addKeys(["h"], () => set(!on), "Highlighter on / off", "Highlighter");
    Deck.addKeys(["m"], toggleMode, "Highlighter: keep strokes ↔ fade them", "Highlighter");
  });
})();
