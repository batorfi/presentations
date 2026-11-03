/* Animated backgrounds — a quiet, algorithmic animation behind the slide, drawn on one small canvas.
 *
 *   Deck.configure({ background: { theme: "aurora" } });          a default for every slide (or just "aurora")
 *   Deck.slide({ ..., background: "constellation" });             this slide's own theme
 *   Deck.slide({ ..., background: { theme: "flow", intensity: 1.4, speed: 0.7, seed: 3, colors: ["#0F7B6C", "#3B6FB6"] } });
 *   Deck.slide({ ..., background: "none" });                      a still, plain slide
 *
 *   Themes: constellation · flow · aurora · ripples · grid · orbits · waves · circuit · contours · bokeh
 *   intensity (default 1)   how visible: 0.3 whisper … 2 clearly present      speed (default 1)   the pace of the motion
 *   seed                    another random layout, the same every time          colors   one to three CSS colours (default: the theme's accent colours)
 *
 * The animation sits under the slide and is strongest toward the edges and corners, fading to a very low level behind the
 * content, so text and figures stay fully readable. Colours come from the deck theme and follow light / dark.
 *
 * Built to be cheap: a half-resolution canvas (a quarter for the soft themes) capped at 30 fps; one slide's theme runs at a time;
 * it pauses while the tab is hidden or a pointer tool (laser, draw, lens, spotlight) is on. A governor watches the time each
 * frame takes and steps the rate down 30 → 20 → 12 fps, and finally to a still frame, if the machine is struggling.
 * A new theme fades in after the slide has settled; the same theme on the next slide carries on unbroken.
 * Mode (right-click menu or B): Animated → Still (one frame) → Off. Reduced motion shows a still frame.
 * Deck.background.stats() reports theme, fps and average frame cost. */
(function () {
  "use strict";

  Deck.on("ready", () => {
    const { clamp } = Deck.helpers;
    const W = 1920, H = 1080, TAU = Math.PI * 2;
    const stage = Deck.el.stage;

    // ---------- small helpers ----------
    function prng(seed) {
      let a = seed >>> 0;
      return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    }
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
    stage.append(probe);
    /** Any CSS colour (including var() and color-mix()) as "r,g,b". */
    function rgb(css, fallback) {
      probe.style.color = "";
      probe.style.color = css;
      const c = getComputedStyle(probe).color || "";
      const n = (c.match(/[\d.]+/g) || []).map(Number);
      if (n.length < 3) return fallback;
      const s = c.startsWith("color(") ? 255 : 1;
      return `${Math.round(n[0] * s)},${Math.round(n[1] * s)},${Math.round(n[2] * s)}`;
    }

    // ---------- the themes: each returns { res, persistent?, step(dt), draw(ctx), recolor() } ----------
    const THEMES = {
      constellation(e) {
        const n = 44, nodes = [];
        for (let i = 0; i < n; i++) nodes.push({ x: e.rand() * W, y: e.rand() * H, vx: (e.rand() - 0.5) * 36, vy: (e.rand() - 0.5) * 36, r: 2 + e.rand() * 2.4, c: e.rand() < 0.7 ? 0 : 1 });
        const D = 270, buckets = 6, paths = [];
        return {
          res: 0.5,
          step(dt) { for (const p of nodes) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40; if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40; } },
          draw(c) {
            const lines = Array.from({ length: buckets }, () => []);
            for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
              const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
              if (d2 < D * D) lines[Math.min(buckets - 1, ((1 - Math.sqrt(d2) / D) * buckets) | 0)].push(a, b);
            }
            c.lineWidth = 1.6; c.strokeStyle = e.col.a;
            for (let k = 0; k < buckets; k++) {
              const l = lines[k]; if (!l.length) continue;
              c.globalAlpha = e.al(0.07 + (k / buckets) * 0.3);
              c.beginPath(); for (let i = 0; i < l.length; i += 2) { c.moveTo(l[i].x, l[i].y); c.lineTo(l[i + 1].x, l[i + 1].y); } c.stroke();
            }
            for (let g = 0; g < 2; g++) {
              c.globalAlpha = e.al(0.5); c.fillStyle = g ? e.col.b : e.col.a; c.beginPath();
              for (const p of nodes) if (p.c === g) { c.moveTo(p.x + p.r, p.y); c.arc(p.x, p.y, p.r, 0, TAU); }
              c.fill();
            }
          },
        };
      },

      flow(e) {
        const N = 150, ps = [];
        const spawn = (p) => { p.x = e.rand() * W; p.y = e.rand() * H; p.age = 0; p.life = 6 + e.rand() * 8; p.c = e.rand() < 0.65 ? 0 : 1; p.px = p.x; p.py = p.y; return p; };
        for (let i = 0; i < N; i++) { spawn(ps[i] = {}); ps[i].age = e.rand() * ps[i].life; }
        let t = 0;
        const ang = (x, y) => (Math.sin(x * 0.0021 + t * 0.15) + Math.sin(y * 0.0027 - t * 0.11) + Math.sin((x + y) * 0.0014 + t * 0.07)) * 1.15;
        return {
          res: 0.5, persistent: true,
          step(dt) {
            t += dt;
            for (const p of ps) {
              p.px = p.x; p.py = p.y; p.age += dt;
              const a = ang(p.x, p.y); p.x += Math.cos(a) * 62 * dt; p.y += Math.sin(a) * 62 * dt;
              if (p.age > p.life || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) spawn(p);
            }
          },
          draw(c) {
            c.globalCompositeOperation = "destination-out"; c.globalAlpha = 1; c.fillStyle = "rgba(0,0,0,0.045)"; c.fillRect(0, 0, W, H);
            c.globalCompositeOperation = "source-over"; c.lineWidth = 1.8; c.lineCap = "round";
            for (let g = 0; g < 2; g++) {
              c.strokeStyle = g ? e.col.b : e.col.a; c.beginPath();
              for (const p of ps) if (p.c === g) { c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); }
              c.globalAlpha = e.al(0.55); c.stroke();
            }
          },
        };
      },

      aurora(e) {
        const blobs = [0, 1, 2, 3].map((i) => ({ fx: 0.05 + e.rand() * 0.06, fy: 0.04 + e.rand() * 0.06, px: e.rand() * TAU, py: e.rand() * TAU, r: 420 + e.rand() * 240, c: [e.col.a, e.col.b, e.col.m, e.col.a][i], k: i }));
        let t = 0;
        return {
          res: 0.25,
          step(dt) { t += dt; },
          draw(c) {
            c.globalAlpha = 1;
            for (const b of blobs) {
              const x = W * (0.5 + 0.42 * Math.sin(t * b.fx * TAU + b.px)), y = H * (0.5 + 0.36 * Math.sin(t * b.fy * TAU + b.py));
              const r = b.r * (1 + 0.14 * Math.sin(t * 0.3 + b.k));
              const g = c.createRadialGradient(x, y, 0, x, y, r);
              const col = e.col.get(b.c);
              g.addColorStop(0, `rgba(${col},${e.al(0.5).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`);
              c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
            }
          },
        };
      },

      ripples(e) {
        const rings = []; let t = 0, next = 0.4;
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && rings.length < 3) { rings.push({ x: W * (0.1 + 0.8 * e.rand()), y: H * (0.1 + 0.8 * e.rand()), age: 0, life: 6.5 + e.rand() * 2.5, R: 300 + e.rand() * 260, c: e.rand() < 0.7 ? e.col.a : e.col.b }); next = t + 1.6 + e.rand() * 2.4; }
            for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
          },
          draw(c) {
            c.lineWidth = 2;
            for (const r of rings) {
              const u = r.age / r.life, ease = 1 - Math.pow(1 - u, 3), fade = Math.pow(1 - u, 1.6);
              c.strokeStyle = r.c;
              c.globalAlpha = e.al(0.5 * fade); c.beginPath(); c.arc(r.x, r.y, r.R * ease, 0, TAU); c.stroke();
              c.globalAlpha = e.al(0.28 * fade); c.beginPath(); c.arc(r.x, r.y, r.R * ease * 0.72, 0, TAU); c.stroke();
            }
          },
        };
      },

      grid(e) {
        const S = 96, cols = Math.ceil(W / S) + 1, rows = Math.ceil(H / S) + 1; let t = 0;
        return {
          res: 0.5,
          step(dt) { t += dt; },
          draw(c) {
            c.fillStyle = e.col.a;
            for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
              const x = i * S, y = j * S;
              const v = 0.5 + 0.5 * Math.sin(x * 0.0042 + y * 0.0026 - t * 0.7), w = 0.5 + 0.5 * Math.sin(x * 0.0019 - y * 0.0033 + t * 0.35);
              const k = v * 0.7 + w * 0.3;
              c.globalAlpha = e.al(0.1 + 0.42 * k * k);
              c.beginPath(); c.arc(x, y, 2 + 6 * k * k, 0, TAU); c.fill();
            }
          },
        };
      },

      orbits(e) {
        const rings = [150, 250, 370, 510, 690, 900].map((r, i) => ({ r, w: (i % 2 ? -1 : 1) * (0.05 + e.rand() * 0.07), a: e.rand() * TAU, dash: i % 3 === 1, beads: 1 + (i % 2) }));
        let t = 0;
        return {
          res: 0.5,
          step(dt) { t += dt; for (const r of rings) r.a += r.w * dt; },
          draw(c) {
            const cx = W * 0.8 + Math.sin(t * 0.05) * 60, cy = H * 0.5 + Math.cos(t * 0.04) * 50;
            c.lineWidth = 1.6;
            for (const r of rings) {
              c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.26);
              c.setLineDash(r.dash ? [4, 16] : []); c.lineDashOffset = r.a * r.r * 0.2;
              c.beginPath(); c.arc(cx, cy, r.r, 0, TAU); c.stroke();
              c.setLineDash([]);
              c.fillStyle = e.col.b; c.globalAlpha = e.al(0.65);
              for (let k = 0; k < r.beads; k++) { const a = r.a + (k * TAU) / r.beads; c.beginPath(); c.arc(cx + Math.cos(a) * r.r, cy + Math.sin(a) * r.r, k ? 3.5 : 5.5, 0, TAU); c.fill(); }
            }
          },
        };
      },

      waves(e) {
        const lines = Array.from({ length: 6 }, (_, i) => ({ y: H * (0.2 + i * 0.12), A: 28 + e.rand() * 40, k: 0.0014 + e.rand() * 0.0022, s: 0.25 + e.rand() * 0.4, p: e.rand() * TAU, A2: 10 + e.rand() * 18, k2: 0.004 + e.rand() * 0.003, s2: -(0.2 + e.rand() * 0.3), c: i % 2 }));
        let t = 0;
        return {
          res: 0.5,
          step(dt) { t += dt; },
          draw(c) {
            c.lineWidth = 2; c.lineJoin = "round";
            lines.forEach((l, i) => {
              c.strokeStyle = l.c ? e.col.b : e.col.a; c.globalAlpha = e.al(0.4 - i * 0.04);
              c.beginPath();
              for (let x = -20; x <= W + 20; x += 24) { const y = l.y + l.A * Math.sin(x * l.k + t * l.s + l.p) + l.A2 * Math.sin(x * l.k2 + t * l.s2); x === -20 ? c.moveTo(x, y) : c.lineTo(x, y); }
              c.stroke();
            });
          },
        };
      },

      circuit(e) {
        const G = 48, traces = []; let t = 0, next = 0;
        const make = () => {
          let x = ((e.rand() * (W / G)) | 0) * G, y = ((e.rand() * (H / G)) | 0) * G, dir = (e.rand() * 4) | 0;
          const pts = [[x, y]], dx = [1, 0, -1, 0], dy = [0, 1, 0, -1];
          const segs = 4 + ((e.rand() * 5) | 0);
          for (let s = 0; s < segs; s++) {
            const len = (2 + ((e.rand() * 6) | 0)) * G, nx = x + dx[dir] * len, ny = y + dy[dir] * len;
            if (nx < 0 || nx > W || ny < 0 || ny > H) { dir = (dir + (e.rand() < 0.5 ? 1 : 3)) % 4; continue; }
            x = nx; y = ny; pts.push([x, y]); dir = (dir + (e.rand() < 0.5 ? 1 : 3)) % 4;
          }
          if (pts.length < 3) return null;
          const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
          return { pts, cum, L: cum[cum.length - 1], age: 0, grow: 0, c: e.rand() < 0.75 ? e.col.a : e.col.b };
        };
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && traces.length < 7) { const tr = make(); if (tr) { tr.grow = tr.L / 230; traces.push(tr); } next = t + 0.5 + e.rand() * 1.1; }
            for (let i = traces.length - 1; i >= 0; i--) { traces[i].age += dt; if (traces[i].age > traces[i].grow + 1.6 + 2.2) traces.splice(i, 1); }
          },
          draw(c) {
            c.lineWidth = 2.4; c.lineJoin = "round"; c.lineCap = "round";
            for (const tr of traces) {
              const u = Math.min(1, tr.age / tr.grow), len = tr.L * (u * u * (3 - 2 * u)), fade = tr.age < tr.grow + 1.6 ? 1 : Math.max(0, 1 - (tr.age - tr.grow - 1.6) / 2.2);
              c.strokeStyle = tr.c; c.fillStyle = tr.c; c.globalAlpha = e.al(0.5 * fade);
              c.beginPath(); c.moveTo(tr.pts[0][0], tr.pts[0][1]);
              let hx = tr.pts[0][0], hy = tr.pts[0][1];
              for (let i = 1; i < tr.pts.length; i++) {
                if (tr.cum[i] <= len) { c.lineTo(tr.pts[i][0], tr.pts[i][1]); hx = tr.pts[i][0]; hy = tr.pts[i][1]; }
                else { const f = (len - tr.cum[i - 1]) / (tr.cum[i] - tr.cum[i - 1]); hx = tr.pts[i - 1][0] + (tr.pts[i][0] - tr.pts[i - 1][0]) * f; hy = tr.pts[i - 1][1] + (tr.pts[i][1] - tr.pts[i - 1][1]) * f; c.lineTo(hx, hy); break; }
              }
              c.stroke();
              c.beginPath(); c.arc(tr.pts[0][0], tr.pts[0][1], 5, 0, TAU); c.fill();
              c.beginPath(); c.arc(hx, hy, 6.5, 0, TAU); c.lineWidth = 2; c.stroke(); c.lineWidth = 2.4;
            }
          },
        };
      },

      contours(e) {
        const C = 32, cols = Math.ceil(W / C) + 1, rows = Math.ceil(H / C) + 1, f = new Float32Array(cols * rows);
        const levels = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4]; let t = 0;
        const SEG = [null, [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 2, 1], [0, 2], [0, 3], [0, 3], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], null];
        const field = () => { for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = i * C, y = j * C; f[j * cols + i] = Math.sin(x * 0.0048 + t * 0.11) + Math.sin(y * 0.0063 - t * 0.09) + Math.sin(x * 0.0036 + y * 0.0042 + t * 0.07) + 0.6 * Math.sin(x * 0.011 + y * 0.007 - t * 0.13); } };
        return {
          res: 0.5,
          step(dt) { t += dt; field(); },
          draw(c) {
            c.lineWidth = 1.6; c.lineJoin = "round";
            for (const lv of levels) {
              c.strokeStyle = lv === 0 ? e.col.b : e.col.a; c.globalAlpha = e.al(lv === 0 ? 0.42 : 0.26); c.beginPath();
              for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
                const a = f[j * cols + i], b = f[j * cols + i + 1], cc = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
                const k = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (cc > lv ? 2 : 0) | (d > lv ? 1 : 0), s = SEG[k];
                if (!s) continue;
                const x = i * C, y = j * C;
                for (let q = 0; q < s.length; q += 2) {
                  for (let z = 0; z < 2; z++) {
                    const ed = s[q + z]; let px, py;
                    if (ed === 0) { px = x + C * ((lv - a) / (b - a)); py = y; }
                    else if (ed === 1) { px = x + C; py = y + C * ((lv - b) / (cc - b)); }
                    else if (ed === 2) { px = x + C * ((lv - d) / (cc - d)); py = y + C; }
                    else { px = x; py = y + C * ((lv - a) / (d - a)); }
                    z ? c.lineTo(px, py) : c.moveTo(px, py);
                  }
                }
              }
              c.stroke();
            }
          },
        };
      },

      bokeh(e) {
        const n = 22, ds = [];
        for (let i = 0; i < n; i++) ds.push({ x: e.rand() * W, y: e.rand() * H, r: 34 + e.rand() * 90, vy: -(8 + e.rand() * 16), ph: e.rand() * TAU, c: e.rand() < 0.6 ? 0 : 1, a: 0.07 + e.rand() * 0.07 });
        let t = 0;
        return {
          res: 0.35,
          step(dt) { t += dt; for (const d of ds) { d.y += d.vy * dt; d.x += Math.sin(t * 0.2 + d.ph) * 10 * dt; if (d.y < -d.r * 1.3) { d.y = H + d.r * 1.3; d.x = e.rand() * W; } } },
          draw(c) {
            for (const d of ds) {
              const r = d.r * (1 + 0.07 * Math.sin(t * 0.5 + d.ph));
              c.fillStyle = c.strokeStyle = d.c ? e.col.b : e.col.a;
              c.globalAlpha = e.al(d.a * 2.4); c.beginPath(); c.arc(d.x, d.y, r, 0, TAU); c.fill();
              c.globalAlpha = e.al(d.a * 3.2); c.lineWidth = 2; c.stroke();
            }
          },
        };
      },
    };
    const NAMES = Object.keys(THEMES);

    // ---------- canvas ----------
    const canvas = document.createElement("canvas");
    canvas.className = "deck-bg";
    canvas.setAttribute("aria-hidden", "true");
    stage.prepend(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });

    // ---------- per-slide specs ----------
    function specOf(i) {
      let v = Deck.slides[i].background;
      if (v === undefined) v = Deck.config.background;
      if (!v || v === "none") return null;
      if (typeof v === "string") v = { theme: v };
      if (!THEMES[v.theme]) return null;
      return v;
    }
    const keyOf = (s) => (s ? JSON.stringify([s.theme, s.intensity || 1, s.speed || 1, s.seed || 0, s.colors || null]) : "");
    const hasAny = Deck.slides.some((_, i) => specOf(i));
    if (!hasAny) return;
    Deck.slides.forEach((_, i) => specOf(i) && Deck.slideEl(i).classList.add("has-bg"));

    // ---------- the running instance ----------
    let mode = "on", cur = null, inst = null, raf = 0, last = 0, fps = 30, ema = 0, slow = 0, fast = 0, frames = 0, fadeTimer = 0, visible = false;
    const env = { rand: Math.random, k: 1, col: { a: "", b: "", m: "", get: (s) => s.slice(4, -1) }, al: (a) => 0 };
    function palette(spec) {
      const dark = document.documentElement.dataset.theme === "dark";
      const fb = ["15,123,108", "59,111,182", "120,134,130"];
      const given = (spec.colors || []).map((c) => rgb(c, null)).filter(Boolean);
      const a = given[0] || rgb("var(--deck-accent)", fb[0]), b = given[1] || rgb("var(--deck-info, var(--deck-accent))", fb[1]), m = given[2] || rgb("var(--deck-text-2, #66736f)", fb[2]);
      env.col.a = `rgb(${a})`; env.col.b = `rgb(${b})`; env.col.m = `rgb(${m})`; env.col.get = (s) => s.slice(4, -1);
      env.dark = dark;
    }
    function build(spec, index) {
      palette(spec);
      env.rand = prng((spec.seed || 0) * 7919 + index * 104729 + 12345);
      const GAIN = { constellation: 1.9, flow: 1.2, aurora: 0.55, ripples: 1.7, grid: 1.1, orbits: 1.8, waves: 1.7, circuit: 1.2, contours: 1.9, bokeh: 0.6 };
      const strength = Math.max(0.05, +spec.intensity || 1) * (GAIN[spec.theme] || 1) * (env.dark ? 0.9 : 1);
      env.al = (a) => clamp(a * strength, 0, 1);
      inst = THEMES[spec.theme](env);
      inst.speed = +spec.speed || 1;
      const res = inst.res || 0.5;
      canvas.width = Math.round(W * res); canvas.height = Math.round(H * res);
      ctx.setTransform(res, 0, 0, res, 0, 0);
      ctx.clearRect(0, 0, W, H);
    }
    function render() {
      if (!inst.persistent) ctx.clearRect(0, 0, W, H);
      ctx.lineDashOffset = 0; ctx.setLineDash([]); ctx.lineCap = "butt";
      inst.draw(ctx);
    }
    function still() {
      // advance the simulation a few seconds so the frame is a settled, interesting moment, then draw once
      const steps = inst.persistent ? 140 : 90;
      for (let i = 0; i < steps; i++) { inst.step(0.1 * inst.speed); if (inst.persistent && i > steps - 60) render(); }
      if (!inst.persistent) render();
    }
    const reduced = () => Deck.settings.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveMode = () => (mode === "off" ? "off" : mode === "still" || reduced() ? "still" : "on");

    function paused() { return document.hidden || document.body.classList.contains("tool-active"); }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!inst || !visible || paused()) { last = now; return; }
      const interval = 1000 / fps;
      if (now - last < interval - 2) return;
      const dt = Math.min(0.1, (now - last) / 1000) * inst.speed, gap = now - last; last = now;
      const t0 = performance.now();
      inst.step(dt); render();
      const cost = performance.now() - t0;
      frames++; ema = ema ? ema * 0.9 + cost * 0.1 : cost;
      // governor: if drawing takes too much of the frame, or frames arrive late, lower the rate; recover when calm
      if (frames > 20 && (ema > interval * 0.45 || gap > interval * 1.9)) { if (++slow > 25) { slow = 0; fps = fps > 20 ? 20 : fps > 12 ? 12 : 0; if (!fps) { stopLoop(); fps = 12; } } fast = 0; }
      else { slow = Math.max(0, slow - 1); if (fps < 30 && ema < (1000 / (fps + 8)) * 0.15 && ++fast > fps * 12) { fps = fps < 20 ? 20 : 30; fast = 0; } }
    }
    function startLoop() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    function stopLoop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function fade(on, ms) {
      visible = on;
      canvas.style.transition = `opacity ${ms}ms ease`;
      canvas.style.opacity = on && mode !== "off" ? "1" : "0";
    }
    function show(index) {
      const spec = specOf(index);
      clearTimeout(fadeTimer);
      if (!spec || effectiveMode() === "off") { cur = null; fade(false, 400); fadeTimer = setTimeout(stopLoop, 450); return; }
      const k = keyOf(spec);
      if (cur && cur.key === k && inst) { fade(true, 500); if (effectiveMode() === "on") startLoop(); return; }
      const swap = () => {
        cur = { key: k, index };
        stopLoop(); build(spec, index); fps = 30; ema = 0; slow = fast = frames = 0;
        if (effectiveMode() === "still") { still(); fade(true, 900); }
        else { for (let i = 0; i < (inst.persistent ? 0 : 6); i++) inst.step(0.05); fade(true, 1100); startLoop(); }
      };
      // fade the old theme out first if one is showing; the new one starts once the slide has settled
      if (visible && cur) { fade(false, 260); fadeTimer = setTimeout(swap, 300); } else fadeTimer = setTimeout(swap, 120);
    }

    Deck.on("beforeleave", ({ index, to }) => { if (keyOf(specOf(index)) !== keyOf(specOf(to)) && visible) { clearTimeout(fadeTimer); fade(false, 260); } });
    Deck.on("slidechange", ({ index }) => show(index));
    Deck.on("theme", () => { if (cur && inst) { cur = null; inst = null; stopLoop(); show(Deck.state.index); } });
    Deck.on("resize", () => {});
    document.addEventListener("visibilitychange", () => { last = performance.now(); });

    // ---------- mode: Animated / Still / Off ----------
    function setMode(m) {
      mode = m;
      stage.dataset.bgmode = m === "off" ? "off" : "on";
      if (Deck.settings.backgroundMode !== m) Deck.setSetting("backgroundMode", m);
      cur = null; inst = null; stopLoop(); show(Deck.state.index);
    }
    mode = ["on", "still", "off"].includes(Deck.settings.backgroundMode) ? Deck.settings.backgroundMode : "on";
    stage.dataset.bgmode = mode === "off" ? "off" : "on";
    Deck.on("settings", ({ key, value }) => { if (key === "backgroundMode" && value !== mode) setMode(value); if (key === "reducedMotion" && cur) { const m = mode; cur = null; inst = null; stopLoop(); show(Deck.state.index); } });
    Deck.addKeys(["b"], () => setMode(mode === "on" ? "still" : mode === "still" ? "off" : "on"), "Background: animated, still, off", "View");

    Deck.background = {
      themes: NAMES,
      get mode() { return mode; },
      setMode,
      stats: () => ({ theme: cur && specOf(cur.index) && specOf(cur.index).theme, running: !!raf && visible, fps, avgCostMs: +ema.toFixed(2), frames, res: inst ? inst.res : 0, canvas: [canvas.width, canvas.height] }),
    };
  });
})();
