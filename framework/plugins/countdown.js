/* Countdown lobby — a full-screen "the presentation is about to begin in…" screen for the minutes before the talk.
 *
 *   Deck.configure({ countdown: { title: "ADLC · Part 1", author: "Zsolt Batorfi", duration: "90 minutes",
 *                                 minutes: 5, visual: "hourglass", show: false } });
 *
 *   K  opens / closes the lobby (also: right-click menu, or open the deck as index.html?lobby)
 *   In the lobby:  Space start / pause · + / − five minutes more / less · V / Shift+V next / previous visual ·
 *                  R reset · → (or Enter, PageDown) begin the presentation · Esc / K back to the deck
 *
 * Ten visuals, all geometric and abstract, each showing the *feel* of the time left (a small mm:ss readout is always there):
 *   hourglass · tide · mosaic · fuse · summit · pendulum · puzzle · assembly · dominoes · sunrise
 * At zero the headline changes to "Let's begin", the visual plays its finale and geometric confetti bursts; the presenter then
 * presses → to start slide 1 (the first slide replays its entrance). The countdown follows the wall clock, so it stays correct if the
 * tab is busy or hidden, and it survives a reload.
 *
 * Options (all optional): title (default: the deck title) · author · duration (default: the timer length, e.g. "50 minutes") ·
 * minutes (initial countdown, default 5) · headline · startText · visual (default "hourglass") · show (open at load) ·
 * autoStart (start counting when opened) · startTimer (start the talk timer when you press → at the end).
 * The on-screen buttons fade out while the mouse is idle (they stay visible before the first start and while paused).
 * Reduced motion draws one still frame per second.
 * Load this plugin before typewriter/panzoom so it can claim the keys while it is open.
 * Deck.countdown: open · close · toggle · start · pause · reset · adjust(±minutes) · setRemaining(seconds) · visual(name) · visuals · state() · stats() */
(function () {
  "use strict";
  const KEY = "deck.countdown";
  const TAU = Math.PI * 2;
  const W = 1920, H = 1080;
  const VB = { x: 120, y: 330, w: 1680, h: 540, cx: 960, cy: 600 }; // the window the visuals live in
  const NAMES = ["hourglass", "tide", "mosaic", "fuse", "summit", "pendulum", "puzzle", "assembly", "dominoes", "sunrise"];
  const LABEL = { hourglass: "Hourglass", tide: "Tide", mosaic: "Minute mosaic", fuse: "Fuse", summit: "Summit", pendulum: "Pendulum wave", puzzle: "Puzzle", assembly: "Assembly", dominoes: "Dominoes", sunrise: "Sunrise" };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const frac = (x) => x - Math.floor(x);
  function prng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function rrect(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }

  Deck.on("ready", () => {
    const { h } = Deck.helpers;
    const cfg = Object.assign({ minutes: 5, headline: "The presentation is about to begin in…", startText: "Let’s begin", visual: "hourglass", show: false, autoStart: false, startTimer: false }, Deck.config.countdown || {});
    const stage = Deck.el.stage;

    // ---------- time model (wall clock based) ----------
    // status: idle | running | paused | done.  left = ms remaining while not running; endAt = wall-clock end while running.
    const initialMs = () => Math.max(0, Math.round(cfg.minutes * 60000));
    let S = { status: "idle", left: initialMs(), endAt: 0, span: Math.max(1, initialMs() / 1000), doneAt: 0 };
    try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v && v.status && v.span > 0) S = Object.assign(S, v); } catch (_) {}
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };
    const remainingMs = () => (S.status === "running" ? Math.max(0, S.endAt - Date.now()) : S.status === "done" ? 0 : S.left);
    let finaleFired = S.status === "done";

    function finish(at) {
      S.status = "done"; S.left = 0; S.doneAt = at || Date.now(); save();
      if (!finaleFired) { finaleFired = true; if (Date.now() - S.doneAt < 4000) triggerFinale(); }
      renderText();
    }
    function tick() { if (S.status === "running" && Date.now() >= S.endAt) finish(S.endAt); }
    function start() {
      if (S.status === "done") reset();
      if (S.status === "running") return;
      if (S.left <= 0) { S.status = "running"; S.endAt = Date.now(); finish(S.endAt); return; }
      S.span = Math.max(S.span, S.left / 1000);
      S.status = "running"; S.endAt = Date.now() + S.left; save(); renderText();
    }
    function pause() { if (S.status !== "running") return; S.left = remainingMs(); S.status = "paused"; save(); renderText(); }
    function toggle() { S.status === "running" ? pause() : start(); }
    function reset() {
      S = { status: "idle", left: initialMs(), endAt: 0, span: Math.max(1, initialMs() / 1000), doneAt: 0 };
      finaleFired = false; confetti.length = 0; shock = 0; build(); save(); renderText();
    }
    function setRemaining(sec) {
      const ms = Math.max(0, sec * 1000);
      if (S.status === "done") { S.status = "paused"; finaleFired = false; confetti.length = 0; shock = 0; }
      if (S.status === "running") S.endAt = Date.now() + ms; else S.left = ms;
      if (S.status === "idle" || sec > S.span) S.span = Math.max(1, sec);
      save(); build(); renderText();
      if (S.status === "running" && ms <= 0) finish();
    }
    function adjust(min) { setRemaining(remainingMs() / 1000 + min * 60); }

    // ---------- DOM ----------
    const root = h("div", { class: "deck-lobby", hidden: true, role: "dialog", "aria-label": "Countdown to the start of the presentation" });
    const canvas = h("canvas", { class: "lb-canvas", "aria-hidden": "true" });
    root.append(canvas);
    const text = h("div", { class: "lb-text" }, `
      <p class="lb-headline"></p>
      <div class="lb-digits" role="timer" aria-label="Time left"><span class="lb-time">--:--</span><span class="lb-chip" hidden></span></div>`);
    const meta = h("div", { class: "lb-meta" }, `<h1 class="lb-title"></h1><p class="lb-by"></p>`);
    const controls = h("div", { class: "lb-controls" }, `
      <div class="lb-row">
        <button data-a="m5" title="Five minutes less (−)">− 5 min</button>
        <button data-a="toggle" class="lb-main" title="Start / pause (Space)">Start</button>
        <button data-a="p5" title="Five minutes more (+)">+ 5 min</button>
      </div>
      <div class="lb-row lb-row2">
        <button data-a="prev" title="Previous visual (Shift+V)" aria-label="Previous visual">◀</button>
        <span class="lb-vname"></span>
        <button data-a="next" title="Next visual (V)" aria-label="Next visual">▶</button>
        <button data-a="reset" title="Reset (R)">Reset</button>
        <button data-a="begin" title="Start the presentation (→)">Begin →</button>
      </div>
      <p class="lb-hint">Space start · + − 5 min · V visual · R reset · → begin · Esc close</p>`);
    root.append(text, meta, controls);
    stage.append(root);
    const q = (s) => root.querySelector(s);
    const el = { headline: q(".lb-headline"), time: q(".lb-time"), chip: q(".lb-chip"), digits: q(".lb-digits"), title: q(".lb-title"), by: q(".lb-by"), main: q(".lb-main"), vname: q(".lb-vname") };

    const timerMin = () => Math.round(+Deck.settings.timerMinutes || Deck.config.timer?.minutes || 0);
    function metaText() {
      el.title.textContent = cfg.title || Deck.config.title || document.title;
      const dur = cfg.duration || (timerMin() ? `${timerMin()} minutes` : "");
      const parts = [cfg.author ? `Presented by ${cfg.author}` : "", dur ? `Duration ${dur}` : ""].filter(Boolean);
      el.by.textContent = parts.join("  ·  ");
      el.by.hidden = !parts.length;
    }
    function fmt(sec) {
      const v = Math.ceil(sec - 1e-6), hh = Math.floor(v / 3600), mm = Math.floor((v % 3600) / 60), ss = v % 60;
      return hh ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }
    let lastTime = "", lastStatus = "";
    function renderText() {
      const t = fmt(remainingMs() / 1000);
      if (t !== lastTime) { el.time.textContent = t; lastTime = t; }
      if (S.status !== lastStatus) {
        lastStatus = S.status;
        el.headline.textContent = S.status === "done" ? cfg.startText : cfg.headline;
        el.main.textContent = S.status === "running" ? "Pause" : S.status === "paused" ? "Resume" : S.status === "done" ? "Restart" : "Start";
        el.chip.hidden = S.status === "running" || S.status === "done";
        el.chip.textContent = S.status === "paused" ? "paused" : "press Start";
        root.dataset.status = S.status;
      }
    }

    // ---------- colours ----------
    const probe = h("span", { style: "position:absolute;visibility:hidden;pointer-events:none" });
    root.append(probe);
    function rgb(css, fb) {
      probe.style.color = ""; probe.style.color = css;
      const n = (getComputedStyle(probe).color.match(/[\d.]+/g) || []).map(Number);
      return n.length >= 3 ? `${Math.round(n[0])},${Math.round(n[1])},${Math.round(n[2])}` : fb;
    }
    const col = { a: "45,212,191", b: "244,241,234", m: "150,170,165", w: "245,158,11", bg: "16,32,31" };
    function readColours() {
      col.a = rgb("var(--deck-accent-on-rail)", col.a); col.b = rgb("var(--deck-on-rail)", col.b); col.m = rgb("var(--deck-muted-on-rail)", col.m);
      col.w = rgb(Deck.helpers.cssList("--deck-palette")[1] || "#F59E0B", col.w); col.bg = rgb("var(--deck-rail)", col.bg);
      font = (getComputedStyle(document.documentElement).getPropertyValue("--deck-font-sans") || "sans-serif").trim();
    }
    let font = "sans-serif";
    const R = (c, a) => `rgba(${c},${a})`;

    // ---------- the ten visuals: name(env) → { draw(c, st) } ; st = { r, f, u, e, span, t, dt, doneT, still, done } ----------
    const V = {};

    V.hourglass = (e) => {
      const Hh = 480, Wd = 340, neck = 12, top = VB.cy - Hh / 2, bot = VB.cy + Hh / 2, mid = VB.cy, cx = VB.cx;
      const halfW = (y) => (y < mid ? neck + (Wd / 2 - neck) * ((mid - y) / (mid - top)) : neck + (Wd / 2 - neck) * ((y - mid) / (bot - mid)));
      const glass = new Path2D();
      glass.moveTo(cx - Wd / 2, top); glass.lineTo(cx + Wd / 2, top); glass.lineTo(cx + neck, mid); glass.lineTo(cx + Wd / 2, bot); glass.lineTo(cx - Wd / 2, bot); glass.lineTo(cx - neck, mid); glass.closePath();
      return {
        draw(c, st) {
          const f = st.f, topY = mid - (mid - top) * Math.sqrt(f), hb = (bot - mid) * Math.sqrt(1 - f);
          c.save(); c.clip(glass);
          c.fillStyle = R(col.b, 0.05); c.fillRect(cx - Wd, top, Wd * 2, bot - top);
          c.fillStyle = R(col.w, 0.9); // sand above
          if (f > 0.002) { const w = halfW(topY); c.beginPath(); c.moveTo(cx - w, topY); c.quadraticCurveTo(cx, topY + (st.done ? 0 : 16 * Math.min(1, f * 6)), cx + w, topY); c.lineTo(cx + neck, mid); c.lineTo(cx - neck, mid); c.closePath(); c.fill(); }
          c.fillStyle = R(col.w, 0.9); // sand below
          if (hb > 1) { c.beginPath(); c.moveTo(cx - hb * 1.25, bot); c.quadraticCurveTo(cx - hb * 0.3, bot - hb * 0.96, cx, bot - hb); c.quadraticCurveTo(cx + hb * 0.3, bot - hb * 0.96, cx + hb * 1.25, bot); c.closePath(); c.fill(); }
          c.restore();
          if (st.running && f > 0.002) { // the falling thread
            c.strokeStyle = R(col.w, 0.95); c.lineWidth = 3; c.setLineDash([7, 9]); c.lineDashOffset = st.still ? 0 : -st.t * 140;
            c.beginPath(); c.moveTo(cx, mid - 6); c.lineTo(cx, bot - hb); c.stroke(); c.setLineDash([]);
          }
          c.lineJoin = "round"; c.strokeStyle = R(col.b, 0.7); c.lineWidth = 5; c.stroke(glass);
          c.strokeStyle = R(col.m, 0.9); c.lineWidth = 12; c.lineCap = "round";
          c.beginPath(); c.moveTo(cx - Wd / 2 - 26, top - 8); c.lineTo(cx + Wd / 2 + 26, top - 8); c.moveTo(cx - Wd / 2 - 26, bot + 8); c.lineTo(cx + Wd / 2 + 26, bot + 8); c.stroke(); c.lineCap = "butt";
          if (st.done) { const k = 0.5 + 0.5 * Math.sin(st.t * 3); c.strokeStyle = R(col.w, 0.25 + 0.3 * k); c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(cx, bot - 70, 120 + i * 60 + k * 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } }
        },
      };
    };

    V.tide = (e) => {
      const bub = Array.from({ length: 16 }, () => ({ x: VB.x + 60 + e.rand() * (VB.w - 200), s: 0.05 + e.rand() * 0.08, p: e.rand(), r: 4 + e.rand() * 7 }));
      const unit = e.span >= 900 ? 300 : 60;
      return {
        draw(c, st) {
          const bottom = VB.y + VB.h, f = st.f, level = VB.y + VB.h * (1 - f), amp = (6 + 12 * Math.min(1, f * 3)) * (st.done ? 1 + 2.2 * Math.exp(-st.doneT * 1.2) : 1);
          c.save(); c.beginPath(); rrect(c, VB.x, VB.y, VB.w, VB.h, 28); c.clip();
          c.fillStyle = R(col.b, 0.035); c.fillRect(VB.x, VB.y, VB.w, VB.h);
          const surf = (x, ph, k) => level + amp * k * Math.sin(x * 0.0058 + st.t * 1.25 + ph) + amp * 0.55 * k * Math.sin(x * 0.011 - st.t * 0.85 + ph * 2);
          for (let layer = 0; layer < 2; layer++) {
            const ph = layer ? 1.8 : 0, k = layer ? 0.8 : 1;
            c.beginPath(); c.moveTo(VB.x, bottom);
            for (let x = VB.x; x <= VB.x + VB.w + 24; x += 24) c.lineTo(x, surf(x, ph, k));
            c.lineTo(VB.x + VB.w, bottom); c.closePath();
            const g = c.createLinearGradient(0, level - amp, 0, bottom); g.addColorStop(0, R(col.a, layer ? 0.22 : 0.42)); g.addColorStop(1, R(col.a, layer ? 0.04 : 0.1));
            c.fillStyle = g; c.fill();
          }
          c.beginPath(); for (let x = VB.x; x <= VB.x + VB.w + 24; x += 24) { const y = surf(x, 0, 1); x === VB.x ? c.moveTo(x, y) : c.lineTo(x, y); }
          c.strokeStyle = R(col.b, 0.85); c.lineWidth = 3.5; c.stroke();
          c.strokeStyle = R(col.b, 0.4); c.lineWidth = 2;
          for (const b of bub) { const hgt = bottom - level; if (hgt < 30) continue; const yy = bottom - frac(b.p + (st.still ? 0 : st.t * b.s)) * hgt; if (yy > level + 10) { c.beginPath(); c.arc(b.x + Math.sin(yy * 0.03 + b.p * 9) * 8, yy, b.r, 0, TAU); c.stroke(); } }
          c.restore();
          c.font = `600 26px ${font}`; c.textAlign = "right"; c.textBaseline = "middle";
          for (let s = unit; s < e.span; s += unit) { const y = VB.y + VB.h * (1 - s / e.span), covered = y >= level; c.strokeStyle = R(col.b, covered ? 0.55 : 0.2); c.lineWidth = 2; c.beginPath(); c.moveTo(VB.x + VB.w - 70, y); c.lineTo(VB.x + VB.w - 28, y); c.stroke(); c.fillStyle = R(col.b, covered ? 0.75 : 0.35); c.fillText(`${Math.round(s / 60)}′`, VB.x + VB.w - 82, y); }
        },
      };
    };

    V.mosaic = (e) => {
      const unit = e.span <= 900 ? 15 : Math.max(60, Math.ceil(e.span / 120 / 60) * 60), n = Math.max(1, Math.ceil(e.span / unit));
      const cols = Math.ceil(Math.sqrt((n * VB.w) / VB.h)), rows = Math.ceil(n / cols), s = Math.min(VB.w / cols, VB.h / rows, 150), gap = s * 0.14;
      const ox = VB.cx - (cols * s) / 2, oy = VB.cy - (rows * s) / 2;
      const cell = (i) => ({ x: ox + (i % cols) * s + gap / 2, y: oy + Math.floor(i / cols) * s + gap / 2, cx: ox + (i % cols) * s + s / 2, cy: oy + Math.floor(i / cols) * s + s / 2 });
      const cells = Array.from({ length: n }, (_, i) => cell(i));
      return {
        draw(c, st) {
          const k = st.done ? n : Math.min(n - 1, Math.floor(st.e / unit)), within = st.done ? 1 : (st.e - k * unit) / unit, since = st.e - k * unit, sz = s - gap;
          const src = k > 0 ? cells[k - 1] : null;
          for (let i = 0; i < n; i++) {
            const p = cells[i]; let lit = 0;
            c.beginPath(); rrect(c, p.x, p.y, sz, sz, sz * 0.18);
            if (st.done) { const d = Math.hypot(p.cx - VB.cx, p.cy - VB.cy) / s; lit = clamp(st.doneT * 7 - d, 0, 1); c.fillStyle = R(col.a, 0.08 + 0.55 * lit); c.fill(); c.strokeStyle = R(col.w, 0.2 + 0.6 * lit); c.lineWidth = 2; c.stroke(); continue; }
            if (i < k) { c.fillStyle = R(col.a, 0.05); c.fill(); c.strokeStyle = R(col.b, 0.14); c.lineWidth = 2; c.stroke(); }
            else if (i === k) {
              c.fillStyle = R(col.b, 0.06); c.fill(); c.save(); c.clip(); c.fillStyle = R(col.w, 0.92); c.fillRect(p.x, p.y + sz * (1 - within), sz, sz * within); c.restore();
              c.strokeStyle = R(col.w, 0.5 + 0.4 * Math.sin(st.t * 3)); c.lineWidth = 3; c.stroke();
            } else { c.fillStyle = R(col.a, 0.55); c.fill(); c.strokeStyle = R(col.a, 0.9); c.lineWidth = 2; c.stroke(); }
            if (src && since < 2.4 && !st.still) { const d = Math.hypot(p.cx - src.cx, p.cy - src.cy) / s, w = Math.exp(-Math.pow(d - since * 5, 2) / 1.4) * (1 - since / 2.4); if (w > 0.02) { c.beginPath(); rrect(c, p.x, p.y, sz, sz, sz * 0.18); c.fillStyle = R(col.b, 0.55 * w); c.fill(); } }
          }
        },
      };
    };

    V.fuse = (e) => {
      const xl = VB.x + 50, xr = VB.x + VB.w - 50, rows = 5, ys = Array.from({ length: rows }, (_, i) => VB.y + 40 + (i * (VB.h - 80)) / (rows - 1));
      const pts = []; for (let i = 0; i < rows; i++) { const ltr = i % 2 === 0; pts.push([ltr ? xl : xr, ys[i]], [ltr ? xr : xl, ys[i]]); }
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const L = cum[cum.length - 1];
      const at = (d) => { d = clamp(d, 0, L); for (let i = 1; i < pts.length; i++) if (cum[i] >= d) { const f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; } return [pts[pts.length - 1][0], pts[pts.length - 1][1], pts.length - 1]; };
      const unit = e.span >= 1200 ? 300 : 60;
      return {
        draw(c, st) {
          const d = L * (1 - st.f), P = at(d);
          c.lineJoin = "round"; c.lineCap = "round";
          c.strokeStyle = R(col.m, 0.22); c.lineWidth = 2; c.setLineDash([3, 9]); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < P[2]; i++) c.lineTo(pts[i][0], pts[i][1]); c.lineTo(P[0], P[1]); c.stroke(); c.setLineDash([]);
          if (!st.done) {
            c.strokeStyle = R(col.b, 0.95); c.lineWidth = 9; c.beginPath(); c.moveTo(P[0], P[1]); for (let i = P[2]; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke();
            c.strokeStyle = R(col.bg, 0.4); c.lineWidth = 7; c.setLineDash([2, 16]); c.stroke(); c.setLineDash([]);
            c.fillStyle = R(col.a, 0.95); for (let s = unit; s < e.span; s += unit) { const dd = L * (s / e.span); if (dd > L - d - 1) continue; const q = at(L - dd); c.beginPath(); c.arc(q[0], q[1], 9, 0, TAU); c.fill(); }
          }
          const g = c.createRadialGradient(P[0], P[1], 0, P[0], P[1], 54); g.addColorStop(0, R(col.w, 0.95)); g.addColorStop(0.35, R(col.w, 0.35)); g.addColorStop(1, R(col.w, 0)); c.fillStyle = g; c.beginPath(); c.arc(P[0], P[1], 54, 0, TAU); c.fill();
          c.fillStyle = "#fff"; c.beginPath(); c.arc(P[0], P[1], 7, 0, TAU); c.fill();
          c.lineWidth = 3; for (let i = 0; i < 10; i++) { const ph = st.still ? i * 0.1 : frac(st.t * 2.6 + i * 0.37), ang = i * 0.63 + (st.still ? 0 : st.t * (i % 2 ? 4 : -4)), len = 14 + 34 * ph; c.strokeStyle = R(col.w, 0.9 * (1 - ph)); c.beginPath(); c.moveTo(P[0] + Math.cos(ang) * 10, P[1] + Math.sin(ang) * 10); c.lineTo(P[0] + Math.cos(ang) * (10 + len), P[1] + Math.sin(ang) * (10 + len)); c.stroke(); }
          if (st.done && st.doneT < 1.6) { c.strokeStyle = R(col.w, 0.7 * (1 - st.doneT / 1.6)); c.lineWidth = 6; c.beginPath(); c.arc(P[0], P[1], easeOut(st.doneT / 1.6) * 520, 0, TAU); c.stroke(); }
        },
      };
    };

    V.summit = (e) => {
      const N = 15, x0 = VB.x + 40, x1 = VB.x + VB.w - 150, bottom = VB.y + VB.h - 20, sumY = VB.y + 70;
      const ridge = Array.from({ length: N }, (_, i) => { const u = i / (N - 1); return [lerp(x0, x1, u), bottom - 40 - (bottom - 40 - sumY) * Math.pow(u, 1.25) + (i > 0 && i < N - 1 ? (e.rand() - 0.5) * 60 : 0)]; });
      const back = Array.from({ length: 11 }, (_, i) => { const u = i / 10; return [lerp(VB.x, VB.x + VB.w, u), bottom - 80 - 170 * Math.abs(Math.sin(u * 5.2 + 0.6)) - (e.rand() - 0.5) * 30]; });
      const cum = [0]; for (let i = 1; i < N; i++) cum.push(cum[i - 1] + Math.hypot(ridge[i][0] - ridge[i - 1][0], ridge[i][1] - ridge[i - 1][1]));
      const L = cum[N - 1];
      const at = (d) => { d = clamp(d, 0, L); for (let i = 1; i < N; i++) if (cum[i] >= d) { const f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [lerp(ridge[i - 1][0], ridge[i][0], f), lerp(ridge[i - 1][1], ridge[i][1], f), i]; } return [ridge[N - 1][0], ridge[N - 1][1], N - 1]; };
      const unit = e.span >= 1200 ? 300 : 60;
      return {
        draw(c, st) {
          c.lineJoin = "round"; c.lineCap = "round";
          c.beginPath(); c.moveTo(back[0][0], bottom); for (const p of back) c.lineTo(p[0], p[1]); c.lineTo(back[back.length - 1][0], bottom); c.closePath(); c.fillStyle = R(col.b, 0.05); c.fill();
          c.beginPath(); c.moveTo(ridge[0][0], bottom); for (const p of ridge) c.lineTo(p[0], p[1]); c.lineTo(ridge[N - 1][0], bottom); c.closePath(); c.fillStyle = R(col.a, 0.14); c.fill();
          c.strokeStyle = R(col.a, 0.1); c.lineWidth = 2; c.beginPath(); for (let i = 1; i < N - 1; i += 2) { c.moveTo(ridge[i][0], ridge[i][1]); c.lineTo(ridge[i][0] + 70, bottom); } c.stroke();
          const d = L * (1 - st.f), P = at(d);
          c.strokeStyle = R(col.a, 0.5); c.lineWidth = 5; c.beginPath(); c.moveTo(ridge[0][0], ridge[0][1]); for (let i = 1; i < N; i++) c.lineTo(ridge[i][0], ridge[i][1]); c.stroke();
          c.strokeStyle = R(col.w, 0.95); c.lineWidth = 7; c.beginPath(); c.moveTo(ridge[0][0], ridge[0][1]); for (let i = 1; i < P[2]; i++) c.lineTo(ridge[i][0], ridge[i][1]); c.lineTo(P[0], P[1]); c.stroke();
          c.fillStyle = R(col.b, 0.9); for (let s = unit; s < e.span; s += unit) { const q = at(L * (1 - s / e.span)); c.beginPath(); c.arc(q[0], q[1], 6, 0, TAU); c.fill(); }
          const sx = ridge[N - 1][0], sy = ridge[N - 1][1], wave = st.still ? 0 : Math.sin(st.t * 3);
          c.strokeStyle = R(col.b, 0.9); c.lineWidth = 4; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx, sy - 96); c.stroke();
          c.fillStyle = R(st.done ? col.w : col.a, 0.95); c.beginPath(); c.moveTo(sx, sy - 96); c.lineTo(sx + 56 + wave * 6, sy - 80 + wave * 3); c.lineTo(sx, sy - 62); c.closePath(); c.fill();
          const gl = c.createRadialGradient(P[0], P[1] - 14, 0, P[0], P[1] - 14, 40); gl.addColorStop(0, R(col.w, 0.7)); gl.addColorStop(1, R(col.w, 0)); c.fillStyle = gl; c.beginPath(); c.arc(P[0], P[1] - 14, 40, 0, TAU); c.fill();
          c.fillStyle = "#fff"; c.beginPath(); c.arc(P[0], P[1] - 14, 11, 0, TAU); c.fill();
          if (st.done) { c.strokeStyle = R(col.w, 0.7); c.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU + st.t * 0.4, r0 = 40 + 8 * Math.sin(st.t * 4 + i), r1 = 100 + 30 * Math.sin(st.t * 3 + i * 2); c.beginPath(); c.moveTo(sx + Math.cos(a) * r0, sy - 80 + Math.sin(a) * r0); c.lineTo(sx + Math.cos(a) * r1, sy - 80 + Math.sin(a) * r1); c.stroke(); } }
        },
      };
    };

    V.pendulum = (e) => {
      const N = 17, A = 200, K = Math.max(24, Math.round(e.span / 3)), xs = Array.from({ length: N }, (_, i) => VB.x + 90 + (i * (VB.w - 180)) / (N - 1));
      const yAt = (i, r) => VB.cy + A * Math.sin(TAU * (K + i) * (r / e.span));
      return {
        draw(c, st) {
          c.strokeStyle = R(col.b, 0.07); c.lineWidth = 2; c.beginPath(); for (let i = 0; i < N; i++) { c.moveTo(xs[i], VB.cy - A - 26); c.lineTo(xs[i], VB.cy + A + 26); } c.stroke();
          c.strokeStyle = R(col.b, 0.14); c.beginPath(); c.moveTo(VB.x + 40, VB.cy); c.lineTo(VB.x + VB.w - 40, VB.cy); c.stroke();
          c.lineJoin = "round"; c.strokeStyle = R(col.a, 0.5); c.lineWidth = 3; c.beginPath(); for (let i = 0; i < N; i++) { const y = yAt(i, st.r); i ? c.lineTo(xs[i], y) : c.moveTo(xs[i], y); } c.stroke();
          for (let i = 0; i < N; i++) {
            const m = i / (N - 1), cc = m < 0.5 ? col.a : col.w, y = yAt(i, st.r), glow = st.done ? 0.5 + 0.5 * Math.sin(st.t * 3 - i * 0.5) : 0;
            if (!st.still && !st.done) for (let k = 5; k >= 1; k--) { c.fillStyle = R(cc, 0.05 + 0.025 * (6 - k)); c.beginPath(); c.arc(xs[i], yAt(i, st.r + k * 0.07), 13, 0, TAU); c.fill(); }
            c.fillStyle = R(cc, 0.95); c.beginPath(); c.arc(xs[i], y, 15 + glow * 4, 0, TAU); c.fill();
            c.fillStyle = R(col.b, 0.9); c.beginPath(); c.arc(xs[i] - 4, y - 4, 4, 0, TAU); c.fill();
          }
        },
      };
    };

    V.puzzle = (e) => {
      // a scramble made by greedy-but-random moves away from "solved"; replayed backwards it solves itself exactly at zero
      const M = clamp(Math.round(e.span / 2.5), 12, 80), home = (t) => [(t - 1) % 4, Math.floor((t - 1) / 4)], man = (t, cell) => (t ? Math.abs(home(t)[0] - (cell % 4)) + Math.abs(home(t)[1] - Math.floor(cell / 4)) : 0);
      const states = [Int8Array.from({ length: 16 }, (_, i) => (i + 1) % 16)], moves = [];
      let prevTile = -1;
      for (let j = 0; j < M; j++) {
        const s = states[j], b = s.indexOf(0), cand = [];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = (b % 4) + dx, y = Math.floor(b / 4) + dy; if (x < 0 || x > 3 || y < 0 || y > 3) continue; const p = y * 4 + x, t = s[p]; if (t === prevTile) continue; cand.push({ p, t, w: Math.exp(2.2 * (man(t, b) - man(t, p))) }); }
        let tot = cand.reduce((a, c2) => a + c2.w, 0), r = e.rand() * tot, pick = cand[0]; for (const c2 of cand) { r -= c2.w; if (r <= 0) { pick = c2; break; } }
        const n = Int8Array.from(s); n[b] = pick.t; n[pick.p] = 0; states.push(n); moves.push({ tile: pick.t, from: pick.p, to: b }); prevTile = pick.t;
      }
      const T = 112, G = 10, B = 4 * T + 3 * G, ox = VB.cx - B / 2, oy = VB.cy - B / 2;
      const pos = (cell) => [ox + (cell % 4) * (T + G), oy + Math.floor(cell / 4) * (T + G)];
      return {
        draw(c, st) {
          const cM = st.f * M, k = Math.min(M - 1, Math.floor(cM)), fr = st.f >= 1 ? 1 : cM - k, slideShare = Math.min(1, 0.7 / (e.span / M)), sp = st.done ? 1 : 1 - clamp(fr / slideShare, 0, 1);
          const S0 = states[st.done ? 0 : k + 1], mv = st.done ? null : moves[k];
          c.textAlign = "center"; c.textBaseline = "middle"; c.font = `700 52px ${font}`;
          for (let cell = 0; cell < 16; cell++) {
            const t = S0[cell]; if (!t) continue;
            let p = pos(cell); if (mv && t === mv.tile) { const a = pos(mv.to), b2 = pos(mv.from), q2 = easeInOut(sp); p = [lerp(a[0], b2[0], q2), lerp(a[1], b2[1], q2)]; }
            const placed = (t - 1) === cell || (mv && t === mv.tile && sp >= 1 && (t - 1) === mv.from), lit = st.done ? clamp(st.doneT * 5 - ((t - 1) % 4 + Math.floor((t - 1) / 4)) * 0.6, 0, 1) : 0;
            c.beginPath(); rrect(c, p[0], p[1], T, T, 20);
            c.fillStyle = st.done ? R(col.w, 0.25 + 0.6 * lit) : placed ? R(col.a, 0.38) : R(col.b, 0.07); c.fill();
            c.strokeStyle = st.done ? R(col.w, 0.5 + 0.5 * lit) : placed ? R(col.a, 0.95) : R(col.b, 0.3); c.lineWidth = 3; c.stroke();
            c.fillStyle = R(col.b, placed || st.done ? 0.98 : 0.7); c.fillText(String(t), p[0] + T / 2, p[1] + T / 2 + 3);
          }
        },
      };
    };

    V.assembly = (e) => {
      const n = 12, Ls = 500, sl = Ls / n, rh = (Ls * Math.sqrt(3)) / 2 / n, cxo = VB.cx + 0.433 * Ls, cyo = VB.cy;
      const rot = (x, y) => [cxo - y, cyo + x]; // apex up → apex right, centred
      const pieces = [];
      for (let r = 0; r < n; r++) for (let j = 0; j <= r; j++) for (let kind = 0; kind < 2; kind++) {
        if (kind === 1 && j === r) continue;
        const v = kind === 0 ? [[-r * sl / 2 + j * sl, r * rh], [-(r + 1) * sl / 2 + j * sl, (r + 1) * rh], [-(r + 1) * sl / 2 + (j + 1) * sl, (r + 1) * rh]] : [[-r * sl / 2 + j * sl, r * rh], [-r * sl / 2 + (j + 1) * sl, r * rh], [-(r + 1) * sl / 2 + (j + 1) * sl, (r + 1) * rh]];
        const w = v.map((p) => rot(p[0], p[1])), tx = (w[0][0] + w[1][0] + w[2][0]) / 3, ty = (w[0][1] + w[1][1] + w[2][1]) / 3;
        const sx = lerp(VB.x + 60, VB.x + VB.w - 60, e.rand()), sy = lerp(VB.y + 40, VB.y + VB.h - 40, e.rand());
        pieces.push({ off: w.map((p) => [p[0] - tx, p[1] - ty]), tx, ty, sx, sy, a0: (e.rand() - 0.5) * 9, s0: 0.7 + e.rand() * 0.9, o: e.rand() * 0.76, ph: e.rand() * TAU, c: e.rand() < 0.62 ? col.a : e.rand() < 0.6 ? col.b : col.w });
      }
      return {
        draw(c, st) {
          const u = st.u; const locked = [];
          for (const p of pieces) {
            const qv = st.done ? 1 : easeInOut(clamp((u - p.o) / 0.24, 0, 1));
            const drift = (1 - qv) * (st.still ? 0 : 1), x = lerp(p.sx + Math.sin(st.t * 0.6 + p.ph) * 16 * drift, p.tx, qv), y = lerp(p.sy + Math.cos(st.t * 0.5 + p.ph) * 14 * drift, p.ty, qv);
            const ang = p.a0 * (1 - qv) + (st.still ? 0 : Math.sin(st.t * 0.4 + p.ph) * 0.25 * (1 - qv)), sc = lerp(p.s0, 0.94, qv), ca = Math.cos(ang), sa = Math.sin(ang);
            if (qv >= 1) { locked.push(p); continue; }
            c.fillStyle = R(p.c, 0.28 + 0.4 * qv); c.beginPath(); for (let i = 0; i < 3; i++) { const ox2 = p.off[i][0] * sc, oy2 = p.off[i][1] * sc, px = x + ox2 * ca - oy2 * sa, py = y + ox2 * sa + oy2 * ca; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fill();
          }
          const band = VB.cx - 330 + (st.done ? st.doneT * 760 : -999);
          for (const p of locked) {
            const sh = st.done ? Math.exp(-Math.pow((p.tx - band) / 90, 2)) : 0, x = p.tx, y = p.ty + (st.still ? 0 : Math.sin(st.t * 0.9 + p.ph) * 0.8);
            c.fillStyle = R(p.c, clamp(0.78 + 0.2 * sh, 0, 1)); c.beginPath(); for (let i = 0; i < 3; i++) { const px = x + p.off[i][0] * 0.94, py = y + p.off[i][1] * 0.94; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fill();
            if (sh > 0.05) { c.fillStyle = R("255,255,255", 0.5 * sh); c.fill(); }
          }
        },
      };
    };

    V.dominoes = (e) => {
      const N = clamp(Math.round(e.span / (e.span > 2400 ? 60 : e.span > 1200 ? 40 : 20)), 8, 60), unit = e.span / N;
      const sp = (VB.w - 140 - 190) / (N - 1), hD = clamp(sp * 3.2, 70, 170), wD = clamp(sp * 0.3, 8, 28), base = VB.y + VB.h - 90, x0 = VB.x + 70, fall = Math.min(0.9, unit * 0.8), ang = 1.26;
      return {
        draw(c, st) {
          c.strokeStyle = R(col.m, 0.45); c.lineWidth = 4; c.beginPath(); c.moveTo(VB.x + 20, base + 2); c.lineTo(VB.x + VB.w - 20, base + 2); c.stroke();
          let nextI = -1;
          for (let i = 0; i < N; i++) {
            const startT = (i + 1) * unit - fall, qv = st.done ? 1 : clamp((st.e - startT) / fall, 0, 1);
            if (qv < 1 && nextI < 0) nextI = i;
            const trem = !st.still && qv === 0 && startT - st.e < 3 && startT - st.e > 0 ? Math.sin(st.t * 38) * 0.012 * (1 - (startT - st.e) / 3) : 0;
            const a = ang * qv * qv * qv + trem, px = x0 + i * sp + wD / 2, wave = st.done ? Math.exp(-Math.pow(st.doneT * 9 - i, 2) / 5) : 0;
            c.save(); c.translate(px, base); c.rotate(a); c.beginPath(); rrect(c, -wD, -hD, wD, hD, 3);
            c.fillStyle = qv >= 1 ? R(col.a, 0.5 + 0.4 * wave) : R(col.b, 0.92); c.fill();
            c.strokeStyle = qv >= 1 ? R(col.w, 0.2 + 0.8 * wave) : R(col.a, 0.9); c.lineWidth = 2; c.stroke();
            if (wD >= 14) { c.fillStyle = R(col.bg, 0.65); for (const f2 of [0.28, 0.72]) { c.beginPath(); c.arc(-wD / 2, -hD * f2, wD * 0.14, 0, TAU); c.fill(); } }
            c.restore();
          }
          if (nextI >= 0 && !st.done) { const px = x0 + nextI * sp; const g = c.createRadialGradient(px, base - hD / 2, 0, px, base - hD / 2, hD * 0.8); g.addColorStop(0, R(col.w, 0.22)); g.addColorStop(1, R(col.w, 0)); c.fillStyle = g; c.fillRect(px - hD, base - hD * 1.4, hD * 2, hD * 1.6); }
        },
      };
    };

    V.sunrise = (e) => {
      const hz = VB.y + VB.h * 0.7, topY = VB.y + VB.h * 0.3, R0 = 78;
      const stars = Array.from({ length: 40 }, () => ({ x: VB.x + e.rand() * VB.w, y: VB.y + 10 + e.rand() * VB.h * 0.55, p: e.rand() * TAU, r: 1.5 + e.rand() * 2.4 }));
      const ridge = (base, amp, step) => { const pts = []; for (let x = VB.x - step; x <= VB.x + VB.w + step; x += step) pts.push([x, base - e.rand() * amp]); return pts; };
      const layers = [{ p: ridge(hz - 30, 110, 130), a: 0.16 }, { p: ridge(hz + 5, 80, 110), a: 0.28 }, { p: ridge(hz + 50, 50, 90), a: 1 }];
      return {
        draw(c, st) {
          const u = st.u, eu = u;
          c.save(); c.beginPath(); rrect(c, VB.x, VB.y, VB.w, VB.h, 28); c.clip();
          const g = c.createLinearGradient(0, VB.y, 0, hz + 60); g.addColorStop(0, R(col.a, 0.03)); g.addColorStop(0.7, R(col.a, 0.1 + 0.12 * u)); g.addColorStop(1, R(col.w, 0.06 + 0.5 * u)); c.fillStyle = g; c.fillRect(VB.x, VB.y, VB.w, VB.h);
          for (const s of stars) { c.fillStyle = R(col.b, clamp((1 - u) * (0.35 + 0.45 * Math.sin(st.t * 1.3 + s.p)), 0, 1)); c.beginPath(); c.arc(s.x, s.y, s.r, 0, TAU); c.fill(); }
          const sy = hz + 120 - (hz + 120 - topY) * eu, sx = VB.cx;
          for (let i = 0; i < 3; i++) { const rr = 130 + i * 64 + (st.still ? 0 : Math.sin(st.t * 1.2 + i) * 6); c.strokeStyle = R(col.w, (0.2 - i * 0.05) * (0.3 + u)); c.lineWidth = 3; c.beginPath(); c.arc(sx, sy, rr, 0, TAU); c.stroke(); }
          const rays = 18, rot = st.t * (st.done ? 0.25 : 0.08); c.fillStyle = R(col.w, 0.22 * Math.pow(u, 1.5));
          for (let i = 0; i < rays; i++) { const a = (i / rays) * TAU + rot, l = 330 + 70 * Math.sin(i * 2.1 + st.t); c.beginPath(); c.moveTo(sx + Math.cos(a - 0.04) * 110, sy + Math.sin(a - 0.04) * 110); c.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); c.lineTo(sx + Math.cos(a + 0.04) * 110, sy + Math.sin(a + 0.04) * 110); c.closePath(); c.fill(); }
          const sg = c.createRadialGradient(sx, sy, 0, sx, sy, R0 * 2.4); sg.addColorStop(0, R(col.w, 0.55)); sg.addColorStop(1, R(col.w, 0)); c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, R0 * 2.4, 0, TAU); c.fill();
          c.fillStyle = R(col.w, 1); c.beginPath(); c.arc(sx, sy, R0, 0, TAU); c.fill();
          for (const l of layers) { c.beginPath(); c.moveTo(l.p[0][0], VB.y + VB.h + 4); for (const p of l.p) c.lineTo(p[0], p[1]); c.lineTo(l.p[l.p.length - 1][0], VB.y + VB.h + 4); c.closePath(); c.fillStyle = l.a >= 1 ? R(col.bg, 1) : R(col.a, l.a); c.fill(); if (l.a >= 1) { c.strokeStyle = R(col.a, 0.5); c.lineWidth = 2; c.stroke(); } }
          c.restore();
        },
      };
    };

    // ---------- confetti and shockwave at zero ----------
    const confetti = []; let shock = 0, shockStart = 0;
    function triggerFinale() {
      if (reduced()) return;
      const rand = prng(Date.now() & 0xffff);
      for (let i = 0; i < 150; i++) { const a = -Math.PI / 2 + (rand() - 0.5) * 2.4, sp = 500 + rand() * 1100; confetti.push({ x: VB.cx + (rand() - 0.5) * 300, y: VB.cy + 80, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, rot: rand() * TAU, vr: (rand() - 0.5) * 12, s: 14 + rand() * 18, k: (rand() * 4) | 0, c: [col.a, col.b, col.w, col.a][(rand() * 4) | 0], age: 0, life: 3.6 + rand() * 1.6 }); }
      shock = 1; shockStart = performance.now();
    }
    function drawConfetti(c, dt) {
      if (shock) { const tt = (performance.now() - shockStart) / 1000; if (tt > 1.5) shock = 0; else { c.strokeStyle = R(col.b, 0.6 * (1 - tt / 1.5)); c.lineWidth = 8; c.beginPath(); c.arc(VB.cx, VB.cy, easeOut(tt / 1.5) * 1300, 0, TAU); c.stroke(); } }
      for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i]; p.age += dt; if (p.age > p.life || p.y > H + 60) { confetti.splice(i, 1); continue; }
        p.vy += 1500 * dt; p.vx *= 1 - 0.9 * dt; p.vy *= 1 - 0.5 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = R(p.c, clamp((p.life - p.age) / 0.8, 0, 1) * 0.95); c.beginPath();
        if (p.k === 0) { c.moveTo(0, -p.s * 0.6); c.lineTo(p.s * 0.55, p.s * 0.45); c.lineTo(-p.s * 0.55, p.s * 0.45); c.closePath(); }
        else if (p.k === 1) c.rect(-p.s * 0.4, -p.s * 0.4, p.s * 0.8, p.s * 0.8);
        else if (p.k === 2) { c.moveTo(0, -p.s * 0.6); c.lineTo(p.s * 0.4, 0); c.lineTo(0, p.s * 0.6); c.lineTo(-p.s * 0.4, 0); c.closePath(); }
        else c.arc(0, 0, p.s * 0.32, 0, TAU);
        c.fill(); c.restore();
      }
    }

    // ---------- rendering loop ----------
    const reduced = () => Deck.settings.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    const RES = 0.75; canvas.width = W * RES; canvas.height = H * RES;
    let visual = NAMES.includes(Deck.settings.countdownVisual) ? Deck.settings.countdownVisual : NAMES.includes(cfg.visual) ? cfg.visual : "hourglass";
    let inst = null, builtKey = "", rs = 0, raf = 0, last = 0, fps = 30, ema = 0, frames = 0, open = false;
    function build() {
      const key = visual + "|" + Math.round(S.span);
      if (key === builtKey && inst) return;
      builtKey = key; readColours();
      inst = V[visual]({ rand: prng(4242 + NAMES.indexOf(visual) * 77), span: S.span });
      el.vname.textContent = LABEL[visual];
    }
    function stateNow(dt) {
      const r = remainingMs() / 1000;
      if (Math.abs(rs - r) > 1) rs += (r - rs) * Math.min(1, dt * 7); else rs = r; // follow exactly while the clock runs, glide on jumps
      const f = clamp(rs / S.span, 0, 1), still = reduced();
      return { r: rs, f, u: 1 - f, e: S.span - rs, span: S.span, t: still ? 0 : performance.now() / 1000, dt, running: S.status === "running", done: S.status === "done", doneT: S.status === "done" ? Math.max(0, (Date.now() - S.doneAt) / 1000) : -1, still };
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !open) { last = now; return; }
      const interval = reduced() ? 1000 : 1000 / fps;
      if (now - last < interval - 2) return;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const t0 = performance.now();
      ctx.setTransform(RES, 0, 0, RES, 0, 0); ctx.clearRect(0, 0, W, H);
      const st = stateNow(dt);
      inst.draw(ctx, st);
      if (!st.still) drawConfetti(ctx, dt);
      const cost = performance.now() - t0; frames++; ema = ema ? ema * 0.9 + cost * 0.1 : cost;
      if (frames > 30 && ema > 14 && fps > 15) fps = 15; // governor: a slow machine gets a calmer rate
    }

    // ---------- open / close / begin ----------
    let idleTimer = 0;
    const wake = () => { root.classList.remove("is-idle"); clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (S.status === "running" || S.status === "done") root.classList.add("is-idle"); }, 3500); };
    function openLobby() {
      if (open) return;
      open = true; metaText(); readColours(); build(); renderText();
      root.hidden = false; requestAnimationFrame(() => root.classList.add("is-open")); wake();
      Deck.tools?.update?.();
      if (cfg.autoStart && S.status === "idle") start();
      last = performance.now(); rs = remainingMs() / 1000;
    }
    function closeLobby() {
      if (!open) return;
      open = false; root.classList.remove("is-open", "is-idle"); setTimeout(() => { if (!open) root.hidden = true; }, 450);
    }
    function replayFirstSlide() {
      if (Deck.state.index !== 0 || Deck.state.step !== 0) return;
      const ctxs = Deck.context(0); if (!ctxs) return;
      for (const n of ctxs.$$("[data-anim]:not([data-step])")) Deck.animate(n, n.dataset.anim, "in", { delay: +n.dataset.delay || 0, duration: n.dataset.duration ? +n.dataset.duration : undefined });
      Deck.typewriter?.replay?.();
    }
    function begin() {
      const wasOpen = open; closeLobby(); if (!wasOpen) return;
      if (cfg.startTimer) Deck.tools?.timer?.start?.();
      if (Deck.state.index !== 0) Deck.go(0, 0); else replayFirstSlide();
    }
    function toggleLobby() { open ? closeLobby() : openLobby(); }
    function setVisual(name) { if (!NAMES.includes(name)) return; visual = name; Deck.setSetting("countdownVisual", name); builtKey = ""; build(); }
    const cycle = (d) => setVisual(NAMES[(NAMES.indexOf(visual) + d + NAMES.length) % NAMES.length]);

    // ---------- input ----------
    controls.addEventListener("click", (ev) => {
      const b = ev.target.closest("button"); if (!b) return;
      ({ m5: () => adjust(-5), p5: () => adjust(5), toggle, prev: () => cycle(-1), next: () => cycle(1), reset, begin }[b.dataset.a] || (() => {}))();
      b.blur(); wake();
    });
    root.addEventListener("pointermove", wake); root.addEventListener("pointerdown", wake);
    const NAV = new Set(["ArrowLeft", "ArrowUp", "ArrowDown", "PageUp", "Home", "End", "Backspace", "g", "o", "e", "y"]);
    window.addEventListener("keydown", (ev) => {
      if (!open || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const k = ev.key; let used = true;
      if (k === " ") toggle();
      else if (k === "+" || k === "=") adjust(5);
      else if (k === "-" || k === "_") adjust(-5);
      else if (k === "v") cycle(1);
      else if (k === "V") cycle(-1);
      else if (k === "r" || k === "R") reset();
      else if (k === "ArrowRight" || k === "PageDown" || k === "Enter") begin();
      else if (k === "k" || k === "K") closeLobby();
      else if (k === "Escape" && !Deck.hasLayer()) closeLobby();
      else if (NAV.has(k)) { /* swallow navigation while the lobby is up */ }
      else used = false;
      if (used) { ev.preventDefault(); ev.stopImmediatePropagation(); wake(); }
    }, true);
    Deck.addKeys(["k"], toggleLobby, "Countdown screen before the talk", "View");
    Deck.on("theme", () => { builtKey = ""; if (open) { readColours(); build(); } });
    Deck.on("settings", ({ key }) => { if (key === "timerMinutes") metaText(); });

    setInterval(() => { tick(); if (open) renderText(); }, 250);
    raf = requestAnimationFrame(frame);
    metaText(); renderText();

    Deck.countdown = {
      open: openLobby, close: closeLobby, toggle: toggleLobby, begin, start, pause, reset, adjust, setRemaining,
      visual: (n) => (n ? setVisual(n) : visual), visuals: NAMES.slice(),
      get isOpen() { return open; },
      state: () => ({ status: S.status, remaining: Math.round(remainingMs() / 1000), span: Math.round(S.span), visual }),
      stats: () => ({ fps, avgCostMs: +ema.toFixed(2), frames, confetti: confetti.length }),
    };

    const hashOk = !location.hash || /^#\/1(\.0)?$/.test(location.hash);
    if ((cfg.show || /[?&]lobby\b/.test(location.search)) && hashOk) openLobby();
  });
})();
