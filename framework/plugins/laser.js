/* Laser pointer — L toggles. A glowing dot follows the mouse; an optional fading trail.
 * Settings: laserColor, laserSize (s | m | l), laserTrail (bool). Drawn in screen space, outside the
 * stage, so the zoom lens never magnifies it. */
(function () {
  "use strict";
  const SIZES = { s: 12, m: 18, l: 28 };
  const TRAIL_MS = 260;

  Deck.on("ready", () => {
    const { h } = Deck.helpers;
    const dot = h("div", { class: "deck-laser", hidden: true });
    const trail = h("canvas", { class: "deck-laser-trail", hidden: true });
    Deck.el.overlay.append(trail, dot);
    const g = trail.getContext("2d");

    let on = false;
    let x = -100, y = -100;
    let points = []; // { x, y, t }
    let raf = 0;

    const color = () => Deck.settings.laserColor || Deck.helpers.cssList("--deck-laser-default")[0] || "#E5484D";
    function style() {
      const size = SIZES[Deck.settings.laserSize] || SIZES.m;
      dot.style.setProperty("--laser-color", color());
      dot.style.setProperty("--laser-size", size + "px");
    }
    function sizeCanvas() {
      const r = window.devicePixelRatio || 1;
      trail.width = innerWidth * r;
      trail.height = innerHeight * r;
      g.setTransform(r, 0, 0, r, 0, 0);
    }

    function frame() {
      raf = 0;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!Deck.settings.laserTrail) return;
      const now = performance.now();
      points = points.filter((p) => now - p.t < TRAIL_MS);
      g.clearRect(0, 0, innerWidth, innerHeight);
      if (points.length > 1) {
        const size = SIZES[Deck.settings.laserSize] || SIZES.m;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeStyle = color();
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i];
          const life = 1 - (now - b.t) / TRAIL_MS;
          g.globalAlpha = Math.max(0, life) * 0.55;
          g.lineWidth = size * 0.55 * Math.max(0.2, life);
          g.beginPath();
          g.moveTo(a.x, a.y);
          g.lineTo(b.x, b.y);
          g.stroke();
        }
        g.globalAlpha = 1;
      }
      if (points.length) raf = requestAnimationFrame(frame);
    }
    const schedule = () => raf || (raf = requestAnimationFrame(frame));

    function move(e) {
      if (!on) return;
      x = e.clientX;
      y = e.clientY;
      if (Deck.settings.laserTrail) points.push({ x, y, t: performance.now() });
      schedule();
    }

    function set(state) {
      on = state;
      dot.hidden = !on;
      trail.hidden = !on;
      document.body.classList.toggle("laser-on", on);
      Deck.tools.update();
      if (on) {
        if (Deck.tools.draw?.active) Deck.tools.draw.set(false);
        if (Deck.tools.highlighter?.active) Deck.tools.highlighter.set(false);
        if (Deck.tools.text?.active) Deck.tools.text.set(false);
        style();
        sizeCanvas();
        schedule();
      } else {
        points = [];
        g.clearRect(0, 0, innerWidth, innerHeight);
      }
      Deck.emit("tool", { name: "laser", active: on });
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", () => on && sizeCanvas());
    Deck.on("settings", ({ key }) => key.startsWith("laser") && on && style());
    Deck.on("escape", () => on && set(false));

    Deck.tools.laser = { get active() { return on; }, set, toggle: () => set(!on), sizes: SIZES };
    Deck.addKeys(["l"], () => set(!on), "Laser pointer on / off", "Tools");
  });
})();
