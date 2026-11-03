/* Pan & zoom — look around inside a picture that is larger than its slot (PNG, JPG, SVG or any element).
 *
 *   <div class="s-panzoom" data-width="100%" data-height="640px" data-minimap data-views="Overview=0,0,4000,2250; Detail=1200,800,900,500">
 *     <img src="assets/big-map.png" alt="…">         (or an inline <svg>, or any block)
 *   </div>
 *
 *   data-width / data-height    size of the viewport: any CSS length. data-height="fill" takes the rest of the slide.
 *   data-aspect="16/9"          derive the height from the width instead
 *   data-bleed                  take the whole slide area below the title bar, edge to edge (use it alone on a slide)
 *   data-fit="contain"          first view: contain (default) | cover | width | height
 *   data-max-zoom="4"           largest zoom, as a multiple of the picture's own size (default 4 = 400 %)
 *   data-content-width/-height  picture size in px when it cannot be read (default: image size, SVG viewBox)
 *   data-views="A=x,y,w,h; …"   named details, as rectangles in picture pixels; keys 1-9 or the badge buttons fly there
 *   data-minimap="off"          hide the overview map (it shows while zoomed in)      data-minimap-size="240" its size
 *   data-badge="off"            hide the zoom badge (percentage, Fit, 100 %, view buttons)
 *
 * Mouse: drag pans · wheel zooms toward the pointer (pinch too) · double-click zooms in or back to fit.
 * Keyboard: Arrow keys change slides as usual. Click the picture, or press E (or Enter while the pointer is over it), to
 * explore it with the keyboard: arrows pan (Shift = faster) · + / − zoom · 0 fit · O 100 % · 1-9 views · Esc or E leave.
 * Every slide change starts again from the fitted view. The picture moves with a transform only; will-change is on during
 * a gesture and dropped afterwards so the picture is redrawn crisp at its new size. */
(function () {
  "use strict";

  Deck.on("ready", () => {
    const found = [];
    for (let i = 0; i < Deck.slides.length; i++) for (const el of Deck.slideEl(i).querySelectorAll(".s-panzoom")) found.push([el, i]);
    if (!found.length) return;
    const list = [];

    const num = (v, d) => (Number.isFinite(+v) && v !== "" && v != null ? +v : d);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const reduced = () => Deck.context(Deck.state.index).reduced();
    const here = () => list.filter((m) => m.slide === Deck.state.index);
    const tool = () => ["lens", "spotlight"].some((n) => Deck.tools && Deck.tools[n] && Deck.tools[n].active);

    // ---------- build ----------
    function init(el, slide) {
      const d = el.dataset;
      const stage = document.createElement("div");
      stage.className = "s-pz-stage";
      const content = el.firstElementChild;
      if (content) stage.append(content);
      el.prepend(stage);
      el.tabIndex = 0;
      if (d.width) el.style.width = d.width;
      if (d.bleed !== undefined) el.classList.add("is-bleed", "is-fill");
      else if (d.height === "fill") el.classList.add("is-fill");
      else if (d.height) el.style.height = d.height;
      if (d.aspect) { el.style.aspectRatio = d.aspect; if (!d.height) el.style.height = "auto"; }

      const m = { slide, el, stage, content, cw: 0, ch: 0, s: 1, x: 0, y: 0, fit: 1, min: 0.1, max: 4, explore: false, fly: null, views: parseViews(d.views), held: new Set(), hover: false };

      const ui = document.createElement("div");
      ui.className = "s-pz-ui";
      if (d.badge !== "off") {
        const b = document.createElement("div");
        b.className = "s-pz-badge";
        b.innerHTML = `<span class="pz-pct">100%</span><button type="button" data-pz="fit">Fit</button><button type="button" data-pz="100">100%</button>` +
          m.views.map((v, k) => `<button type="button" data-pz="view" data-i="${k}" title="${esc(v.label)}"><kbd>${k + 1}</kbd><span class="pz-lbl">${esc(v.label)}</span></button>`).join("");
        ui.append(b);
        m.pct = b.querySelector(".pz-pct");
      }
      if (d.minimap !== "off") {
        const map = document.createElement("div");
        map.className = "s-pz-map";
        map.innerHTML = `<div class="pz-map-pic"></div><div class="pz-map-rect"></div>`;
        ui.append(map);
        m.map = map; m.mapPic = map.firstChild; m.mapRect = map.lastChild;
      }
      const hint = document.createElement("div");
      hint.className = "s-pz-hint";
      hint.textContent = "Arrows pan · + − zoom · 0 fit · O 100 %" + (m.views.length ? ` · 1–${Math.min(9, m.views.length)} views` : "") + " · Esc done";
      ui.append(hint);
      el.append(ui);
      wire(m);
      return m;
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
    function parseViews(s) {
      if (!s) return [];
      return s.split(/[;|]/).map((t) => t.trim()).filter(Boolean).map((t, i) => {
        const eq = t.indexOf("=");
        const label = eq > 0 ? t.slice(0, eq).trim() : `View ${i + 1}`;
        const [x, y, w, h] = (eq > 0 ? t.slice(eq + 1) : t).split(",").map(parseFloat);
        return { label, x, y, w, h };
      }).filter((v) => [v.x, v.y, v.w, v.h].every(Number.isFinite) && v.w > 0 && v.h > 0);
    }

    // ---------- geometry ----------
    function measure(m) {
      const d = m.el.dataset, c = m.content;
      let w = num(d.contentWidth, 0), h = num(d.contentHeight, 0);
      if (!w || !h) {
        if (c && c.tagName === "IMG") { w = c.naturalWidth; h = c.naturalHeight; }
        else if (c && c.tagName && c.tagName.toLowerCase() === "svg") {
          const vb = c.viewBox && c.viewBox.baseVal;
          if (vb && vb.width) { w = vb.width; h = vb.height; }
          else { w = parseFloat(c.getAttribute("width")) || c.getBoundingClientRect().width; h = parseFloat(c.getAttribute("height")) || c.getBoundingClientRect().height; }
        } else if (c) { w = c.scrollWidth; h = c.scrollHeight; }
      }
      return [w, h];
    }
    function bounds(m) {
      const vw = m.el.clientWidth, vh = m.el.clientHeight;
      const contain = Math.min(vw / m.cw, vh / m.ch);
      const mode = m.el.dataset.fit || "contain";
      m.fit = mode === "cover" ? Math.max(vw / m.cw, vh / m.ch) : mode === "width" ? vw / m.cw : mode === "height" ? vh / m.ch : contain;
      m.min = Math.min(m.fit, contain);
      m.max = Math.max(m.fit * 2, num(m.el.dataset.maxZoom, 4));
      return [vw, vh];
    }
    function limit(m, vw, vh) {
      const sw = m.cw * m.s, sh = m.ch * m.s;
      m.x = sw <= vw ? (vw - sw) / 2 : clamp(m.x, vw - sw, 0);
      m.y = sh <= vh ? (vh - sh) / 2 : clamp(m.y, vh - sh, 0);
    }
    function apply(m) {
      const vw = m.el.clientWidth, vh = m.el.clientHeight;
      limit(m, vw, vh);
      m.stage.style.transform = `translate3d(${m.x}px,${m.y}px,0) scale(${m.s})`;
      if (m.pct) m.pct.textContent = `${Math.round(m.s * 100)}%`;
      const zoomed = m.s > m.fit * 1.03;
      m.el.classList.toggle("is-zoomed", zoomed);
      if (m.mapRect) {
        const k = m.mk;
        m.mapRect.style.transform = `translate3d(${(-m.x / m.s) * k}px,${(-m.y / m.s) * k}px,0)`;
        m.mapRect.style.width = `${(vw / m.s) * k}px`;
        m.mapRect.style.height = `${(vh / m.s) * k}px`;
      }
    }
    const toFit = (m) => { m.s = m.fit; m.x = m.y = 0; };
    function zoomAt(m, px, py, factor) {
      const s = clamp(m.s * factor, m.min, m.max), r = s / m.s;
      m.x = px - (px - m.x) * r; m.y = py - (py - m.y) * r; m.s = s;
      apply(m);
    }
    function stopFly(m) { if (m.fly) { cancelAnimationFrame(m.fly); m.fly = null; m.stage.style.willChange = ""; } }
    /** Smooth move to scale s with content point (cx, cy) in the middle of the viewport. */
    function flyTo(m, s, cx, cy, ms = 650) {
      stopFly(m);
      s = clamp(s, m.min, m.max);
      const vw = m.el.clientWidth, vh = m.el.clientHeight;
      const s0 = m.s, c0x = (vw / 2 - m.x) / m.s, c0y = (vh / 2 - m.y) / m.s;
      if (reduced() || ms <= 0) { m.s = s; m.x = vw / 2 - cx * s; m.y = vh / 2 - cy * s; return apply(m); }
      const t0 = performance.now();
      m.stage.style.willChange = "transform";
      const step = (now) => {
        const t = clamp((now - t0) / ms, 0, 1), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        m.s = s0 * Math.pow(s / s0, e);
        m.x = vw / 2 - (c0x + (cx - c0x) * e) * m.s;
        m.y = vh / 2 - (c0y + (cy - c0y) * e) * m.s;
        apply(m);
        if (t < 1) m.fly = requestAnimationFrame(step); else stopFly(m);
      };
      m.fly = requestAnimationFrame(step);
    }
    const flyView = (m, v) => flyTo(m, Math.min(m.el.clientWidth / v.w, m.el.clientHeight / v.h) * 0.94, v.x + v.w / 2, v.y + v.h / 2);
    const flyFit = (m) => flyTo(m, m.fit, m.cw / 2, m.ch / 2);

    // ---------- layout (needs the slide on screen) ----------
    function layout(m) {
      stopFly(m);
      const [w, h] = measure(m);
      if (!w || !h || !m.el.clientWidth) return;
      m.cw = w; m.ch = h;
      m.stage.style.width = `${w}px`; m.stage.style.height = `${h}px`;
      bounds(m);
      toFit(m);
      if (m.map) buildMap(m);
      apply(m);
      m.el.classList.add("is-ready");
    }
    function buildMap(m) {
      const size = num(m.el.dataset.minimapSize, 240);
      m.mk = size / Math.max(m.cw, m.ch);
      const mw = m.cw * m.mk, mh = m.ch * m.mk;
      m.map.style.width = `${mw}px`; m.map.style.height = `${mh}px`;
      if (!m.mapPic.firstChild) {
        let c;
        if (m.content && m.content.tagName === "IMG") { c = new Image(); c.src = m.content.currentSrc || m.content.src; c.alt = ""; c.style.cssText = `width:${mw}px;height:${mh}px;display:block`; }
        else if (m.content) {
          c = m.content.cloneNode(true);
          for (const n of [c, ...c.querySelectorAll("[id]")]) n.removeAttribute && n.removeAttribute("id");
          c.style.cssText = `width:${m.cw}px;height:${m.ch}px;transform:scale(${m.mk});transform-origin:0 0;display:block`;
        }
        if (c) { c.setAttribute("aria-hidden", "true"); m.mapPic.append(c); }
      } else if (m.mapPic.firstChild.tagName === "IMG") { m.mapPic.firstChild.style.width = `${mw}px`; m.mapPic.firstChild.style.height = `${mh}px`; }
      else m.mapPic.firstChild.style.transform = `scale(${m.mk})`;
    }
    function relayout(m) {
      if (!m.cw) return layout(m);
      const [vw, vh] = bounds(m);
      if (!m.el.classList.contains("is-zoomed")) toFit(m); else m.s = clamp(m.s, m.min, m.max);
      limit(m, vw, vh);
      apply(m);
    }
    function ready(m) {
      const c = m.content;
      if (c && c.tagName === "IMG" && !c.complete) { c.addEventListener("load", () => here().includes(m) && layout(m), { once: true }); return false; }
      return true;
    }
    function refresh() {
      for (const m of list) {
        if (m.slide === Deck.state.index) { setExplore(m, false); if (ready(m)) layout(m); }
        else { stopFly(m); setExplore(m, false); }
      }
    }
    for (const [el, i] of found) list.push(init(el, i));
    Deck.on("beforeenter", ({ index }) => list.forEach((m) => m.slide === index && ready(m) && layout(m)));
    Deck.on("slidechange", refresh);
    Deck.on("resize", () => here().forEach((m) => m.cw && relayout(m)));
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => here().forEach((m) => m.cw && relayout(m)));
      list.forEach((m) => ro.observe(m.el));
    }

    // ---------- explore mode (keyboard) ----------
    let active = null, raf = 0, last = 0;
    function setExplore(m, on) {
      if (on === m.explore) return;
      m.explore = on;
      m.el.classList.toggle("is-exploring", on);
      if (on) { active && active !== m && setExplore(active, false); active = m; m.el.focus({ preventScroll: true }); }
      else { if (active === m) active = null; m.held.clear(); if (document.activeElement === m.el) m.el.blur(); }
    }
    function loop(now) {
      raf = 0;
      const m = active;
      if (!m || !m.held.size) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const v = 640 * (m.held.has("Shift") ? 2.6 : 1) * dt;
      stopFly(m);
      if (m.held.has("ArrowLeft")) m.x += v;
      if (m.held.has("ArrowRight")) m.x -= v;
      if (m.held.has("ArrowUp")) m.y += v;
      if (m.held.has("ArrowDown")) m.y -= v;
      apply(m);
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || Deck.hasLayer()) return;
      if (e.target && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))) return;
      const k = e.key;
      const hov = here().find((m) => m.hover);
      if (!active) {
        if (k === "Enter" && hov && !e.repeat) { setExplore(hov, true); e.preventDefault(); e.stopImmediatePropagation(); }
        return;
      }
      const m = active;
      const eat = () => { e.preventDefault(); e.stopImmediatePropagation(); };
      if (k === "Escape" || k === "e" || k === "E" || k === "Enter") { if (!e.repeat) setExplore(m, false); return eat(); }
      if (k.startsWith("Arrow")) {
        m.held.add(k); e.shiftKey ? m.held.add("Shift") : m.held.delete("Shift");
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
        return eat();
      }
      const vw = m.el.clientWidth, vh = m.el.clientHeight;
      if (k === "+" || k === "=") { stopFly(m); zoomAt(m, vw / 2, vh / 2, 1.15); return eat(); }
      if (k === "-" || k === "_") { stopFly(m); zoomAt(m, vw / 2, vh / 2, 1 / 1.15); return eat(); }
      if (e.repeat) return /^[0-9oO]$/.test(k) ? eat() : undefined;
      if (k === "0") { flyFit(m); return eat(); }
      if (k === "o" || k === "O") { flyTo(m, 1, (vw / 2 - m.x) / m.s, (vh / 2 - m.y) / m.s, 400); return eat(); }
      if (/^[1-9]$/.test(k)) { const v = m.views[+k - 1]; if (v) flyView(m, v); return eat(); }
    }, true);
    window.addEventListener("keyup", (e) => {
      if (!active) return;
      active.held.delete(e.key);
      if (e.key === "Shift") active.held.delete("Shift");
    }, true);
    window.addEventListener("blur", () => active && active.held.clear());
    Deck.addKeys(["e"], () => {
      const c = here(); const m = c.find((x) => x.hover) || c[0];
      if (m && m.cw) setExplore(m, !m.explore);
    }, "Explore a pan-zoom picture with the keyboard", "Pictures");
    Deck.on("escape", () => active && setExplore(active, false));
    window.addEventListener("pointerdown", (e) => { if (active && !active.el.contains(e.target)) setExplore(active, false); }, true);

    // ---------- mouse ----------
    function wire(m) {
      const el = m.el;
      el.addEventListener("pointerenter", () => (m.hover = true));
      el.addEventListener("pointerleave", () => (m.hover = false));
      let pending = 0, px = 0, py = 0, frame = 0, endT = 0;
      el.addEventListener("wheel", (e) => {
        if (tool() || !m.cw) return;
        e.preventDefault();
        stopFly(m);
        const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1);
        pending += -dy * (e.ctrlKey ? 0.01 : 0.0016);
        const r = el.getBoundingClientRect();
        px = (e.clientX - r.left) / Deck.scale; py = (e.clientY - r.top) / Deck.scale;
        m.stage.style.willChange = "transform";
        clearTimeout(endT); endT = setTimeout(() => (m.stage.style.willChange = ""), 160);
        if (!frame) frame = requestAnimationFrame(() => { frame = 0; const f = Math.exp(pending); pending = 0; zoomAt(m, px, py, f); });
      }, { passive: false });

      let drag = null;
      el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || !m.cw || e.target.closest(".s-pz-ui")) return;
        stopFly(m);
        drag = { id: e.pointerId, cx: e.clientX, cy: e.clientY, x: m.x, y: m.y, moved: false };
        el.setPointerCapture(e.pointerId);
        m.stage.style.willChange = "transform";
      });
      el.addEventListener("pointermove", (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.cx, dy = e.clientY - drag.cy;
        if (!drag.moved && Math.hypot(dx, dy) < 4) return;
        if (!drag.moved) { drag.moved = true; el.classList.add("is-dragging"); }
        m.x = drag.x + dx / Deck.scale; m.y = drag.y + dy / Deck.scale;
        apply(m);
      });
      const up = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const was = drag; drag = null;
        el.classList.remove("is-dragging"); m.stage.style.willChange = "";
        if (!was.moved && e.type === "pointerup") setExplore(m, true);
      };
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("dblclick", (e) => {
        if (!m.cw || e.target.closest(".s-pz-ui")) return;
        const r = el.getBoundingClientRect();
        const qx = (e.clientX - r.left) / Deck.scale, qy = (e.clientY - r.top) / Deck.scale;
        const cx = (qx - m.x) / m.s, cy = (qy - m.y) / m.s;
        if (m.s > m.fit * 1.05) return flyFit(m);
        // keep the point under the pointer where it is while zooming in
        const s = clamp(Math.max(1, m.fit * 2.2), m.min, m.max), vw = el.clientWidth, vh = el.clientHeight;
        const nx = qx - cx * s, ny = qy - cy * s;
        flyTo(m, s, (vw / 2 - nx) / s, (vh / 2 - ny) / s, 450);
      });
      // badge and minimap
      el.querySelector(".s-pz-ui").addEventListener("click", (e) => {
        const b = e.target.closest("button[data-pz]");
        if (!b) return;
        stopFly(m);
        if (b.dataset.pz === "fit") flyFit(m);
        else if (b.dataset.pz === "100") flyTo(m, 1, (el.clientWidth / 2 - m.x) / m.s, (el.clientHeight / 2 - m.y) / m.s, 400);
        else flyView(m, m.views[+b.dataset.i]);
        b.blur();
      });
      if (m.map) {
        const jump = (e) => {
          const r = m.map.getBoundingClientRect();
          const cx = clamp(((e.clientX - r.left) / Deck.scale) / m.mk, 0, m.cw), cy = clamp(((e.clientY - r.top) / Deck.scale) / m.mk, 0, m.ch);
          stopFly(m); m.x = el.clientWidth / 2 - cx * m.s; m.y = el.clientHeight / 2 - cy * m.s; apply(m);
        };
        let mdrag = false;
        m.map.addEventListener("pointerdown", (e) => { mdrag = true; m.map.setPointerCapture(e.pointerId); jump(e); e.stopPropagation(); });
        m.map.addEventListener("pointermove", (e) => mdrag && jump(e));
        m.map.addEventListener("pointerup", () => (mdrag = false));
      }
    }

    Deck.panzoom = {
      views: () => here().map((m) => ({ scale: +m.s.toFixed(4), x: Math.round(m.x), y: Math.round(m.y), fit: +m.fit.toFixed(4), min: m.min, max: m.max, explore: m.explore, size: [m.cw, m.ch] })),
    };
  });
})();
