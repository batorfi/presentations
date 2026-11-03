/* Spotlight — S toggles. The whole slide dims except a window that follows the mouse, so the audience
 * looks where you point. Shift+S switches between a circle (default) and a rectangle. [ and ] (or the mouse
 * wheel) change the size. Works together with the laser; switches the zoom lens off.
 * Settings: spotWidth / spotSize (s | m | l), spotShape (circle | rect), spotDim (0.5 – 0.9),
 * spotBorder (animated | static): marching dashes and a soft pulse on the boundary, off under reduced motion.
 * The dimmed area is one full-window canvas: a dark rectangle with the window cut out (even-odd fill).
 * One draw per mouse move, no layer tricks, so it renders the same in every browser. */
(function () {
  "use strict";
  const PRESETS = { s: 380, m: 600, l: 880 }; // window width in screen pixels
  const SHAPES = ["circle", "rect"];

  Deck.on("ready", () => {
    const { h, clamp } = Deck.helpers;
    const canvas = h("canvas", { class: "deck-spot", hidden: true, "aria-hidden": "true" });
    const g = canvas.getContext("2d");
    // The boundary: a solid teal outline, white dashes marching along it, and a soft pulse radiating out.
    const ring = h("div", { class: "deck-spot-ring", hidden: true, "aria-hidden": "true" },
      '<svg aria-hidden="true"><rect class="base"/><rect class="ants"/></svg>');
    const ringRects = Array.from(ring.querySelectorAll("rect"));
    Deck.el.overlay.append(canvas, ring);

    let on = false;
    let cx = innerWidth / 2, cy = innerHeight / 2;
    let raf = 0;
    let cw = 0, ch = 0, cdpr = 0; // canvas size in CSS px and the device pixel ratio it was sized for

    const width = () => Deck.settings.spotWidth || PRESETS[Deck.settings.spotSize] || PRESETS.m;
    const shape = () => (SHAPES.includes(Deck.settings.spotShape) ? Deck.settings.spotShape : "circle");
    const dim = () => clamp(+Deck.settings.spotDim || 0.7, 0.3, 0.95);

    function roundedRect(x, y, w, hgt, r) {
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + hgt, r);
      g.arcTo(x + w, y + hgt, x, y + hgt, r);
      g.arcTo(x, y + hgt, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }

    let ringKey = "";
    function place() {
      raf = 0;
      const dpr = window.devicePixelRatio || 1;
      const W = innerWidth, H = innerHeight;
      if (W !== cw || H !== ch || dpr !== cdpr) {
        cw = W; ch = H; cdpr = dpr;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
      }
      const w = width();
      const circle = shape() === "circle";
      const hgt = circle ? w : w * 0.5;
      const x0 = cx - w / 2, y0 = cy - hgt / 2;

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.fillStyle = `rgba(6, 14, 13, ${dim()})`;
      g.beginPath();
      g.rect(0, 0, W, H);
      if (circle) {
        g.moveTo(x0 + w, cy);
        g.arc(cx, cy, w / 2, 0, Math.PI * 2);
      } else {
        roundedRect(x0, y0, w, hgt, 18);
      }
      g.fill("evenodd");

      // The outline follows the window; it is rebuilt only when the size or shape changes.
      const key = `${w}x${hgt}${circle}`;
      if (key !== ringKey) {
        ringKey = key;
        ring.style.width = w + "px";
        ring.style.height = hgt + "px";
        ring.style.borderRadius = circle ? "50%" : "18px";
        const sw = 3; // stroke width; the outline sits just inside the window's edge
        for (const r of ringRects) {
          r.setAttribute("x", sw / 2);
          r.setAttribute("y", sw / 2);
          r.setAttribute("width", w - sw);
          r.setAttribute("height", hgt - sw);
          r.setAttribute("rx", circle ? (w - sw) / 2 : 16);
        }
      }
      ring.style.transform = `translate3d(${x0}px, ${y0}px, 0)`;
      ring.classList.toggle("is-static", Deck.settings.spotBorder === "static");
    }
    const schedule = () => raf || (raf = requestAnimationFrame(place));

    function set(state) {
      on = state;
      canvas.hidden = !on;
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
    Deck.addKeys(["Shift+s"], toggleShape, "Spotlight: circle / rectangle", "Spotlight");
  });
})();
