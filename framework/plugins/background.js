/* Animated backgrounds — a quiet, algorithmic animation behind the slide, drawn on one small canvas.
 *
 *   Deck.configure({ background: { theme: "aurora" } });          a default for every slide (or just "aurora")
 *   Deck.slide({ ..., background: "constellation" });             this slide's own theme
 *   Deck.slide({ ..., background: { theme: "flow", intensity: 1.4, speed: 0.7, seed: 3, colors: ["#0F7B6C", "#3B6FB6"] } });
 *   Deck.slide({ ..., background: "none" });                      a still, plain slide
 *
 *   Themes: constellation · flow · aurora · ripples · grid · orbits · waves · circuit · contours · bokeh
 *           network · hexgrid · metro · lattice · branches
 *           pcb · facets · radar · zodiac · lanes
 *   Title-slide themes (drawn only in the right quarter, x 1440…1920, fading toward the left so a left-aligned title stays clear):
 *           edge-network · edge-branches · edge-pcb · edge-hex · edge-stars
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
    const RX = 1440, RW = W - RX; // the right quarter, used by the "edge-…" title-slide themes
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
      network(e) {
        const n = 36, nodes = [], edges = [], adj = Array.from({ length: n }, () => []);
        for (let i = 0; i < n; i++) nodes.push({ x: 60 + e.rand() * (W - 120), y: 60 + e.rand() * (H - 120) });
        for (let i = 0; i < n; i++) {
          const d = nodes.map((p, j) => [j, (p.x - nodes[i].x) ** 2 + (p.y - nodes[i].y) ** 2]).filter((q) => q[0] !== i).sort((a, b) => a[1] - b[1]);
          for (let k = 0; k < 3; k++) { const j = d[k][0]; if (d[k][1] < 420 * 420 && !adj[i].includes(j)) { adj[i].push(j); adj[j].push(i); edges.push([i, j]); } }
        }
        const pk = []; let t = 0, next = 0;
        const launch = (from) => { const to = adj[from][(e.rand() * adj[from].length) | 0]; return { a: from, b: to, u: 0, v: 150 + e.rand() * 120, c: e.rand() < 0.7 ? 0 : 1 }; };
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && pk.length < 16) { const s = (e.rand() * n) | 0; if (adj[s].length) pk.push(launch(s)); next = t + 0.25 + e.rand() * 0.5; }
            for (let i = pk.length - 1; i >= 0; i--) {
              const p = pk[i], A = nodes[p.a], B = nodes[p.b], L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
              p.u += (p.v * dt) / L;
              if (p.u >= 1) { const prev = p.a; let to = p.b; const opts = adj[to].filter((q) => q !== prev); if (!opts.length || e.rand() < 0.08) { pk.splice(i, 1); continue; } p.a = to; p.b = opts[(e.rand() * opts.length) | 0]; p.u = 0; }
            }
          },
          draw(c) {
            c.lineWidth = 1.6; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.2); c.beginPath();
            for (const [i, j] of edges) { c.moveTo(nodes[i].x, nodes[i].y); c.lineTo(nodes[j].x, nodes[j].y); } c.stroke();
            c.fillStyle = e.col.a; c.globalAlpha = e.al(0.5); c.beginPath();
            for (const p of nodes) { c.moveTo(p.x + 5, p.y); c.arc(p.x, p.y, 5, 0, TAU); } c.fill();
            c.lineWidth = 2.6; c.lineCap = "round";
            for (const p of pk) {
              const A = nodes[p.a], B = nodes[p.b], x = A.x + (B.x - A.x) * p.u, y = A.y + (B.y - A.y) * p.u, u0 = Math.max(0, p.u - 0.18);
              c.strokeStyle = c.fillStyle = p.c ? e.col.b : e.col.a;
              c.globalAlpha = e.al(0.4); c.beginPath(); c.moveTo(A.x + (B.x - A.x) * u0, A.y + (B.y - A.y) * u0); c.lineTo(x, y); c.stroke();
              c.globalAlpha = e.al(0.85); c.beginPath(); c.arc(x, y, 5.5, 0, TAU); c.fill();
            }
          },
        };
      },

      hexgrid(e) {
        const R = 56, SQ = Math.sqrt(3), cols = Math.ceil(W / (1.5 * R)) + 2, rows = Math.ceil(H / (SQ * R)) + 2;
        const lit = new Float32Array(cols * rows), q = []; let t = 0, next = 0.3;
        const cx = (i) => i * 1.5 * R - R, cy = (i, j) => j * SQ * R + (i & 1) * SQ * R * 0.5 - SQ * R;
        const nb = (i, j) => (i & 1 ? [[i + 1, j], [i + 1, j + 1], [i - 1, j], [i - 1, j + 1], [i, j - 1], [i, j + 1]] : [[i + 1, j - 1], [i + 1, j], [i - 1, j - 1], [i - 1, j], [i, j - 1], [i, j + 1]]);
        const hex = (c, x, y) => { c.moveTo(x + R, y); for (let k = 1; k < 6; k++) c.lineTo(x + R * Math.cos((k * TAU) / 6), y + R * Math.sin((k * TAU) / 6)); c.closePath(); };
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next) { q.push({ i: (e.rand() * cols) | 0, j: (e.rand() * rows) | 0, at: t, g: 0 }); next = t + 0.9 + e.rand() * 1.4; }
            for (let k = q.length - 1; k >= 0; k--) {
              const o = q[k]; if (o.at > t) continue; q.splice(k, 1);
              if (o.i < 0 || o.j < 0 || o.i >= cols || o.j >= rows) continue;
              lit[o.j * cols + o.i] = 1;
              if (o.g < 5) for (const [a, b] of nb(o.i, o.j)) if (e.rand() < 0.4) q.push({ i: a, j: b, at: t + 0.35 + e.rand() * 0.3, g: o.g + 1 });
            }
            const f = Math.exp(-dt * 0.55); for (let k = 0; k < lit.length; k++) lit[k] *= f;
          },
          draw(c) {
            c.lineWidth = 1.5; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.12); c.beginPath();
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) hex(c, cx(i), cy(i, j));
            c.stroke();
            c.fillStyle = e.col.a;
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
              const v = lit[j * cols + i]; if (v < 0.03) continue;
              c.beginPath(); hex(c, cx(i), cy(i, j)); c.globalAlpha = e.al(0.28 * v); c.fill();
              c.strokeStyle = e.col.b; c.lineWidth = 2; c.globalAlpha = e.al(0.6 * v); c.stroke();
            }
          },
        };
      },

      metro(e) {
        const G = 54, DX = [1, 1, 0, -1, -1, -1, 0, 1], DY = [0, 1, 1, 1, 0, -1, -1, -1], lines = []; let t = 0, next = 0;
        const make = () => {
          let x = ((e.rand() * (W / G)) | 0) * G, y = ((e.rand() * (H / G)) | 0) * G, d = (e.rand() * 8) | 0;
          const pts = [[x, y]];
          for (let s = 0; s < 6; s++) {
            const len = (2 + ((e.rand() * 5) | 0)) * G * (d & 1 ? 0.75 : 1), nx = x + DX[d] * len, ny = y + DY[d] * len;
            if (nx < -G || nx > W + G || ny < -G || ny > H + G) { d = (d + (e.rand() < 0.5 ? 1 : 7)) % 8; continue; }
            x = nx; y = ny; pts.push([x, y]); d = (d + (e.rand() < 0.5 ? 1 : 7)) % 8;
          }
          if (pts.length < 4) return null;
          const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
          return { pts, cum, L: cum[cum.length - 1], age: 0, grow: cum[cum.length - 1] / 200, c: e.rand() < 0.7 ? e.col.a : e.col.b };
        };
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && lines.length < 6) { const l = make(); if (l) lines.push(l); next = t + 0.8 + e.rand() * 1.2; }
            for (let i = lines.length - 1; i >= 0; i--) { lines[i].age += dt; if (lines[i].age > lines[i].grow + 4.5) lines.splice(i, 1); }
          },
          draw(c) {
            c.lineJoin = "round"; c.lineCap = "round";
            for (const l of lines) {
              const u = Math.min(1, l.age / l.grow), len = l.L * u, fade = l.age < l.grow + 2.4 ? 1 : Math.max(0, 1 - (l.age - l.grow - 2.4) / 2.1);
              c.strokeStyle = l.c; c.globalAlpha = e.al(0.5 * fade); c.lineWidth = 5;
              c.beginPath(); c.moveTo(l.pts[0][0], l.pts[0][1]);
              let hx = l.pts[0][0], hy = l.pts[0][1];
              for (let i = 1; i < l.pts.length; i++) {
                if (l.cum[i] <= len) { c.lineTo(l.pts[i][0], l.pts[i][1]); hx = l.pts[i][0]; hy = l.pts[i][1]; }
                else { const f = (len - l.cum[i - 1]) / (l.cum[i] - l.cum[i - 1]); hx = l.pts[i - 1][0] + (l.pts[i][0] - l.pts[i - 1][0]) * f; hy = l.pts[i - 1][1] + (l.pts[i][1] - l.pts[i - 1][1]) * f; c.lineTo(hx, hy); break; }
              }
              c.stroke();
              c.lineWidth = 2.4; c.globalAlpha = e.al(0.8 * fade);
              for (let i = 0; i < l.pts.length; i++) if (l.cum[i] <= len) { c.beginPath(); c.arc(l.pts[i][0], l.pts[i][1], 8, 0, TAU); c.stroke(); }
            }
          },
        };
      },

      lattice(e) {
        const S = 100, cols = Math.ceil(W / S) + 2, rows = Math.ceil(H / S) + 2, P = new Float32Array(cols * rows * 2), ph = [];
        for (let k = 0; k < cols * rows; k++) ph.push(e.rand() * TAU);
        let t = 0;
        const place = () => { for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const k = j * cols + i; P[k * 2] = (i - 1) * S + 26 * Math.sin(t * 0.5 + ph[k] + j * 0.5); P[k * 2 + 1] = (j - 1) * S + 26 * Math.cos(t * 0.42 + ph[k] * 1.3 + i * 0.45); } };
        place();
        return {
          res: 0.5,
          step(dt) { t += dt; place(); },
          draw(c) {
            c.lineWidth = 1.5; c.lineJoin = "round"; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.28); c.beginPath();
            for (let j = 0; j < rows; j++) { c.moveTo(P[j * cols * 2], P[j * cols * 2 + 1]); for (let i = 1; i < cols; i++) c.lineTo(P[(j * cols + i) * 2], P[(j * cols + i) * 2 + 1]); }
            for (let i = 0; i < cols; i++) { c.moveTo(P[i * 2], P[i * 2 + 1]); for (let j = 1; j < rows; j++) c.lineTo(P[(j * cols + i) * 2], P[(j * cols + i) * 2 + 1]); }
            c.stroke();
            c.fillStyle = e.col.b; c.globalAlpha = e.al(0.6); c.beginPath();
            for (let k = 0; k < cols * rows; k++) { c.moveTo(P[k * 2] + 4, P[k * 2 + 1]); c.arc(P[k * 2], P[k * 2 + 1], 4, 0, TAU); }
            c.fill();
          },
        };
      },

      branches(e) {
        const trees = []; let t = 0, next = 0;
        const spawn = () => {
          const side = (e.rand() * 4) | 0, f = 0.1 + e.rand() * 0.8;
          const x = side === 0 ? f * W : side === 1 ? W : side === 2 ? f * W : 0, y = side === 0 ? 0 : side === 1 ? f * H : side === 2 ? H : f * H;
          const base = [Math.PI / 2, Math.PI, -Math.PI / 2, 0][side];
          return { age: 0, hold: 0, total: 1, c: e.rand() < 0.7 ? e.col.a : e.col.b, br: [{ pts: [x, y], x, y, a: base + (e.rand() - 0.5) * 0.8, d: 0, len: 0, max: 420 + e.rand() * 260, acc: 0, alive: true }] };
        };
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && trees.length < 4) { trees.push(spawn()); next = t + 1.5 + e.rand() * 2.5; }
            for (let k = trees.length - 1; k >= 0; k--) {
              const tr = trees[k]; let alive = false;
              for (const b of tr.br.slice()) {
                if (!b.alive) continue;
                const step = 135 * dt; b.a += (e.rand() - 0.5) * 2.2 * dt * 3; b.x += Math.cos(b.a) * step; b.y += Math.sin(b.a) * step; b.len += step; b.acc += step;
                if (b.acc > 16) {
                  b.acc = 0; b.pts.push(b.x, b.y);
                  if (b.d < 4 && tr.total < 90 && e.rand() < 0.17) { tr.total++; tr.br.push({ pts: [b.x, b.y], x: b.x, y: b.y, a: b.a + (e.rand() < 0.5 ? -1 : 1) * (0.4 + e.rand() * 0.5), d: b.d + 1, len: 0, max: b.max * 0.6, acc: 0, alive: true }); }
                }
                if (b.len > b.max || b.x < -30 || b.x > W + 30 || b.y < -30 || b.y > H + 30) b.alive = false; else alive = true;
              }
              tr.age += dt; if (!alive) tr.hold += dt;
              if (tr.hold > 3.2) trees.splice(k, 1);
            }
          },
          draw(c) {
            c.lineJoin = "round"; c.lineCap = "round";
            for (const tr of trees) {
              const fade = tr.hold < 1.2 ? 1 : Math.max(0, 1 - (tr.hold - 1.2) / 2);
              c.strokeStyle = c.fillStyle = tr.c;
              for (const b of tr.br) {
                c.globalAlpha = e.al(0.55 * fade); c.lineWidth = 3.2 - b.d * 0.5; c.beginPath(); c.moveTo(b.pts[0], b.pts[1]);
                for (let i = 2; i < b.pts.length; i += 2) c.lineTo(b.pts[i], b.pts[i + 1]);
                if (b.alive) c.lineTo(b.x, b.y);
                c.stroke();
                if (!b.alive && b.d > 1) { c.globalAlpha = e.al(0.7 * fade); c.beginPath(); c.arc(b.x, b.y, 4, 0, TAU); c.fill(); }
                if (b.alive) { c.globalAlpha = e.al(0.9); c.beginPath(); c.arc(b.x, b.y, 5, 0, TAU); c.fill(); }
              }
            }
          },
        };
      },
      pcb(e) {
        const G = 48, dX = [1, 0, -1, 0], dY = [0, 1, 0, -1], tr = [];
        for (let k = 0; k < 11; k++) {
          let x = ((e.rand() * (W / G)) | 0) * G, y = ((e.rand() * (H / G)) | 0) * G, d = (e.rand() * 4) | 0; const pts = [[x, y]];
          for (let s = 0; s < 6; s++) { const len = (2 + ((e.rand() * 6) | 0)) * G, nx = x + dX[d] * len, ny = y + dY[d] * len; if (nx < 0 || nx > W || ny < 0 || ny > H) { d = (d + (e.rand() < 0.5 ? 1 : 3)) % 4; continue; } x = nx; y = ny; pts.push([x, y]); d = (d + (e.rand() < 0.5 ? 1 : 3)) % 4; }
          if (pts.length < 3) { k--; continue; }
          const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
          tr.push({ pts, cum, L: cum[cum.length - 1] });
        }
        const at = (T, dd) => { dd = clamp(dd, 0, T.L); for (let i = 1; i < T.pts.length; i++) if (T.cum[i] >= dd) { const f = (dd - T.cum[i - 1]) / (T.cum[i] - T.cum[i - 1] || 1); return [T.pts[i - 1][0] + (T.pts[i][0] - T.pts[i - 1][0]) * f, T.pts[i - 1][1] + (T.pts[i][1] - T.pts[i - 1][1]) * f]; } return T.pts[T.pts.length - 1]; };
        const pulses = []; let t = 0, next = 0;
        return {
          res: 0.5,
          step(dt) {
            t += dt;
            if (t > next && pulses.length < 9) { pulses.push({ T: tr[(e.rand() * tr.length) | 0], d: 0, v: 190 + e.rand() * 140, c: e.rand() < 0.7 ? e.col.a : e.col.b }); next = t + 0.35 + e.rand() * 0.7; }
            for (let i = pulses.length - 1; i >= 0; i--) { pulses[i].d += pulses[i].v * dt; if (pulses[i].d > pulses[i].T.L + 140) pulses.splice(i, 1); }
          },
          draw(c) {
            c.lineJoin = "round"; c.lineCap = "round"; c.lineWidth = 2.4; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.2); c.beginPath();
            for (const T of tr) { c.moveTo(T.pts[0][0], T.pts[0][1]); for (let i = 1; i < T.pts.length; i++) c.lineTo(T.pts[i][0], T.pts[i][1]); } c.stroke();
            c.fillStyle = e.col.a; c.globalAlpha = e.al(0.4); c.beginPath();
            for (const T of tr) for (const q of [T.pts[0], T.pts[T.pts.length - 1]]) { c.moveTo(q[0] + 6, q[1]); c.arc(q[0], q[1], 6, 0, TAU); } c.fill();
            for (const p of pulses) {
              c.strokeStyle = c.fillStyle = p.c;
              for (let k = 4; k >= 1; k--) { const a = at(p.T, p.d - k * 28), b = at(p.T, p.d - (k - 1) * 28); c.globalAlpha = e.al(0.14 * (5 - k)); c.lineWidth = 3.4; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
              if (p.d <= p.T.L) { const h = at(p.T, p.d); c.globalAlpha = e.al(0.9); c.beginPath(); c.arc(h[0], h[1], 5.5, 0, TAU); c.fill(); }
            }
          },
        };
      },

      facets(e) {
        const C = 17, R = 10, SX = W / (C - 1), SY = H / (R - 1), P = new Float32Array(C * R * 2), B = [], tri = []; let t = 0;
        for (let k = 0; k < C * R; k++) B.push([e.rand() * TAU, e.rand() * TAU]);
        for (let j = 0; j < R - 1; j++) for (let i = 0; i < C - 1; i++) { const a = j * C + i, b = a + 1, d = a + C, f = d + 1; tri.push([a, b, d, e.rand() * TAU], [b, f, d, e.rand() * TAU]); }
        const place = () => { for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) { const k = j * C + i; P[k * 2] = i * SX + 22 * Math.sin(t * 0.35 + B[k][0]); P[k * 2 + 1] = j * SY + 22 * Math.cos(t * 0.3 + B[k][1]); } };
        place();
        return {
          res: 0.5,
          step(dt) { t += dt; place(); },
          draw(c) {
            for (let n = 0; n < tri.length; n++) {
              const T = tri[n], v = Math.sin(t * 0.45 + T[3]), q = v > 0.55 ? (v - 0.55) / 0.45 : 0; if (q < 0.02) continue;
              c.fillStyle = n & 1 ? e.col.b : e.col.a; c.globalAlpha = e.al(0.32 * q * q);
              c.beginPath(); c.moveTo(P[T[0] * 2], P[T[0] * 2 + 1]); c.lineTo(P[T[1] * 2], P[T[1] * 2 + 1]); c.lineTo(P[T[2] * 2], P[T[2] * 2 + 1]); c.closePath(); c.fill();
            }
            c.lineWidth = 1.5; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.24); c.beginPath();
            for (const T of tri) { c.moveTo(P[T[0] * 2], P[T[0] * 2 + 1]); c.lineTo(P[T[1] * 2], P[T[1] * 2 + 1]); c.lineTo(P[T[2] * 2], P[T[2] * 2 + 1]); c.closePath(); }
            c.stroke();
          },
        };
      },

      radar(e) {
        const cx = W * 0.8, cy = H * 0.7, blips = []; let a = e.rand() * TAU;
        for (let i = 0; i < 16; i++) { const r = 160 + e.rand() * 900, an = e.rand() * TAU; blips.push({ x: cx + Math.cos(an) * r, y: cy + Math.sin(an) * r, an, r: 4 + e.rand() * 3, c: e.rand() < 0.7 ? 0 : 1 }); }
        return {
          res: 0.5,
          step(dt) { a = (a + 0.55 * dt) % TAU; },
          draw(c) {
            c.lineWidth = 1.6; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.2);
            for (let r = 160; r < 1500; r += 200) { c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); }
            c.beginPath(); c.moveTo(cx - 1600, cy); c.lineTo(cx + 1600, cy); c.moveTo(cx, cy - 1200); c.lineTo(cx, cy + 1200); c.stroke();
            c.lineWidth = 6;
            for (let k = 0; k < 16; k++) { c.globalAlpha = e.al(0.3 * (1 - k / 16) * (1 - k / 16)); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a - k * 0.03) * 1800, cy + Math.sin(a - k * 0.03) * 1800); c.stroke(); }
            c.lineWidth = 2; c.globalAlpha = e.al(0.6); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 1800, cy + Math.sin(a) * 1800); c.stroke();
            for (const b of blips) {
              const since = (((a - b.an) % TAU) + TAU) % TAU, v = Math.exp(-since * 1.1);
              c.fillStyle = c.strokeStyle = b.c ? e.col.b : e.col.a;
              c.globalAlpha = e.al(0.1 + 0.8 * v); c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill();
              if (v > 0.15) { c.globalAlpha = e.al(0.5 * v); c.lineWidth = 2; c.beginPath(); c.arc(b.x, b.y, b.r + 12 * (1 - v) + 4, 0, TAU); c.stroke(); }
            }
          },
        };
      },

      zodiac(e) {
        const n = 56, st = []; for (let i = 0; i < n; i++) st.push({ x: 50 + e.rand() * (W - 100), y: 50 + e.rand() * (H - 100), r: 1.8 + e.rand() * 2.2, ph: e.rand() * TAU });
        const figs = []; let t = 0, next = 0;
        const make = () => {
          const used = new Set(), path = [(e.rand() * n) | 0]; used.add(path[0]);
          for (let k = 0; k < 7; k++) { const p = st[path[path.length - 1]]; let best = -1, bd = 1e9; for (let j = 0; j < n; j++) { if (used.has(j)) continue; const d = Math.hypot(st[j].x - p.x, st[j].y - p.y); if (d > 90 && d < 380 && d * (0.6 + e.rand() * 0.8) < bd) { bd = d; best = j; } } if (best < 0) break; path.push(best); used.add(best); }
          return path.length > 3 ? { path, age: 0, c: e.rand() < 0.7 ? e.col.a : e.col.b } : null;
        };
        return {
          res: 0.5,
          step(dt) { t += dt; if (t > next && figs.length < 3) { const f = make(); if (f) figs.push(f); next = t + 1.8 + e.rand() * 2; } for (let i = figs.length - 1; i >= 0; i--) { figs[i].age += dt; if (figs[i].age > figs[i].path.length * 0.8 + 5.5) figs.splice(i, 1); } },
          draw(c) {
            c.fillStyle = e.col.a;
            for (const s of st) { c.globalAlpha = e.al(0.3 + 0.2 * Math.sin(t * 0.8 + s.ph)); c.beginPath(); c.arc(s.x, s.y, s.r, 0, TAU); c.fill(); }
            c.lineWidth = 2; c.lineCap = "round";
            for (const f of figs) {
              const segs = f.path.length - 1, prog = f.age / 0.8, fade = f.age < segs * 0.8 + 3 ? 1 : Math.max(0, 1 - (f.age - segs * 0.8 - 3) / 2.5);
              c.strokeStyle = c.fillStyle = f.c; c.globalAlpha = e.al(0.55 * fade); c.beginPath();
              for (let i = 0; i < segs && i < prog; i++) { const A = st[f.path[i]], B = st[f.path[i + 1]], u = Math.min(1, prog - i); c.moveTo(A.x, A.y); c.lineTo(A.x + (B.x - A.x) * u, A.y + (B.y - A.y) * u); }
              c.stroke(); c.globalAlpha = e.al(0.8 * fade); c.beginPath();
              for (let i = 0; i <= segs && i <= prog; i++) { const A = st[f.path[i]]; c.moveTo(A.x + A.r * 2.2, A.y); c.arc(A.x, A.y, A.r * 2.2, 0, TAU); }
              c.fill();
            }
          },
        };
      },

      lanes(e) {
        const L = 15, ys = [], pk = [], links = [];
        for (let i = 0; i < L; i++) ys.push(70 + i * ((H - 140) / (L - 1)));
        for (let i = 0; i < L; i++) for (let k = 0; k < 1 + ((e.rand() * 2) | 0); k++) pk.push({ y: ys[i], x: e.rand() * W, len: 40 + e.rand() * 120, v: (e.rand() < 0.5 ? -1 : 1) * (50 + e.rand() * 170), c: e.rand() < 0.75 ? 0 : 1 });
        for (let k = 0; k < 14; k++) { const i = (e.rand() * (L - 1)) | 0; links.push({ x: e.rand() * W, a: ys[i], b: ys[i + 1 + ((e.rand() * 2) | 0) % (L - 1 - i)] }); }
        return {
          res: 0.5,
          step(dt) { for (const p of pk) { p.x += p.v * dt; if (p.v > 0 && p.x - p.len > W) p.x = -20; else if (p.v < 0 && p.x + p.len < 0) p.x = W + 20; } },
          draw(c) {
            c.lineWidth = 1.5; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.14); c.beginPath();
            for (const y of ys) { c.moveTo(0, y); c.lineTo(W, y); } for (const l of links) { c.moveTo(l.x, l.a); c.lineTo(l.x, l.b); } c.stroke();
            c.fillStyle = e.col.a; c.globalAlpha = e.al(0.45); c.beginPath(); for (const l of links) { c.moveTo(l.x + 5, l.a); c.arc(l.x, l.a, 5, 0, TAU); c.moveTo(l.x + 5, l.b); c.arc(l.x, l.b, 5, 0, TAU); } c.fill();
            c.lineWidth = 4; c.lineCap = "round";
            for (const p of pk) { c.strokeStyle = p.c ? e.col.b : e.col.a; c.globalAlpha = e.al(0.2); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - Math.sign(p.v) * p.len, p.y); c.stroke(); c.globalAlpha = e.al(0.75); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - Math.sign(p.v) * Math.min(26, p.len), p.y); c.stroke(); }
          },
        };
      },

      // ---- title-slide themes: live only in the right quarter of the slide (x 1440…1920), so a left-aligned title stays clear ----
      "edge-network"(e) {
        const n = 20, nodes = [], edges = [], adj = Array.from({ length: n }, () => []); let t = 0, next = 0;
        for (let i = 0; i < n; i++) nodes.push({ bx: RX + 50 + e.rand() * (RW - 90), by: 50 + e.rand() * (H - 100), ph: e.rand() * TAU, x: 0, y: 0 });
        const sway = () => { for (const p of nodes) { p.x = p.bx + 9 * Math.sin(t * 0.45 + p.ph); p.y = p.by + 9 * Math.cos(t * 0.38 + p.ph); } }; sway();
        for (let i = 0; i < n; i++) {
          const d = nodes.map((p, j) => [j, (p.bx - nodes[i].bx) ** 2 + (p.by - nodes[i].by) ** 2]).filter((q) => q[0] !== i).sort((a, b) => a[1] - b[1]);
          for (let k = 0; k < 2; k++) { const j = d[k][0]; if (d[k][1] < 300 * 300 && !adj[i].includes(j)) { adj[i].push(j); adj[j].push(i); edges.push([i, j]); } }
        }
        const pk = [];
        const launch = (from) => ({ a: from, b: adj[from][(e.rand() * adj[from].length) | 0], u: 0, v: 130 + e.rand() * 100, c: e.rand() < 0.7 ? 0 : 1 });
        return {
          res: 0.5, side: true,
          step(dt) {
            t += dt; sway();
            if (t > next && pk.length < 9) { const s0 = (e.rand() * n) | 0; if (adj[s0].length) pk.push(launch(s0)); next = t + 0.3 + e.rand() * 0.5; }
            for (let i = pk.length - 1; i >= 0; i--) {
              const p = pk[i], A = nodes[p.a], B = nodes[p.b], L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
              p.u += (p.v * dt) / L;
              if (p.u >= 1) { const prev = p.a, to = p.b, opts = adj[to].filter((q) => q !== prev); if (!opts.length || e.rand() < 0.1) { pk.splice(i, 1); continue; } p.a = to; p.b = opts[(e.rand() * opts.length) | 0]; p.u = 0; }
            }
          },
          draw(c) {
            c.lineWidth = 1.6; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.22); c.beginPath();
            for (const [i, j] of edges) { c.moveTo(nodes[i].x, nodes[i].y); c.lineTo(nodes[j].x, nodes[j].y); } c.stroke();
            c.fillStyle = e.col.a; c.globalAlpha = e.al(0.5); c.beginPath();
            for (const p of nodes) { c.moveTo(p.x + 5, p.y); c.arc(p.x, p.y, 5, 0, TAU); } c.fill();
            c.lineWidth = 2.6; c.lineCap = "round";
            for (const p of pk) {
              const A = nodes[p.a], B = nodes[p.b], x = A.x + (B.x - A.x) * p.u, y = A.y + (B.y - A.y) * p.u, u0 = Math.max(0, p.u - 0.2);
              c.strokeStyle = c.fillStyle = p.c ? e.col.b : e.col.a;
              c.globalAlpha = e.al(0.4); c.beginPath(); c.moveTo(A.x + (B.x - A.x) * u0, A.y + (B.y - A.y) * u0); c.lineTo(x, y); c.stroke();
              c.globalAlpha = e.al(0.85); c.beginPath(); c.arc(x, y, 5.5, 0, TAU); c.fill();
            }
          },
        };
      },

      "edge-branches"(e) {
        const trees = []; let t = 0, next = 0;
        const spawn = () => {
          const x = W + 10, y = 90 + e.rand() * (H - 180);
          return { hold: 0, total: 1, c: e.rand() < 0.7 ? e.col.a : e.col.b, br: [{ pts: [x, y], x, y, a: Math.PI + (e.rand() - 0.5) * 0.9, d: 0, len: 0, max: 280 + e.rand() * 180, acc: 0, alive: true }] };
        };
        return {
          res: 0.5, side: true,
          step(dt) {
            t += dt;
            if (t > next && trees.length < 3) { trees.push(spawn()); next = t + 1.4 + e.rand() * 2.2; }
            for (let k = trees.length - 1; k >= 0; k--) {
              const tr = trees[k]; let alive = false;
              for (const b of tr.br.slice()) {
                if (!b.alive) continue;
                const step = 110 * dt; b.a += (e.rand() - 0.5) * 6.6 * dt; b.x += Math.cos(b.a) * step; b.y += Math.sin(b.a) * step; b.len += step; b.acc += step;
                if (b.acc > 14) {
                  b.acc = 0; b.pts.push(b.x, b.y);
                  if (b.d < 3 && tr.total < 60 && e.rand() < 0.2) { tr.total++; tr.br.push({ pts: [b.x, b.y], x: b.x, y: b.y, a: b.a + (e.rand() < 0.5 ? -1 : 1) * (0.45 + e.rand() * 0.5), d: b.d + 1, len: 0, max: b.max * 0.6, acc: 0, alive: true }); }
                }
                if (b.len > b.max || b.x < RX + 10 || b.y < -30 || b.y > H + 30) b.alive = false; else alive = true;
              }
              if (!alive) tr.hold += dt;
              if (tr.hold > 3.2) trees.splice(k, 1);
            }
          },
          draw(c) {
            c.lineJoin = "round"; c.lineCap = "round";
            for (const tr of trees) {
              const fade = tr.hold < 1.2 ? 1 : Math.max(0, 1 - (tr.hold - 1.2) / 2);
              c.strokeStyle = c.fillStyle = tr.c;
              for (const b of tr.br) {
                c.globalAlpha = e.al(0.55 * fade); c.lineWidth = 3.2 - b.d * 0.6; c.beginPath(); c.moveTo(b.pts[0], b.pts[1]);
                for (let i = 2; i < b.pts.length; i += 2) c.lineTo(b.pts[i], b.pts[i + 1]);
                if (b.alive) c.lineTo(b.x, b.y);
                c.stroke();
                if (!b.alive && b.d > 0) { c.globalAlpha = e.al(0.7 * fade); c.beginPath(); c.arc(b.x, b.y, 4, 0, TAU); c.fill(); }
                if (b.alive) { c.globalAlpha = e.al(0.9); c.beginPath(); c.arc(b.x, b.y, 5, 0, TAU); c.fill(); }
              }
            }
          },
        };
      },

      "edge-pcb"(e) {
        const G = 40, dX = [1, 0, -1, 0], dY = [0, 1, 0, -1], tr = [];
        for (let k = 0; k < 9; k++) {
          let x = RX + (1 + ((e.rand() * (RW / G - 1)) | 0)) * G, y = ((e.rand() * (H / G)) | 0) * G, d = (e.rand() * 4) | 0; const pts = [[x, y]];
          for (let s = 0; s < 5; s++) { const len = (1 + ((e.rand() * 4) | 0)) * G, nx = x + dX[d] * len, ny = y + dY[d] * len; if (nx < RX || nx > W || ny < 0 || ny > H) { d = (d + (e.rand() < 0.5 ? 1 : 3)) % 4; continue; } x = nx; y = ny; pts.push([x, y]); d = (d + (e.rand() < 0.5 ? 1 : 3)) % 4; }
          if (pts.length < 3) { k--; continue; }
          const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
          tr.push({ pts, cum, L: cum[cum.length - 1] });
        }
        const at = (T, dd) => { dd = clamp(dd, 0, T.L); for (let i = 1; i < T.pts.length; i++) if (T.cum[i] >= dd) { const f = (dd - T.cum[i - 1]) / (T.cum[i] - T.cum[i - 1] || 1); return [T.pts[i - 1][0] + (T.pts[i][0] - T.pts[i - 1][0]) * f, T.pts[i - 1][1] + (T.pts[i][1] - T.pts[i - 1][1]) * f]; } return T.pts[T.pts.length - 1]; };
        const pulses = []; let t = 0, next = 0;
        return {
          res: 0.5, side: true,
          step(dt) {
            t += dt;
            if (t > next && pulses.length < 6) { pulses.push({ T: tr[(e.rand() * tr.length) | 0], d: 0, v: 150 + e.rand() * 110, c: e.rand() < 0.7 ? e.col.a : e.col.b }); next = t + 0.4 + e.rand() * 0.8; }
            for (let i = pulses.length - 1; i >= 0; i--) { pulses[i].d += pulses[i].v * dt; if (pulses[i].d > pulses[i].T.L + 120) pulses.splice(i, 1); }
          },
          draw(c) {
            c.lineJoin = "round"; c.lineCap = "round"; c.lineWidth = 2.4; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.24); c.beginPath();
            for (const T of tr) { c.moveTo(T.pts[0][0], T.pts[0][1]); for (let i = 1; i < T.pts.length; i++) c.lineTo(T.pts[i][0], T.pts[i][1]); } c.stroke();
            c.lineWidth = 2; c.globalAlpha = e.al(0.45); c.fillStyle = e.col.a;
            for (const T of tr) for (const q of [T.pts[0], T.pts[T.pts.length - 1]]) { c.beginPath(); c.arc(q[0], q[1], 6, 0, TAU); c.stroke(); c.beginPath(); c.arc(q[0], q[1], 2.4, 0, TAU); c.fill(); }
            for (const p of pulses) {
              c.strokeStyle = c.fillStyle = p.c;
              for (let k = 4; k >= 1; k--) { const a = at(p.T, p.d - k * 24), b = at(p.T, p.d - (k - 1) * 24); c.globalAlpha = e.al(0.14 * (5 - k)); c.lineWidth = 3.4; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
              if (p.d <= p.T.L) { const h = at(p.T, p.d); c.globalAlpha = e.al(0.9); c.beginPath(); c.arc(h[0], h[1], 5.5, 0, TAU); c.fill(); }
            }
          },
        };
      },

      "edge-hex"(e) {
        const R = 46, SQ = Math.sqrt(3), cols = Math.ceil(RW / (1.5 * R)) + 3, rows = Math.ceil(H / (SQ * R)) + 2;
        const lit = new Float32Array(cols * rows), q = []; let t = 0, next = 0.3;
        const cx = (i) => RX + i * 1.5 * R - R, cy = (i, j) => j * SQ * R + (i & 1) * SQ * R * 0.5 - SQ * R;
        const nb = (i, j) => (i & 1 ? [[i + 1, j], [i + 1, j + 1], [i - 1, j], [i - 1, j + 1], [i, j - 1], [i, j + 1]] : [[i + 1, j - 1], [i + 1, j], [i - 1, j - 1], [i - 1, j], [i, j - 1], [i, j + 1]]);
        const hex = (c, x, y) => { c.moveTo(x + R, y); for (let k = 1; k < 6; k++) c.lineTo(x + R * Math.cos((k * TAU) / 6), y + R * Math.sin((k * TAU) / 6)); c.closePath(); };
        return {
          res: 0.5, side: true,
          step(dt) {
            t += dt;
            if (t > next) { q.push({ i: Math.min(cols - 1, (Math.sqrt(e.rand()) * cols) | 0), j: (e.rand() * rows) | 0, at: t, g: 0 }); next = t + 0.7 + e.rand() * 1.1; }
            for (let k = q.length - 1; k >= 0; k--) {
              const o = q[k]; if (o.at > t) continue; q.splice(k, 1);
              if (o.i < 0 || o.j < 0 || o.i >= cols || o.j >= rows) continue;
              lit[o.j * cols + o.i] = 1;
              if (o.g < 5) for (const [a, b] of nb(o.i, o.j)) if (e.rand() < 0.42) q.push({ i: a, j: b, at: t + 0.3 + e.rand() * 0.3, g: o.g + 1 });
            }
            const f = Math.exp(-dt * 0.6); for (let k = 0; k < lit.length; k++) lit[k] *= f;
          },
          draw(c) {
            c.lineWidth = 1.5; c.strokeStyle = e.col.a; c.globalAlpha = e.al(0.14); c.beginPath();
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) hex(c, cx(i), cy(i, j));
            c.stroke();
            c.fillStyle = e.col.a;
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
              const v = lit[j * cols + i]; if (v < 0.03) continue;
              c.beginPath(); hex(c, cx(i), cy(i, j)); c.globalAlpha = e.al(0.3 * v); c.fill();
              c.strokeStyle = e.col.b; c.lineWidth = 2; c.globalAlpha = e.al(0.6 * v); c.stroke();
            }
          },
        };
      },

      "edge-stars"(e) {
        const n = 26, nodes = [];
        for (let i = 0; i < n; i++) nodes.push({ x: RX + 30 + e.rand() * (RW - 60), y: e.rand() * H, vx: (e.rand() - 0.5) * 10, vy: (e.rand() - 0.5) * 34, r: 2 + e.rand() * 2.4, c: e.rand() < 0.7 ? 0 : 1, ph: e.rand() * TAU });
        const D = 200, buckets = 4; let t = 0;
        return {
          res: 0.5, side: true,
          step(dt) {
            t += dt;
            for (const p of nodes) {
              p.x += p.vx * dt; p.y += p.vy * dt;
              if (p.x < RX + 20 || p.x > W - 20) p.vx = -p.vx;
              if (p.y < -30) p.y = H + 30; else if (p.y > H + 30) p.y = -30;
            }
          },
          draw(c) {
            const lines = Array.from({ length: buckets }, () => []);
            for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
              const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
              if (d2 < D * D) lines[Math.min(buckets - 1, ((1 - Math.sqrt(d2) / D) * buckets) | 0)].push(a, b);
            }
            c.lineWidth = 1.6; c.strokeStyle = e.col.a;
            for (let k = 0; k < buckets; k++) {
              const l = lines[k]; if (!l.length) continue;
              c.globalAlpha = e.al(0.1 + (k / buckets) * 0.34);
              c.beginPath(); for (let i = 0; i < l.length; i += 2) { c.moveTo(l[i].x, l[i].y); c.lineTo(l[i + 1].x, l[i + 1].y); } c.stroke();
            }
            for (let g = 0; g < 2; g++) {
              c.fillStyle = g ? e.col.b : e.col.a;
              for (const p of nodes) if (p.c === g) { c.globalAlpha = e.al(0.5 + 0.25 * Math.sin(t * 0.9 + p.ph)); c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); }
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
      if (!THEMES[v.theme]) { console.warn("[background] unknown theme:", v.theme); return null; }
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
      const GAIN = { constellation: 1.9, flow: 1.2, aurora: 0.55, ripples: 1.7, grid: 1.1, orbits: 1.8, waves: 1.7, circuit: 1.2, contours: 1.9, bokeh: 0.6, network: 1.5, hexgrid: 0.9, metro: 1.1, lattice: 0.95, branches: 1.5, pcb: 1.3, facets: 0.65, radar: 1.5, zodiac: 1.5, lanes: 1.9, "edge-network": 1.7, "edge-branches": 1.6, "edge-pcb": 1.5, "edge-hex": 0.8, "edge-stars": 1.8 };
      const strength = Math.max(0.05, +spec.intensity || 1) * (GAIN[spec.theme] || 1) * (env.dark ? 0.9 : 1);
      env.al = (a) => clamp(a * strength, 0, 1);
      inst = THEMES[spec.theme](env);
      inst.speed = +spec.speed || 1;
      const res = inst.res || 0.5, x0 = inst.side ? RX : 0, cw = inst.side ? RW : W;
      canvas.dataset.region = inst.side ? "edge" : "full"; // "edge" themes get a small canvas over the right quarter only
      canvas.width = Math.round(cw * res); canvas.height = Math.round(H * res);
      ctx.setTransform(res, 0, 0, res, -x0 * res, 0);
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
