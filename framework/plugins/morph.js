/* Shared-element morphs — the same thing on two slides glides from one place to the other.
 *
 * Mark the element on both slides with the same key:
 *   slide 3:  <div class="s-card" data-morph="arch">…</div>
 *   slide 4:  <div class="s-card" data-morph="arch">…</div>      (any position, any size, different content)
 * When you move between the slides, the element travels and resizes from where it was to where it is,
 * crossfading between the two looks, while the rest of the slide transitions as usual. Both directions work.
 *
 *   data-morph="key"             the pairing key (unique per slide; duplicates pair in document order)
 *   data-morph-fit="uniform"     keep text and pictures undistorted: scale evenly and letterbox instead of stretching
 *   data-morph-duration="900"    milliseconds (default: the slide transition time)
 *
 * Deck.configure({ morph: { reach: 1 } }): how far apart two slides may be and still morph
 * (1 = neighbours, Infinity = any pair, 0 = off).
 *
 * How it works: the two looks are cloned into a ghost layer above the slides and animated with transform and
 * opacity only (baked from the deck easing into keyframes, so the compositor runs it). The real elements are hidden
 * while the ghost travels and revealed in the same frame it lands. Nothing is measured while animating.
 * Notes: only visible elements morph; a morph element is not animated by data-anim / data-out itself; the clone is
 * styled by the same classes, but rules that depend on sibling order or on :hover do not carry over; canvas content
 * is copied, video is not. Reduced motion, the "none" transition and a zero transition time turn morphs off. */
(function () {
  "use strict";

  Deck.on("ready", () => {
    const { h, clamp, cssNumber } = Deck.helpers;
    const layer = h("div", { class: "deck-morph-layer", "aria-hidden": "true" });
    Deck.el.stage.insertBefore(layer, Deck.el.titlebar);
    // plus-lighter adds the two looks exactly (old fades out as new fades in, no dip in the middle).
    if (window.CSS && CSS.supports && CSS.supports("mix-blend-mode", "plus-lighter")) layer.classList.add("has-plus");

    let snap = null; // the leaving slide's morph elements, cloned before it changes
    let run = null; // the morph in flight

    // Warm the image cache so a clone paints on its first frame.
    for (let i = 0; i < Deck.slides.length; i++) {
      for (const img of Deck.slideEl(i).querySelectorAll("[data-morph] img, img[data-morph]")) img.decode?.().catch(() => {});
    }

    // ---------- geometry ----------
    function stageRect(el) {
      const r = el.getBoundingClientRect();
      const p = Deck.toStage(r.left, r.top);
      return { x: p.x, y: p.y, w: r.width / Deck.scale, h: r.height / Deck.scale };
    }
    /** Visible for real: not hidden, not (nearly) transparent through any ancestor, and has a size. */
    function shown(el, slide) {
      if (getComputedStyle(el).visibility !== "visible") return false;
      let o = 1;
      for (let n = el; n && n !== slide.parentElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
      const r = el.getBoundingClientRect();
      return o > 0.05 && r.width > 1 && r.height > 1;
    }
    /** Outermost visible morph elements of a slide, grouped by key. */
    function collect(index) {
      const slide = Deck.slideEl(index);
      const all = Array.from(slide.querySelectorAll("[data-morph]")).filter((e) => e.dataset.morph && shown(e, slide));
      const outer = all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
      const byKey = new Map();
      for (const el of outer) {
        const rect = stageRect(el);
        (byKey.get(el.dataset.morph) || byKey.set(el.dataset.morph, []).get(el.dataset.morph)).push({ el, rect });
      }
      return byKey;
    }

    // ---------- ghosts ----------
    /** A zero-box copy of an ancestor: it matches the same CSS rules and passes down inherited styles. */
    function shellOf(n) {
      const s = document.createElement(n.tagName);
      for (const a of Array.from(n.attributes)) if (a.name !== "hidden" && a.name !== "id") s.setAttribute(a.name, a.value);
      s.style.setProperty("display", "contents", "important");
      s.removeAttribute("aria-label");
      return s;
    }
    function scrub(clone, orig) {
      clone.removeAttribute("id");
      clone.classList.remove("deck-morph-hide");
      for (const e of clone.querySelectorAll("[id]")) e.removeAttribute("id");
      clone.removeAttribute("data-morph");
      for (const e of clone.querySelectorAll("[data-morph]")) e.removeAttribute("data-morph");
      const o = orig.querySelectorAll("canvas"), c = clone.querySelectorAll("canvas");
      c.forEach((cv, i) => {
        try { cv.getContext("2d").drawImage(o[i], 0, 0); } catch (_) {}
      });
    }
    /** The element, cloned at its measured size, wrapped in copies of its ancestors so it looks the same. */
    function ghostOf(el, rect) {
      const slide = el.closest(".deck-slide");
      const chain = [];
      for (let n = el.parentElement; n && n !== slide.parentElement; n = n.parentElement) chain.unshift(n);
      let root = null, parent = null;
      for (const n of chain) {
        const s = shellOf(n);
        parent ? parent.append(s) : (root = s);
        parent = s;
      }
      const clone = el.cloneNode(true);
      scrub(clone, el);
      const display = getComputedStyle(el).display;
      clone.style.cssText += `;position:absolute;left:0;top:0;width:${rect.w}px;height:${rect.h}px;margin:0;box-sizing:border-box;transform:none;` +
        `max-width:none;max-height:none;min-width:0;min-height:0;flex:none;display:${display === "inline" ? "inline-block" : display};`;
      parent.append(clone);
      return root;
    }

    // ---------- easing, baked into keyframes ----------
    function bezier(x1, y1, x2, y2) {
      const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
      const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      const X = (t) => ((ax * t + bx) * t + cx) * t;
      const Y = (t) => ((ay * t + by) * t + cy) * t;
      return (x) => {
        let t = x;
        for (let i = 0; i < 8; i++) {
          const e = X(t) - x;
          if (Math.abs(e) < 1e-5) break;
          const d = (3 * ax * t + 2 * bx) * t + cx;
          if (Math.abs(d) < 1e-6) break;
          t -= e / d;
        }
        return Y(clamp(t, 0, 1));
      };
    }
    function easing() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--deck-ease");
      const m = /cubic-bezier\(([^)]+)\)/.exec(v);
      const n = m ? m[1].split(",").map(parseFloat) : [0.65, 0, 0.35, 1];
      return n.length === 4 && n.every(Number.isFinite) ? bezier(...n) : (t) => t;
    }

    // ---------- lifecycle ----------
    function end() {
      if (!run) return;
      const r = run;
      run = null;
      for (const a of r.anims) { try { a.cancel(); } catch (_) {} }
      for (const e of r.hidden) e.classList.remove("deck-morph-hide");
      layer.replaceChildren();
    }

    const reach = () => (Deck.config.morph && Deck.config.morph.reach !== undefined ? Deck.config.morph.reach : 1);
    function eligible(from, to) {
      if (from === to || Math.abs(to - from) > reach()) return false;
      if (Deck.context(from).reduced()) return false;
      if ((Deck.slides[to].transition || Deck.config.transition) === "none") return false;
      return cssNumber("--deck-slide-ms", 700) > 0 && !!Deck.slideEl(to).querySelector("[data-morph]");
    }

    // 1. Leaving: remember how each morph element looks and where it is, before anything changes.
    Deck.on("beforeleave", ({ index, to }) => {
      end(); // a press during a morph completes it at once
      snap = null;
      if (!eligible(index, to) || !Deck.slideEl(index).querySelector("[data-morph]")) return;
      const items = collect(index);
      for (const list of items.values()) for (const it of list) it.ghost = ghostOf(it.el, it.rect);
      if (items.size) snap = { from: index, to, items };
    });

    // 2. Entering: pair them up with the incoming slide's elements and send the ghosts off.
    Deck.on("beforeenter", ({ index, from }) => {
      const s = snap;
      snap = null;
      if (!s || s.from !== from || s.to !== index) return;
      const incoming = collect(index);
      const pairs = [];
      for (const [key, list] of incoming) {
        const old = s.items.get(key);
        if (!old) continue;
        list.slice(0, old.length).forEach((t, i) => pairs.push({ key, from: old[i], to: t }));
      }
      if (!pairs.length) return;

      const slideMs = cssNumber("--deck-slide-ms", 700);
      const ease = easing();
      const anims = [], hidden = [];
      for (const p of pairs) {
        const fr = p.from.rect, to = p.to.rect;
        p.to.ghost = ghostOf(p.to.el, to); // built before the real element is hidden
        const ms = +(p.to.el.dataset.morphDuration || p.from.el.dataset.morphDuration) || slideMs;
        const uniform = (p.to.el.dataset.morphFit || p.from.el.dataset.morphFit) === "uniform";

        // One isolated box around both positions, so blending never touches the slides below.
        const ux = Math.min(fr.x, to.x), uy = Math.min(fr.y, to.y);
        const ux2 = Math.max(fr.x + fr.w, to.x + to.w), uy2 = Math.max(fr.y + fr.h, to.y + to.h);
        const G = h("div", { class: "deck-morph-item" });
        G.style.cssText = `left:${ux}px;top:${uy}px;width:${ux2 - ux}px;height:${uy2 - uy}px`;
        const O = h("div", { class: "deck-morph-old" });
        O.style.cssText = `width:${fr.w}px;height:${fr.h}px`;
        const N = h("div", { class: "deck-morph-new" });
        N.style.cssText = `width:${to.w}px;height:${to.h}px`;
        O.append(p.from.ghost);
        N.append(p.to.ghost);
        G.append(O, N);
        layer.append(G);

        // Bake the easing into keyframes: every sample is the exact box at that moment.
        const n = clamp(Math.round(ms / 22), 12, 60);
        const place = (box, w, hgt) => {
          if (!uniform) return [box.w / w, box.h / hgt, box.x, box.y];
          const k = Math.min(box.w / w, box.h / hgt);
          return [k, k, box.x + (box.w - w * k) / 2, box.y + (box.h - hgt * k) / 2];
        };
        const fo = [], fn = [];
        for (let i = 0; i <= n; i++) {
          const t = i / n, e = ease(t);
          const box = {
            x: fr.x + (to.x - fr.x) * e - ux,
            y: fr.y + (to.y - fr.y) * e - uy,
            w: fr.w + (to.w - fr.w) * e,
            h: fr.h + (to.h - fr.h) * e,
          };
          const [ox, oy, otx, oty] = place(box, fr.w, fr.h);
          const [nx, ny, ntx, nty] = place(box, to.w, to.h);
          // The crossfade happens in the middle of the move: the old look stays crisp while it is still close to its
          // own size, the new one is crisp as it settles, and stretched text is never on screen at full strength.
          const x = clamp((e - 0.2) / 0.55, 0, 1), w = x * x * (3 - 2 * x);
          fo.push({ offset: t, transform: `matrix(${ox},0,0,${oy},${otx},${oty})`, opacity: 1 - w });
          fn.push({ offset: t, transform: `matrix(${nx},0,0,${ny},${ntx},${nty})`, opacity: w });
        }
        const opts = { duration: ms, easing: "linear", fill: "both" };
        anims.push(Deck.track(O.animate(fo, opts)), Deck.track(N.animate(fn, opts)));
        hidden.push(p.from.el, p.to.el);
      }
      for (const e of hidden) e.classList.add("deck-morph-hide");
      const mine = (run = { anims, hidden, pairs });
      Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => run === mine && end());
    });

    window.addEventListener("resize", end);
    Deck.morph = { get running() { return !!run; }, get pairs() { return run ? run.pairs.length : 0; }, end };
  });
})();
