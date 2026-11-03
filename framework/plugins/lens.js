/* Zoom lens — Z toggles a rectangular magnifier that follows the mouse.
 * [ and ] (or the mouse wheel) change its size; + and - (or Shift + wheel) change the zoom.
 * The lens shows a live copy of the slide's DOM, enlarged — so text, SVG and images stay sharp
 * instead of being a blurry screenshot. It refreshes on every step, slide, drawing and theme change. */
(function () {
  "use strict";
  const PRESETS = { s: 420, m: 600, l: 820 }; // lens width in screen pixels (16:10)
  const ZOOMS = [1.5, 2, 2.5, 3, 4, 5, 6];

  Deck.on("ready", () => {
    const { h, clamp } = Deck.helpers;
    const lens = h("div", { class: "deck-lens", hidden: true, "aria-hidden": "true" });
    const content = h("div", { class: "deck-lens-content" });
    const badge = h("div", { class: "deck-lens-badge" });
    lens.append(content, h("div", { class: "deck-lens-cross" }), badge);
    Deck.el.overlay.append(lens);

    let on = false;
    let cx = innerWidth / 2, cy = innerHeight / 2;
    let raf = 0;
    let timer = 0;

    const width = () => Deck.settings.lensWidth || PRESETS[Deck.settings.lensSize] || PRESETS.m;
    const zoom = () => clamp(+Deck.settings.lensZoom || 2.5, 1.5, 6);

    function snapshot() {
      if (!on) return;
      const stage = Deck.el.stage;
      const clone = stage.cloneNode(false);
      clone.removeAttribute("style");
      clone.classList.add("is-lens-copy");
      const cur = Deck.slideEl();
      for (const part of [cur, Deck.el.titlebar, stage.querySelector(".deck-ink")]) {
        if (!part) continue;
        const copy = part.cloneNode(true);
        copy.getAnimations?.().forEach((a) => a.cancel());
        clone.append(copy);
        // Canvases do not clone their pixels; copy them.
        const src = part.querySelectorAll("canvas");
        copy.querySelectorAll("canvas").forEach((c, i) => {
          try {
            c.getContext("2d").drawImage(src[i], 0, 0);
          } catch (_) {}
        });
      }
      // Wrap the slides layer so absolutely positioned slides keep their place.
      const slidesWrap = h("div", { class: "deck-slides" });
      const slideCopy = clone.querySelector(".deck-slide");
      if (slideCopy) {
        slideCopy.removeAttribute("style"); // drop any in-flight transition transform
        slidesWrap.append(slideCopy);
        clone.prepend(slidesWrap);
      }
      content.replaceChildren(clone);
    }

    function place() {
      raf = 0;
      const w = width();
      const hgt = Math.round(w * 0.625);
      const k = Deck.scale * zoom();
      const p = Deck.toStage(cx, cy);
      lens.style.width = w + "px";
      lens.style.height = hgt + "px";
      lens.style.transform = `translate3d(${cx - w / 2}px, ${cy - hgt / 2}px, 0)`;
      content.style.transform = `translate3d(${w / 2 - p.x * k}px, ${hgt / 2 - p.y * k}px, 0) scale(${k})`;
      badge.textContent = zoom().toFixed(1).replace(/\.0$/, "") + "×";
    }
    const schedule = () => raf || (raf = requestAnimationFrame(place));

    // Refresh shortly after a change, and once more after element animations have settled.
    function refreshSoon() {
      if (!on) return;
      setTimeout(snapshot, 30);
      setTimeout(snapshot, 900);
    }

    function set(state) {
      on = state;
      lens.hidden = !on;
      if (on && Deck.tools.spotlight?.active) Deck.tools.spotlight.set(false);
      document.body.classList.toggle("lens-on", on);
      Deck.tools.update();
      clearInterval(timer);
      if (on) {
        snapshot();
        place();
        timer = setInterval(snapshot, 700); // catches custom animations on the slide
      } else content.replaceChildren();
      Deck.emit("tool", { name: "lens", active: on });
    }

    function resize(f) {
      Deck.setSetting("lensWidth", Math.round(clamp(width() * f, 240, Math.min(innerWidth * 0.9, 1400))));
      schedule();
    }
    function rezoom(dir) {
      const z = zoom();
      const i = ZOOMS.findIndex((v) => v >= z - 0.01);
      const nextZ = ZOOMS[clamp((i < 0 ? ZOOMS.length - 1 : i) + dir, 0, ZOOMS.length - 1)];
      Deck.setSetting("lensZoom", nextZ);
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
      if (e.shiftKey || e.altKey) rezoom(e.deltaY < 0 || e.deltaX < 0 ? 1 : -1);
      else resize(e.deltaY < 0 ? 1.08 : 1 / 1.08);
    }, { passive: false });

    ["slidechange", "stepchange", "ink", "theme", "resize"].forEach((ev) => Deck.on(ev, () => (refreshSoon(), on && schedule())));
    Deck.on("settings", ({ key }) => key.startsWith("lens") && on && schedule());
    Deck.on("escape", () => on && set(false));

    Deck.tools.lens = { get active() { return on; }, set, toggle: () => set(!on), resize, presets: PRESETS, zooms: ZOOMS };
    Deck.addKeys(["z"], () => set(!on), "Zoom lens on / off", "Zoom lens");
    Deck.addKeys(["]"], () => Deck.tools.resize(1.12), "Bigger lens or spotlight (or mouse wheel)", "Zoom lens", { allowRepeat: true });
    Deck.addKeys(["["], () => Deck.tools.resize(1 / 1.12), "Smaller lens or spotlight", "Zoom lens", { allowRepeat: true });
    Deck.addKeys(["+", "="], () => on && rezoom(1), "More zoom (or Shift + wheel)", "Zoom lens");
    Deck.addKeys(["-"], () => on && rezoom(-1), "Less zoom", "Zoom lens");
  });
})();
