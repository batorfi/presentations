(() => {
const apply = (ctx, step, snap) => {
  const r = ctx.$(".p5-root"); if (!r) return;
  if (snap) r.classList.add("p5-snap");
  r.dataset.s = step; r.style.setProperty("--s", step);
  r.querySelectorAll("[data-i]").forEach((e) => { const d = +e.dataset.i - step; e.dataset.d = d; e.style.setProperty("--d", d); });
  r.querySelectorAll("[data-at]").forEach((e) => { e.dataset.on = step >= +e.dataset.at ? "1" : "0"; });
  const cam = r.querySelector(".p5-cam"), cams = r.dataset.cams && JSON.parse(r.dataset.cams);
  if (cam && cams) cam.style.transform = cams[step];
  if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p5-snap")); }
};

const cssRGB = (el, v) => { el.style.color = `var(${v})`; const m = getComputedStyle(el).color.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [100, 100, 100]; };
const reduced = () => document.documentElement.hasAttribute("data-reduced-motion") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const hf = (x, y) => 0.95 * Math.exp(-((x - .35) ** 2 + (y + .25) ** 2) / .11) + 0.62 * Math.exp(-((x + .5) ** 2 + (y - .35) ** 2) / .16) + 0.3 * Math.exp(-((x + .1) ** 2 + (y + .7) ** 2) / .07) + 0.08 * Math.sin(3 * x) * Math.cos(2 * y);
const startSurf = (ctx) => {
  const cv = ctx.$(".p5-surf"); if (!cv) return;
  const g = cv.getContext("2d"), W = 1680, H = 620, N = 34;
  const lo = cssRGB(cv, "--deck-info"), mid = cssRGB(cv, "--deck-ok"), hi = cssRGB(cv, "--deck-danger"), ink = cssRGB(cv, "--deck-text"), line = cssRGB(cv, "--deck-border-strong"), bg = cssRGB(cv, "--deck-raised");
  const Z = []; let peak = { z: -1, i: 0, j: 0 };
  for (let j = 0; j <= N; j++) { Z[j] = []; for (let i = 0; i <= N; i++) { const z = hf(i / N * 2 - 1, j / N * 2 - 1); Z[j][i] = z; if (z > peak.z) peak = { z, i, j }; } }
  const S = { h: 0, pitch: .95, heat: 0, mark: 0 }, T = () => { const s = +ctx.$(".p5-root").dataset.s || 0; return { h: s >= 1 ? 1 : 0, pitch: s >= 3 ? 1.5 : .95, heat: s >= 3 ? 1 : 0, mark: s === 2 ? 1 : 0 }; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const ramp = (t) => t < .5 ? mix(lo, mid, t * 2) : mix(mid, hi, (t - .5) * 2);
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  let last = performance.now(), alive = true, t0 = last;
  const draw = (t) => {
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    const tg = T(), k = reduced() ? 1 : 1 - Math.exp(-dt * 3.2);
    for (const key in S) S[key] += (tg[key] - S[key]) * k;
    const yaw = -.62 * (1 - S.heat) + (reduced() ? 0 : Math.sin((t - t0) / 5200) * .12), cy = Math.cos(yaw), sy = Math.sin(yaw), ph = S.pitch, sp = Math.sin(ph), cp = Math.cos(ph);
    const R = 460, ZH = 300, P = (i, j, z) => { const x = (i / N * 2 - 1) * R, y = (j / N * 2 - 1) * R, x1 = x * cy - y * sy, y1 = x * sy + y * cy, zz = z * ZH * S.h; return [W / 2 + x1 * (.78 - .18 * S.heat), H / 2 + 40 * (1 - S.heat) + (y1 * sp - zz * cp) * (.78 - .18 * S.heat), y1 * cp + zz * sp]; };
    g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, W, H);
    const cells = [];
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = P(i, j, Z[j][i]), b = P(i + 1, j, Z[j][i + 1]), c = P(i + 1, j + 1, Z[j + 1][i + 1]), d = P(i, j + 1, Z[j + 1][i]);
      const zm = (Z[j][i] + Z[j][i + 1] + Z[j + 1][i + 1] + Z[j + 1][i]) / 4;
      cells.push({ pts: [a, b, c, d], key: (a[2] + c[2]) / 2, zm });
    }
    cells.sort((p, q) => p.key - q.key);
    cells.forEach(({ pts, zm }) => {
      g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let n = 1; n < 4; n++) g.lineTo(pts[n][0], pts[n][1]); g.closePath();
      const col = ramp(Math.min(1, zm / .95));
      g.fillStyle = rgb(mix(bg, col, Math.max(.28 * S.h, S.heat)), .5 + .5 * Math.max(S.h > .05 ? .8 : 0, S.heat)); g.fill();
      g.strokeStyle = rgb(S.heat > .5 ? mix(line, col, .5) : line, S.heat > .5 ? .35 : .85); g.lineWidth = 1; g.stroke();
    });
    if (S.mark > .02) {
      const q = P(peak.i, peak.j, peak.z);
      g.globalAlpha = S.mark; g.fillStyle = rgb(hi); g.beginPath(); g.arc(q[0], q[1] - 6, 11, 0, 7); g.fill();
      g.strokeStyle = rgb(ink); g.lineWidth = 2.5; g.beginPath(); g.moveTo(q[0], q[1] - 18); g.lineTo(q[0] + 70, q[1] - 60); g.lineTo(q[0] + 200, q[1] - 60); g.stroke();
      g.fillStyle = rgb(ink); g.font = `600 30px ${getComputedStyle(cv).fontFamily}`; g.textAlign = "left"; g.fillText("Peak", q[0] + 80, q[1] - 72); g.globalAlpha = 1;
    }
    if (alive) ctx.raf = requestAnimationFrame(draw);
  };
  ctx.raf = requestAnimationFrame(draw);
  ctx.cleanup(() => { alive = false; cancelAnimationFrame(ctx.raf); });
};

Deck.slide({
  id: "surface", section: "data", title: "Surface · height as the third dimension", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-surf-root" data-s="0"><div class="p5-view p5-netview"><canvas class="p5-surf" width="3360" height="1240"></canvas></div><div class="p5-capbar"><span class="p5-cp" data-for="0">Two inputs make a flat grid.</span><span class="p5-cp" data-for="1">The measured value becomes height.</span><span class="p5-cp" data-for="2">Mark the peak and say what it means.</span><span class="p5-cp" data-for="3">From above it is a heat map: same data, different view.</span></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a value that depends on two inputs: load by hour and day, cost by size and speed. Raise the surface, mark the peak, then tilt to the top view.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true);
    startSurf(ctx); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "A sample height field drawn on a canvas: flat grid, surface, peak marker, then top-down heat map.",
});
})();
