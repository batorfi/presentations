/* Drawing — D toggles; 1 circle, 2 rectangle, 3 line, 4 arrow, 5 curved arrow; C cycles colour; X clears; U undoes.
 * Drag to draw. Shift makes a circle round, a rectangle square, snaps lines to 45° and flips the bend of a curved arrow.
 * Shapes are SVG in stage coordinates, so they stay sharp, scale with the window and show in the lens.
 * Drawings belong to the moment: they clear when you leave the slide. */
(function () {
  "use strict";
  const WIDTHS = { s: 4, m: 7, l: 12 };
  const SHAPES = ["ellipse", "rect", "line", "arrow", "curve"];
  const NS = "http://www.w3.org/2000/svg";

  Deck.on("ready", () => {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "deck-ink");
    svg.setAttribute("viewBox", `0 0 ${Deck.W} ${Deck.H}`);
    svg.innerHTML = `<defs></defs><g class="deck-ink-shapes"></g>`;
    Deck.el.stage.append(svg);
    const layer = svg.querySelector(".deck-ink-shapes");

    let on = false;
    let current = null; // the shape being drawn
    let origin = null;

    const color = () => Deck.settings.inkColor || Deck.helpers.cssList("--deck-ink-default")[0] || "#E5484D";
    const width = () => WIDTHS[Deck.settings.inkWidth] || WIDTHS.m;
    const shape = () => (SHAPES.includes(Deck.settings.inkShape) ? Deck.settings.inkShape : "ellipse");

    function set(state) {
      on = state;
      svg.classList.toggle("is-active", on);
      document.body.classList.toggle("draw-on", on);
      if (on && Deck.tools.laser?.active) Deck.tools.laser.set(false);
      if (on && Deck.tools.highlighter?.active) Deck.tools.highlighter.set(false);
      if (on && Deck.tools.text?.active) Deck.tools.text.set(false);
      Deck.tools.update();
      Deck.emit("tool", { name: "draw", active: on });
    }

    function pick(name) {
      Deck.setSetting("inkShape", name);
      if (!on) set(true);
      Deck.emit("tool", { name: "draw", active: on });
    }

    function make(tag) {
      const el = document.createElementNS(NS, tag === "arrow" ? "line" : tag === "curve" ? "path" : tag);
      el.setAttribute("stroke", color());
      el.setAttribute("stroke-width", width());
      el.setAttribute("fill", "none");
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-linejoin", "round");
      if (tag === "rect") el.setAttribute("rx", 6);
      if (tag === "arrow" || tag === "curve") el.setAttribute("marker-end", `url(#${arrowMarker(color())})`);
      return el;
    }

    // One arrowhead marker per colour (context-stroke is not supported everywhere yet).
    function arrowMarker(c) {
      const id = "deck-ink-arrow-" + c.replace(/[^a-z0-9]/gi, "");
      if (!svg.querySelector("#" + id)) {
        const m = document.createElementNS(NS, "marker");
        m.setAttribute("id", id);
        m.setAttribute("viewBox", "0 0 10 10");
        m.setAttribute("refX", "7");
        m.setAttribute("refY", "5");
        m.setAttribute("markerWidth", "4");
        m.setAttribute("markerHeight", "4");
        m.setAttribute("orient", "auto-start-reverse");
        m.innerHTML = `<path d="M0,0 L10,5 L0,10 z" fill="${c}"/>`;
        svg.querySelector("defs").append(m);
      }
      return id;
    }

    function geometry(el, kind, a, b, square) {
      let dx = b.x - a.x, dy = b.y - a.y;
      if (kind === "ellipse" || kind === "rect") {
        if (square) {
          const m = Math.max(Math.abs(dx), Math.abs(dy));
          dx = Math.sign(dx || 1) * m;
          dy = Math.sign(dy || 1) * m;
        }
        const x = Math.min(a.x, a.x + dx), y = Math.min(a.y, a.y + dy);
        const w = Math.abs(dx), hgt = Math.abs(dy);
        if (kind === "ellipse") {
          el.setAttribute("cx", x + w / 2);
          el.setAttribute("cy", y + hgt / 2);
          el.setAttribute("rx", w / 2);
          el.setAttribute("ry", hgt / 2);
        } else {
          el.setAttribute("x", x);
          el.setAttribute("y", y);
          el.setAttribute("width", w);
          el.setAttribute("height", hgt);
        }
      } else if (kind === "curve") {
        // A quadratic arc from the start to the pointer; the bend is a third of the length, Shift flips it.
        const len = Math.hypot(dx, dy) || 1;
        const k = (square ? -1 : 1) * 0.3;
        const cx = a.x + dx / 2 - (dy / len) * len * k, cy = a.y + dy / 2 + (dx / len) * len * k;
        el.setAttribute("d", `M${a.x} ${a.y} Q${cx} ${cy} ${a.x + dx} ${a.y + dy}`);
      } else {
        if (square) {
          const ang = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
          const len = Math.hypot(dx, dy);
          dx = Math.cos(ang) * len;
          dy = Math.sin(ang) * len;
        }
        el.setAttribute("x1", a.x);
        el.setAttribute("y1", a.y);
        el.setAttribute("x2", a.x + dx);
        el.setAttribute("y2", a.y + dy);
      }
    }

    svg.addEventListener("pointerdown", (e) => {
      if (!on || e.button !== 0) return;
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      origin = Deck.toStage(e.clientX, e.clientY);
      current = make(shape());
      current.dataset.kind = shape();
      geometry(current, current.dataset.kind, origin, origin, e.shiftKey);
      layer.append(current);
    });
    svg.addEventListener("pointermove", (e) => {
      if (!current) return;
      geometry(current, current.dataset.kind, origin, Deck.toStage(e.clientX, e.clientY), e.shiftKey);
    });
    const end = (e) => {
      if (!current) return;
      const p = Deck.toStage(e.clientX, e.clientY);
      if (Math.hypot(p.x - origin.x, p.y - origin.y) < 6) current.remove(); // a click, not a drag
      current = null;
      Deck.emit("ink", { count: layer.childElementCount });
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);

    function clear() {
      if (Deck.tools.text?.active) return Deck.tools.text.clear(); // text tool on: X clears its text only
      layer.replaceChildren();
      Deck.tools.highlighter?.clear();
      Deck.emit("ink", { count: 0 });
    }
    function clearAll() {
      layer.replaceChildren();
      Deck.tools.highlighter?.clear();
      Deck.tools.text?.clear();
      Deck.emit("ink", { count: 0 });
    }
    function undo() {
      if (Deck.tools.text?.active) return Deck.tools.text.undo();
      if (Deck.tools.highlighter?.active) return Deck.tools.highlighter.undo();
      layer.lastElementChild?.remove();
      Deck.emit("ink", { count: layer.childElementCount });
    }
    function cycleColor() {
      if (Deck.tools.text?.active) return Deck.tools.text.cycleColor();
      if (Deck.tools.highlighter?.active) return Deck.tools.highlighter.cycleColor();
      const list = Deck.tools.palette().map(([, v]) => v);
      const i = list.indexOf(color());
      Deck.setSetting("inkColor", list[(i + 1) % list.length]);
      if (!on) set(true);
    }

    Deck.on("beforeleave", () => { layer.replaceChildren(); Deck.emit("ink", { count: 0 }); }); // shapes belong to the moment; highlights are remembered per slide
    Deck.on("escape", () => on && set(false));

    Deck.tools.draw = {
      clearAll,
      get active() { return on; },
      set, toggle: () => set(!on), pick, clear, undo, cycleColor, shapes: SHAPES, widths: WIDTHS,
      get count() { return layer.childElementCount; },
    };
    Deck.addKeys(["d"], () => set(!on), "Drawing on / off", "Draw");
    Deck.addKeys(["1"], () => pick("ellipse"), "Circle (drag; Shift = round)", "Draw");
    Deck.addKeys(["2"], () => pick("rect"), "Rectangle (Shift = square)", "Draw");
    Deck.addKeys(["3"], () => pick("line"), "Line (Shift = 45° snap)", "Draw");
    Deck.addKeys(["4"], () => pick("arrow"), "Arrow", "Draw");
    Deck.addKeys(["5"], () => pick("curve"), "Curved arrow (Shift = bend the other way)", "Draw");
    Deck.addKeys(["c"], cycleColor, "Next colour (drawing, highlighter or text)", "Draw");
    Deck.addKeys(["x"], clear, "Clear drawings and highlights (text only while the text tool is on)", "Draw");
    Deck.addKeys(["Shift+x"], clearAll, "Clear everything: drawings, highlights and text", "Draw");
    Deck.addKeys(["u", "Mod+z"], undo, "Undo last shape, highlight or text", "Draw");
  });
})();
