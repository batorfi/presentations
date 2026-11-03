/* deck.js — a small, offline, single-page presentation engine.
 *
 * A deck is an index.html that loads this file, the plugins, a theme and one script per slide.
 * Every slide script calls Deck.slide({...}); Deck.configure({...}) sets sections and defaults.
 * Everything runs from file:// with no server and no build step.
 *
 * Motion only ever animates transform and opacity (plus clip-path for wipes), through the
 * Web Animations API, so the browser can run it on the compositor (GPU).
 */
(function () {
  "use strict";

  const W = 1920;
  const H = 1080;
  const STORE_KEY = "deck.settings.v1";

  // ---------- small helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const h = (tag, attrs = {}, html) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, v === true ? "" : v);
    }
    if (html !== undefined) el.innerHTML = html;
    return el;
  };
  const cssNumber = (name, fallback) => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  const cssList = (name) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ---------- events ----------
  const listeners = {};
  const on = (name, fn) => ((listeners[name] ||= []).push(fn), () => off(name, fn));
  const off = (name, fn) => (listeners[name] = (listeners[name] || []).filter((f) => f !== fn));
  const emit = (name, detail) => (listeners[name] || []).slice().forEach((fn) => fn(detail));

  // ---------- settings (persisted when the browser allows it) ----------
  const defaults = {
    theme: null, // null = the deck's config.theme
    laserColor: null,
    laserSize: "m",
    laserTrail: true,
    inkColor: null,
    inkWidth: "m",
    inkShape: "ellipse",
    lensSize: "m",
    lensZoom: 2.5,
    reducedMotion: false,
  };
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch (_) {
    /* storage unavailable (private window, file:// in some browsers) — settings stay in memory */
  }
  const settings = Object.assign({}, defaults, stored);
  function setSetting(key, value) {
    settings[key] = value;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(settings));
    } catch (_) {}
    if (key === "reducedMotion") document.documentElement.toggleAttribute("data-reduced-motion", !!value);
    emit("settings", { key, value });
  }
  document.documentElement.toggleAttribute("data-reduced-motion", !!settings.reducedMotion);

  // ---------- keyboard registry (plugins add their keys; the help overlay lists them) ----------
  const keymap = []; // { keys: [..], fn, label, group, allowRepeat }
  function addKeys(keys, fn, label, group = "General", opts = {}) {
    keymap.push({ keys: [].concat(keys), fn, label, group, ...opts });
  }
  const keyId = (e) => {
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push("Mod");
    if (e.altKey) parts.push("Alt");
    // Shift is part of the identity only for letters and named keys, not for printed symbols like "?".
    if (e.shiftKey && (e.key.length > 1 || /[a-z]/i.test(e.key))) parts.push("Shift");
    parts.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    return parts.join("+");
  };

  // ---------- registry ----------
  const slides = [];
  const config = {
    title: document.title,
    sections: [], // [{ id, label }]
    theme: "light",
    transition: "slide", // slide | fade | none
    logo: null, // { src, alt, height } or { placeholder: true }: shown at the left of the title bar
  };

  const Deck = (window.Deck = {
    W,
    H,
    version: "0.1.0",
    slides,
    config,
    settings,
    state: { index: 0, step: 0, busy: false },
    el: {},
    on,
    off,
    emit,
    setSetting,
    addKeys,
    keymap,
    helpers: { $, $$, h, clamp, cssNumber, cssList },
    slide(def) {
      if (!def || !def.title) throw new Error("Deck.slide needs at least a title");
      slides.push(def);
      return def;
    },
    configure(cfg) {
      Object.assign(config, cfg);
      Deck.config = config; // read by plugins (e.g. config.timer.minutes)
    },
  });

  // ---------- motion ----------
  const reduced = () =>
    settings.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur = (ms) => (reduced() ? 0 : ms);

  // Element presets: the "hidden" end of each move. Shown is always opacity 1, transform none.
  const PRESETS = {
    fade: { opacity: 0 },
    up: { opacity: 0, transform: "translate3d(0, 48px, 0)" },
    down: { opacity: 0, transform: "translate3d(0, -48px, 0)" },
    left: { opacity: 0, transform: "translate3d(-64px, 0, 0)" }, // comes in from the left
    right: { opacity: 0, transform: "translate3d(64px, 0, 0)" }, // comes in from the right
    zoom: { opacity: 0, transform: "scale(0.88)" },
    pop: { opacity: 0, transform: "scale(0.6)" },
    rise: { opacity: 0, transform: "translate3d(0, 120px, 0) scale(0.96)" },
    wipe: { clipPath: "inset(0 100% 0 0)" },
    "wipe-down": { clipPath: "inset(0 0 100% 0)" },
    blur: { opacity: 0, filter: "blur(16px)" },
  };
  const SHOWN = { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)", filter: "blur(0px)" };
  const EASE = { pop: "cubic-bezier(0.34, 1.56, 0.64, 1)" };

  function presetFrames(name) {
    const hidden = PRESETS[name] || PRESETS.fade;
    const shown = {};
    for (const k of Object.keys(hidden)) shown[k] = SHOWN[k];
    return [hidden, shown];
  }

  /** Animate an element in or out with a preset or custom keyframes. Resolves when done. */
  function animateEl(el, name, dir = "in", opts = {}) {
    const isDraw = name === "draw";
    const duration = dur(opts.duration ?? cssNumber("--deck-el-ms", 600));
    const delay = reduced() ? 0 : opts.delay ?? 0;
    const easing = opts.easing || EASE[name] || "var(--deck-ease-out)";
    const resolvedEasing = easing.startsWith("var(")
      ? getComputedStyle(document.documentElement).getPropertyValue(easing.slice(4, -1)).trim() || "ease-out"
      : easing;

    if (dir === "in") el.classList.remove("deck-hidden");
    if (isDraw) return drawStrokes(el, dir, duration, delay, resolvedEasing);

    const [hidden, shown] = Array.isArray(name) ? name : presetFrames(name);
    const frames = dir === "in" ? [hidden, shown] : [shown, hidden];
    const anim = el.animate(frames, { duration, delay, easing: resolvedEasing, fill: "both" });
    track(anim);
    return anim.finished
      .catch(() => {})
      .then(() => {
        if (dir === "out") el.classList.add("deck-hidden");
        anim.cancel();
      });
  }

  // "draw" traces SVG strokes: every path, line, polyline, circle, rect inside the element.
  function drawStrokes(el, dir, duration, delay, easing) {
    const shapes = el.matches("path,line,polyline,polygon,circle,ellipse,rect")
      ? [el]
      : $$("path,line,polyline,polygon,circle,ellipse,rect", el);
    const anims = shapes.map((s) => {
      let len = 1000;
      try {
        len = s.getTotalLength();
      } catch (_) {}
      s.style.strokeDasharray = `${len}`;
      const frames = [{ strokeDashoffset: `${len}` }, { strokeDashoffset: "0" }];
      const a = s.animate(dir === "in" ? frames : frames.slice().reverse(), {
        duration,
        delay,
        easing,
        fill: "both",
      });
      track(a);
      return a.finished.catch(() => {}).then(() => {
        a.cancel();
        s.style.strokeDasharray = "";
      });
    });
    return Promise.all(anims).then(() => {
      if (dir === "out") el.classList.add("deck-hidden");
    });
  }

  // Every running animation is tracked so navigation can finish them instantly.
  const running = new Set();
  function track(anim) {
    running.add(anim);
    anim.finished.catch(() => {}).finally(() => running.delete(anim));
    return anim;
  }
  function finishAll() {
    for (const a of Array.from(running)) {
      try {
        a.finish();
      } catch (_) {
        a.cancel();
      }
    }
  }

  // ---------- per-slide context handed to hooks ----------
  function makeContext(index) {
    const def = slides[index];
    const cleanups = [];
    const ctx = {
      deck: Deck,
      def,
      index,
      el: slideEls[index],
      get step() {
        return Deck.state.index === index ? Deck.state.step : 0;
      },
      maxStep: stepCount(index),
      $: (sel) => $(sel, slideEls[index]),
      $$: (sel) => $$(sel, slideEls[index]),
      animate: (el, preset, dir, opts) => animateEl(el, preset, dir, opts),
      /** Raw Web Animations call that navigation can fast-forward. */
      play: (el, frames, opts) => track(el.animate(frames, { fill: "both", ...opts, duration: dur(opts?.duration ?? 600) })),
      wait: (ms) => new Promise((r) => setTimeout(r, dur(ms))),
      reduced,
      /** Register work to undo when the slide is left: timers, loops, listeners. */
      cleanup: (fn) => cleanups.push(fn),
      _runCleanups() {
        while (cleanups.length) {
          try {
            cleanups.pop()();
          } catch (e) {
            console.error(e);
          }
        }
      },
    };
    return ctx;
  }

  // ---------- DOM ----------
  const slideEls = [];
  let contexts = [];

  function stepCount(index) {
    const def = slides[index];
    let max = def.steps || 0;
    for (const el of $$("[data-step],[data-out-step]", slideEls[index])) {
      max = Math.max(max, +el.dataset.step || 0, +el.dataset.outStep || 0);
    }
    // Focus groups add one step per item (plus one to release the dimming, if asked).
    for (const g of $$("[data-focus]", slideEls[index])) {
      max = Math.max(max, focusFrom(g) + focusItems(g).length - 1 + (g.hasAttribute("data-focus-release") ? 1 : 0));
    }
    return max;
  }

  // ---------- line-by-line focus ----------
  // <ul data-focus> — each direct child is a point; every press of → focuses the next one and dims the rest.
  //   data-focus="reveal"     points that have not come yet stay hidden; passed ones dim
  //   data-focus-from="2"     the step at which the first point is focused (default 1)
  //   data-focus-release      one extra step at the end that un-dims everything
  //   data-focus-items=".x"   pick the points with a selector instead of the direct children
  // Before the first focus step (default mode) everything is shown normally.
  const focusFrom = (g) => Math.max(1, +g.dataset.focusFrom || 1);
  const focusItems = (g) => (g.dataset.focusItems ? $$(g.dataset.focusItems, g) : Array.from(g.children));

  function applyFocus(index, step) {
    for (const g of $$("[data-focus]", slideEls[index])) {
      const items = focusItems(g);
      const reveal = g.dataset.focus === "reveal";
      const k = step - focusFrom(g); // index of the focused item; < 0 before the group starts
      const released = g.hasAttribute("data-focus-release") && k >= items.length;
      const cur = Math.min(k, items.length - 1);
      const active = k >= 0 && !released;
      items.forEach((el, i) => {
        el.classList.add("deck-focus-item");
        el.classList.toggle("is-current", active && i === cur);
        el.classList.toggle("is-dim", active && i !== cur && (!reveal || i < cur));
        el.classList.toggle("is-future", reveal && !released && (k < 0 || i > cur));
      });
      g.classList.toggle("is-focusing", active);
    }
  }

  function build() {
    document.documentElement.dataset.theme = settings.theme || config.theme;
    document.body.classList.add("deck-body");

    const viewport = h("div", { class: "deck-viewport" });
    const stage = h("div", { class: "deck-stage", role: "region", "aria-roledescription": "slide deck" });
    const titlebar = h("header", { class: "deck-titlebar", "aria-live": "polite" });
    const slidesEl = h("div", { class: "deck-slides" });
    const ui = h("div", { class: "deck-ui" }); // scaled overlay layer for popups (not cloned by the lens)
    const overlay = h("div", { class: "deck-overlay" }); // unscaled layer for screen-space tools

    stage.append(slidesEl, titlebar);
    viewport.append(stage, ui, overlay);
    document.body.append(viewport);
    Object.assign(Deck.el, { viewport, stage, titlebar, slides: slidesEl, ui, overlay });

    slides.forEach((def, i) => {
      const el = h("section", {
        class: ["deck-slide", def.titlebar === false ? "no-titlebar" : "", def.className || ""].join(" ").trim(),
        "data-index": i,
        "data-id": def.id || `s${i + 1}`,
        "aria-label": def.title,
        hidden: true,
      });
      el.innerHTML = typeof def.html === "function" ? def.html(def) : def.html || "";
      slidesEl.append(el);
      slideEls.push(el);
    });
    contexts = slides.map((_, i) => makeContext(i));
    slides.forEach((def, i) => {
      if (def.setup) def.setup(contexts[i]); // one-time hook after the DOM exists
    });

    buildTitlebar();
    fit();
    window.addEventListener("resize", fit);
  }

  // ---------- scaling: the 1920 x 1080 stage fits the window, letterboxed ----------
  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.min(vw / W, vh / H);
    const x = (vw - W * s) / 2;
    const y = (vh - H * s) / 2;
    Deck.scale = s;
    Deck.offset = { x, y };
    const t = `translate(${x}px, ${y}px) scale(${s})`;
    Deck.el.stage.style.transform = t;
    Deck.el.ui.style.transform = t;
    emit("resize", { scale: s, x, y });
  }

  /** Window (client) coordinates -> stage coordinates. */
  Deck.toStage = (cx, cy) => ({ x: (cx - Deck.offset.x) / Deck.scale, y: (cy - Deck.offset.y) / Deck.scale });

  // ---------- title bar: slide title + progress through the storyline ----------
  function sectionsWithSlides() {
    const list = config.sections.length ? config.sections.map((s) => ({ ...s, slides: [] })) : [];
    const byId = Object.fromEntries(list.map((s) => [s.id, s]));
    slides.forEach((def, i) => {
      let sec = byId[def.section];
      if (!sec) {
        sec = byId[def.section || "_"] = { id: def.section || "_", label: def.section || "", slides: [] };
        list.push(sec);
      }
      sec.slides.push(i);
    });
    return list.filter((s) => s.slides.length);
  }
  Deck.sections = sectionsWithSlides;

  // Logo at the left end of the title bar: Deck.configure({ logo: { src, alt, height } }) with an SVG or PNG,
  // or { placeholder: true } for a dashed box that marks the spot until the real logo arrives.
  function logoHtml() {
    const l = config.logo;
    if (!l || (!l.src && !l.placeholder)) return "";
    const hgt = +l.height || 44;
    const style = `--logo-h:${hgt}px;` + (l.maxWidth ? `--logo-max-w:${+l.maxWidth}px;` : "");
    if (!l.src) return `<div class="deck-tb-logo is-placeholder" style="${style}" aria-hidden="true"><span>${escapeHtml(l.label || "LOGO")}</span></div>`;
    return `<img class="deck-tb-logo" style="${style}" src="${escapeHtml(l.src)}" alt="${escapeHtml(l.alt || "")}" draggable="false" onerror="this.remove()">`;
  }

  function buildTitlebar() {
    const tb = Deck.el.titlebar;
    const secs = sectionsWithSlides();
    tb.innerHTML = `
      <div class="deck-tb-left">
        ${logoHtml()}
        <div class="deck-tb-text">
          <div class="deck-tb-kicker"></div>
          <div class="deck-tb-title"><span></span></div>
        </div>
      </div>
      <nav class="deck-tb-progress" aria-label="Storyline progress">
        ${secs
          .map(
            (s) => `
          <div class="deck-tb-section" data-section="${s.id}" style="flex-grow:${s.slides.length}">
            <div class="deck-tb-ticks">${s.slides
              .map((i) => `<button class="deck-tb-tick" data-index="${i}" title="${i + 1} · ${escapeHtml(slides[i].title)}" aria-label="Go to slide ${i + 1}: ${escapeHtml(slides[i].title)}"></button>`)
              .join("")}</div>
            <div class="deck-tb-label">${escapeHtml(s.label)}</div>
          </div>`
          )
          .join("")}
      </nav>
      <div class="deck-tb-right"><div class="deck-tb-timer" hidden></div><div class="deck-tb-count"><b></b><span>/ ${slides.length}</span></div></div>
      <div class="deck-tb-bar"><i></i></div>`;
    tb.addEventListener("click", (e) => {
      const tick = e.target.closest(".deck-tb-tick");
      if (tick) go(+tick.dataset.index, 0);
    });
  }

  function updateTitlebar(dir) {
    const tb = Deck.el.titlebar;
    const i = Deck.state.index;
    const def = slides[i];
    const sec = sectionsWithSlides().find((s) => s.slides.includes(i));
    tb.classList.toggle("is-hidden", def.titlebar === false);
    $(".deck-tb-kicker", tb).textContent = sec ? sec.label : "";
    const titleWrap = $(".deck-tb-title", tb);
    const label = def.navTitle || def.title;
    // Exactly one span is "current". Anything else still fading out is dropped at once, so quick
    // navigation can never leave stale titles stacked on top of each other.
    const current = $("span.is-current", titleWrap);
    $$("span:not(.is-current)", titleWrap).forEach((s) => s.remove());
    if (!current || current.textContent !== label) {
      const next = h("span", { class: "is-current" }, escapeHtml(label));
      titleWrap.append(next);
      const d = dur(380);
      const dx = dir === "backward" ? -24 : 24;
      next.animate([{ opacity: 0, transform: `translate3d(${dx}px,0,0)` }, { opacity: 1, transform: "none" }], { duration: d, easing: "cubic-bezier(0.16,1,0.3,1)" });
      if (current) {
        current.classList.remove("is-current");
        current.animate([{ opacity: 1 }, { opacity: 0, transform: `translate3d(${-dx}px,0,0)` }], { duration: d * 0.7, fill: "forwards" });
        // A timer, not the animation's promise: it also fires in background tabs and when animations are cancelled.
        setTimeout(() => current.remove(), d * 0.7 + 60);
      }
    }
    $$(".deck-tb-tick", tb).forEach((t) => {
      const k = +t.dataset.index;
      t.classList.toggle("is-done", k < i);
      t.classList.toggle("is-current", k === i);
    });
    $$(".deck-tb-section", tb).forEach((s) => s.classList.toggle("is-current", sec && s.dataset.section === sec.id));
    $(".deck-tb-count b", tb).textContent = String(i + 1).padStart(2, "0");
    $(".deck-tb-bar i", tb).style.transform = `scaleX(${slides.length > 1 ? i / (slides.length - 1) : 1})`;
  }

  // ---------- applying a step state instantly ----------
  function applyStepInstant(index, step) {
    for (const el of $$("[data-step],[data-out-step]", slideEls[index])) {
      const inAt = el.dataset.step !== undefined ? +el.dataset.step : 0;
      const outAt = el.dataset.outStep !== undefined ? +el.dataset.outStep : Infinity;
      el.classList.toggle("deck-hidden", !(step >= inAt && step < outAt));
    }
    applyFocus(index, step);
  }

  // Elements that animate in on their own when the slide is entered (no data-step).
  // Elements (and their containers) that a shared-element morph is handling do not animate in on their own.
  const autoEls = (index) =>
    $$("[data-anim]:not([data-step])", slideEls[index]).filter(
      (el) => (el.dataset.outStep === undefined || +el.dataset.outStep > 0) && !el.closest(".deck-morph-hide") && !el.querySelector(".deck-morph-hide")
    );

  function playAutos(index, baseDelay) {
    const els = autoEls(index);
    els.forEach((el) => el.classList.add("deck-hidden"));
    return Promise.all(
      els.map((el) =>
        animateEl(el, el.dataset.anim, "in", {
          delay: baseDelay + (+el.dataset.delay || 0),
          duration: el.dataset.duration ? +el.dataset.duration : undefined,
        })
      )
    );
  }

  // ---------- stepping ----------
  function runStep(index, from, to) {
    const dir = to > from ? "forward" : "backward";
    const el = slideEls[index];
    const jobs = [];
    if (dir === "forward") {
      for (const e of $$(`[data-step="${to}"]`, el))
        jobs.push(animateEl(e, e.dataset.anim || "fade", "in", { delay: +e.dataset.delay || 0, duration: e.dataset.duration ? +e.dataset.duration : undefined }));
      for (const e of $$(`[data-out-step="${to}"]`, el))
        jobs.push(animateEl(e, e.dataset.out || e.dataset.anim || "fade", "out", { delay: +e.dataset.outDelay || 0, duration: 400 }));
    } else {
      for (const e of $$(`[data-step="${from}"]`, el)) jobs.push(animateEl(e, e.dataset.anim || "fade", "out", { duration: 350 }));
      for (const e of $$(`[data-out-step="${from}"]`, el)) jobs.push(animateEl(e, e.dataset.out || e.dataset.anim || "fade", "in", { duration: 450 }));
    }
    Deck.state.step = to;
    applyFocus(index, to); // focus moves are CSS transitions on opacity/transform: compositor-only
    slides[index].onStep?.(to, dir, contexts[index]);
    emit("stepchange", { index, step: to, dir });
    writeHash();
    return Promise.all(jobs);
  }

  // ---------- slide transitions ----------
  let navToken = 0;

  async function go(target, step = 0, opts = {}) {
    if (!slides.length) return;
    target = clamp(target, 0, slides.length - 1);
    const from = Deck.state.index;
    const fromEl = slideEls[from];
    const toEl = slideEls[target];
    const first = !Deck.state.started;

    finishAll(); // a press during a transition completes it at once, then moves on
    const token = ++navToken;

    if (!first && target === from) {
      const s = clamp(step === "last" ? stepCount(target) : step, 0, stepCount(target));
      if (s !== Deck.state.step) {
        applyStepInstant(target, s);
        Deck.state.step = s;
        slides[target].onStep?.(s, "jump", contexts[target]);
        emit("stepchange", { index: target, step: s, dir: "jump" });
        writeHash();
      }
      return;
    }

    const dir = first ? "forward" : target > from ? "forward" : "backward";
    const targetStep = step === "last" ? stepCount(target) : clamp(step, 0, stepCount(target));

    if (!first) {
      emit("beforeleave", { index: from, to: target, dir, step: targetStep });
      // Elements marked data-out (without a step) leave before the slide does, when moving forward.
      if (dir === "forward") {
        const outs = $$("[data-out]:not([data-out-step]):not([data-morph])", fromEl).filter((e) => !e.classList.contains("deck-hidden"));
        if (outs.length) {
          await Promise.all(outs.map((e) => animateEl(e, e.dataset.out, "out", { duration: 320 })));
          if (token !== navToken) return;
        }
      }
      contexts[from]._runCleanups();
      slides[from].onLeave?.(contexts[from], { to: target, dir });
    }

    // Prepare the incoming slide.
    applyStepInstant(target, targetStep);
    toEl.hidden = false;
    Deck.state.index = target;
    Deck.state.step = targetStep;
    Deck.state.started = true;
    updateTitlebar(dir);
    writeHash();
    // Plugins can measure the incoming slide here: displayed, in its final state, not yet animated.
    if (!first) emit("beforeenter", { index: target, from, dir, step: targetStep });

    const kind = first ? "none" : slides[target].transition || config.transition;
    const ms = dur(cssNumber("--deck-slide-ms", 700));
    const animateAutos = dir === "forward" || first;
    if (animateAutos) autoEls(target).forEach((e) => e.classList.add("deck-hidden"));

    slides[target].onEnter?.(contexts[target], { from, dir });
    emit("slidechange", { index: target, from, dir, step: targetStep });

    const autoDelay = kind === "none" || ms === 0 ? 0 : ms * 0.45;
    const autos = animateAutos ? playAutos(target, autoDelay) : Promise.resolve();

    if (!first && fromEl !== toEl) {
      Deck.el.stage.classList.add("is-transitioning");
      const jobs = [];
      const sign = dir === "forward" ? 1 : -1;
      if (kind === "slide" && ms > 0) {
        const easing = getComputedStyle(document.documentElement).getPropertyValue("--deck-ease").trim() || "ease-in-out";
        jobs.push(track(fromEl.animate([{ transform: "translate3d(0,0,0)", opacity: 1 }, { transform: `translate3d(${-sign * W}px,0,0)`, opacity: 0.4 }], { duration: ms, easing })).finished);
        jobs.push(track(toEl.animate([{ transform: `translate3d(${sign * W}px,0,0)`, opacity: 0.4 }, { transform: "translate3d(0,0,0)", opacity: 1 }], { duration: ms, easing })).finished);
      } else if (kind === "fade" && ms > 0) {
        jobs.push(track(fromEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms * 0.6, fill: "forwards" })).finished);
        jobs.push(track(toEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms * 0.6, delay: ms * 0.2, fill: "backwards" })).finished);
      }
      await Promise.all(jobs.map((p) => p.catch(() => {})));
      fromEl.getAnimations().forEach((a) => a.cancel());
      if (Deck.state.index !== from) fromEl.hidden = true;
      Deck.el.stage.classList.remove("is-transitioning");
    }
    await autos;
  }

  function next() {
    const max = stepCount(Deck.state.index);
    if (Deck.state.step < max) {
      finishAll();
      return runStep(Deck.state.index, Deck.state.step, Deck.state.step + 1);
    }
    if (Deck.state.index < slides.length - 1) return go(Deck.state.index + 1, 0);
  }
  function prev() {
    if (Deck.state.step > 0) {
      finishAll();
      return runStep(Deck.state.index, Deck.state.step, Deck.state.step - 1);
    }
    if (Deck.state.index > 0) return go(Deck.state.index - 1, "last");
  }
  Object.assign(Deck, { go, next, prev, first: () => go(0, 0), last: () => go(slides.length - 1, 0), stepCount, slideEl: (i) => slideEls[i ?? Deck.state.index], context: (i) => contexts[i ?? Deck.state.index], animate: animateEl, finishAll, track });

  // ---------- location hash: #/7 or #/7.2 (slide 7, step 2) — reload keeps your place ----------
  function writeHash() {
    const h = `#/${Deck.state.index + 1}${Deck.state.step ? "." + Deck.state.step : ""}`;
    if (location.hash !== h) history.replaceState(null, "", h);
  }
  function readHash() {
    const m = /^#\/(\d+)(?:\.(\d+))?/.exec(location.hash);
    return m ? { index: +m[1] - 1, step: +(m[2] || 0) } : { index: 0, step: 0 };
  }
  window.addEventListener("hashchange", () => {
    const { index, step } = readHash();
    if (index !== Deck.state.index || step !== Deck.state.step) go(index, step);
  });

  // ---------- theme, fullscreen ----------
  Deck.setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    setSetting("theme", t);
    emit("theme", t);
  };
  Deck.toggleTheme = () => Deck.setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  Deck.toggleFullscreen = () => {
    const d = document;
    const fsEl = d.fullscreenElement || d.webkitFullscreenElement;
    if (fsEl) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else {
      const root = d.documentElement;
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) {
        const p = req.call(root);
        if (p && p.catch) p.catch(() => {});
      }
    }
  };

  // ---------- modal layer bookkeeping (Esc closes the top one) ----------
  const openLayers = [];
  Deck.pushLayer = (name, close) => {
    Deck.popLayer(name);
    openLayers.push({ name, close });
  };
  Deck.popLayer = (name) => {
    const i = openLayers.findIndex((l) => l.name === name);
    if (i >= 0) openLayers.splice(i, 1);
  };
  Deck.hasLayer = () => openLayers.length > 0;
  Deck.closeTopLayer = () => {
    const top = openLayers.pop();
    if (top) top.close();
    return !!top;
  };

  // ---------- keyboard ----------
  addKeys(["ArrowRight", " ", "PageDown", "ArrowDown", "Enter"], () => next(), "Next step or slide", "Navigate", { allowRepeat: true });
  addKeys(["ArrowLeft", "PageUp", "ArrowUp", "Backspace", "Shift+ "], () => prev(), "Previous step or slide", "Navigate", { allowRepeat: true });
  addKeys(["Home"], () => go(0, 0), "First slide", "Navigate");
  addKeys(["End"], () => go(slides.length - 1, 0), "Last slide", "Navigate");
  addKeys(["f"], () => Deck.toggleFullscreen(), "Fullscreen", "View");
  addKeys(["t"], () => Deck.toggleTheme(), "Light / dark theme", "View");

  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "Escape") {
      if (Deck.closeTopLayer()) return e.preventDefault();
      emit("escape");
      return;
    }
    // A layer (popup) may claim keys first.
    if (Deck.keyTrap && Deck.keyTrap(e) === true) return e.preventDefault();
    const id = keyId(e);
    const hit = keymap.find((k) => k.keys.includes(id) || (k.keys.includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 && !/[a-z]/i.test(e.key)));
    if (!hit) return;
    if (e.repeat && !hit.allowRepeat) return e.preventDefault();
    e.preventDefault();
    hit.fn(e);
  });

  // ---------- idle cursor hides itself while presenting ----------
  let idleTimer;
  function wake() {
    document.body.classList.remove("deck-idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add("deck-idle"), 2500);
  }
  window.addEventListener("pointermove", wake, { passive: true });

  // ---------- start ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  Deck.escapeHtml = escapeHtml;

  function start() {
    build();
    emit("ready", Deck);
    const { index, step } = readHash();
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      document.body.classList.add("deck-ready");
      go(index, step);
    });
    wake();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else setTimeout(start);
})();
