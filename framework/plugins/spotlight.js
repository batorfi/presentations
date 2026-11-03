/* Spotlight — S toggles. The whole slide dims except a window that follows the mouse, so the audience
 * looks where you point. Shift+S switches between a rectangle and a circle. [ and ] (or the mouse wheel)
 * change the size. Works together with the laser; switches the zoom lens off.
 * Settings: spotWidth / spotSize (s | m | l), spotShape (rect | circle), spotDim (0.5 – 0.9),
 * spotBorder (animated | static): marching dashes and a soft pulse on the boundary, off under reduced motion.
 * The dimmed area is four panels plus a corner path around the window; all move with translate3d. */
(function () {
  "use strict";
  const PRESETS = { s: 380, m: 600, l: 880 }; // window width in screen pixels
  const SHAPES = ["rect", "circle"];

  Deck.on("ready", () => {
    const { h, clamp } = Deck.helpers;
    // Dim layer = four translucent panels around the window. They are 1 x 1 px boxes that only move and
    // scale (transform), so moving the spotlight never repaints. Every edge is snapped to a whole device pixel
    // and neighbours share the exact same coordinate, so there is no seam and no double-dimmed overlap.
    const dimLayer = h("div", { class: "deck-spot", hidden: true, "aria-hidden": "true" }, '<i class="sp t"></i><i class="sp b"></i><i class="sp l"></i><i class="sp r"></i><svg class="sp-win" aria-hidden="true"><path fill-rule="evenodd"/></svg>');
    // The boundary: a solid teal outline, white dashes marching along it, and a soft pulse radiating out.
    const ring = h("div", { class: "deck-spot-ring", hidden: true, "aria-hidden": "true" },
      '<svg aria-hidden="true"><rect class="base"/><rect class="ants"/></svg>');
    const ringRects = Array.from(ring.querySelectorAll("rect"));
    Deck.el.overlay.append(dimLayer, ring);
    const [pt, pb, pl, pr, hole] = Array.from(dimLayer.children);

    let on = false;
    let cx = innerWidth / 2, cy = innerHeight / 2;
    let raf = 0;

    const width = () => Deck.settings.spotWidth || PRESETS[Deck.settings.spotSize] || PRESETS.m;
    const shape = () => (SHAPES.includes(Deck.settings.spotShape) ? Deck.settings.spotShape : "circle");
    const dim = () => clamp(+Deck.settings.spotDim || 0.7, 0.3, 0.95);

    let lastKey = "";
    function place() {
      raf = 0;
      const dpr = window.devicePixelRatio || 1;
      const snap = (v) => Math.round(v * dpr) / dpr;
      const W = snap(innerWidth), H = snap(innerHeight);
      const w = snap(width());
      const circle = shape() === "circle";
      const hgt = circle ? w : snap(w * 0.5);
      const x0 = snap(cx - w / 2), y0 = snap(cy - hgt / 2);
      const x1 = x0 + w, y1 = y0 + hgt;
      const T = (el, x, y, sx, sy) => (el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${Math.max(0, sx)}, ${Math.max(0, sy)})`);
      T(pt, 0, 0, W, y0);
      T(pb, 0, y1, W, H - y1);
      T(pl, 0, y0, x0, hgt);
      T(pr, x1, y0, W - x1, hgt);
      const d = dim();
      const key = `${w}x${hgt}${circle}${d}`;
      if (key !== lastKey) {
        lastKey = key;
        const r = circle ? "50%" : "18px";
        for (const el of [ring]) {
          el.style.width = w + "px";
          el.style.height = hgt + "px";
          el.style.borderRadius = r;
        }
        // The window dims only the corners left outside a circle / rounded rectangle: a path with the
        // window's own box as the outer edge and the round shape cut out (even-odd), so nothing needs clipping.
        const rad = circle ? w / 2 : 18;
        const rr = Math.min(rad, w / 2, hgt / 2);
        hole.setAttribute("width", w);
        hole.setAttribute("height", hgt);
        hole.firstElementChild.setAttribute("d",
          `M0 0H${w}V${hgt}H0Z M${rr} 0H${w - rr}A${rr} ${rr} 0 0 1 ${w} ${rr}V${hgt - rr}A${rr} ${rr} 0 0 1 ${w - rr} ${hgt}H${rr}A${rr} ${rr} 0 0 1 0 ${hgt - rr}V${rr}A${rr} ${rr} 0 0 1 ${rr} 0Z`);
        dimLayer.style.setProperty("--spot-dim", d);
        const sw = 3; // stroke width; the outline sits just inside the window's edge
        for (const r of ringRects) {
          r.setAttribute("x", sw / 2);
          r.setAttribute("y", sw / 2);
          r.setAttribute("width", w - sw);
          r.setAttribute("height", hgt - sw);
          r.setAttribute("rx", circle ? (w - sw) / 2 : 16);
        }
      }
      hole.style.transform = ring.style.transform = `translate3d(${x0}px, ${y0}px, 0)`;
      ring.classList.toggle("is-static", Deck.settings.spotBorder === "static");
    }
    const schedule = () => raf || (raf = requestAnimationFrame(place));

    function set(state) {
      on = state;
      dimLayer.hidden = !on;
      ring.hidden = !on;
      document.body.classList.toggle("spot-on", on);
      if (on && Deck.tools.lens?.active) Deck.tools.lens.set(false);
      Deck.tools.update();
      if (on) place();
      Deck.emit("tool", { name: "spotlight", active: on });
    }

    function resize(f) {
      Deck.setSetting("spotWidth", Math.round(clamp(width() * f, 200, Math.min(innerWidth * 0.95, 1700))));
      schedule();
    }
    function toggleShape() {
      Deck.setSetting("spotShape", shape() === "circle" ? "rect" : "circle");
      if (!on) set(true);
      schedule();
    }

    window.addEventListener("pointermove", (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (on) schedule();
    }, { passive: true });
    window.addEventListener("wheel", (e) => {
      if (!on) return;
      e.preventDefault();
      resize(e.deltaY < 0 ? 1.08 : 1 / 1.08);
    }, { passive: false });
    window.addEventListener("resize", () => on && schedule());
    Deck.on("settings", ({ key }) => key.startsWith("spot") && on && schedule());
    Deck.on("escape", () => on && set(false));

    Deck.tools.spotlight = { get active() { return on; }, set, toggle: () => set(!on), resize, toggleShape, presets: PRESETS, shapes: SHAPES };
    Deck.addKeys(["s"], () => set(!on), "Spotlight on / off", "Spotlight");
    Deck.addKeys(["Shift+s"], toggleShape, "Spotlight: rectangle / circle", "Spotlight");
  });
})();
