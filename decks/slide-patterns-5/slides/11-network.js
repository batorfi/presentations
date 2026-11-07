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
const buildNet = () => {
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const centers = [[-330, -60, 40], [280, 100, -80], [20, -110, 330]];
  const nodes = [];
  centers.forEach((c, k) => { for (let i = 0; i < 9; i++) nodes.push({ k, p: [c[0] + (rnd() - .5) * 330, c[1] + (rnd() - .5) * 260, c[2] + (rnd() - .5) * 300] }); });
  const edges = [];
  const dist = (a, b) => Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1], a.p[2] - b.p[2]);
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [j, dist(a, b)]).filter(([j]) => j !== i && nodes[j].k === a.k).sort((x, y) => x[1] - y[1]).slice(0, 2)
      .forEach(([j]) => { if (!edges.some(([x, y]) => (x === i && y === j) || (x === j && y === i))) edges.push([i, j]); });
  });
  [[2, 11], [14, 21], [5, 24], [17, 26]].forEach((e) => edges.push(e));
  return { nodes, edges, centers };
};
const startNet = (ctx) => {
  const cv = ctx.$(".p5-net"); if (!cv) return;
  const g = cv.getContext("2d"), W = 1680, H = 620, net = buildNet();
  const col = [cssRGB(cv, "--deck-accent"), cssRGB(cv, "--deck-info"), cssRGB(cv, "--deck-ok")], ink = cssRGB(cv, "--deck-text");
  const names = ["Cluster A", "Cluster B", "Cluster C"];
  const focus = () => { const r = ctx.$(".p5-root"); return (+r.dataset.s || 0) - 1; };
  let yaw = 0.4, last = performance.now(), alive = true, fa = [1, 1, 1];
  const proj = (p, yw) => {
    const c = Math.cos(yw), s = Math.sin(yw), pc = Math.cos(.32), ps = Math.sin(.32);
    const x1 = p[0] * c - p[2] * s, z1 = p[0] * s + p[2] * c, y2 = p[1] * pc - z1 * ps, z2 = p[1] * ps + z1 * pc;
    const sc = 1100 / (1100 + z2 + 250); return [W / 2 + x1 * sc * 1.25, H / 2 + y2 * sc * 1.25, sc, z2];
  };
  const draw = (t) => {
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    if (!reduced()) yaw += dt * 0.16;
    const f = focus();
    for (let k = 0; k < 3; k++) fa[k] += (((f < 0 || f === k) ? 1 : .12) - fa[k]) * (1 - Math.exp(-dt * 5));
    g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, W, H);
    const P = net.nodes.map((n) => proj(n.p, yaw));
    net.edges.forEach(([a, b]) => {
      const al = Math.min(fa[net.nodes[a].k], fa[net.nodes[b].k]);
      const cc = net.nodes[a].k === net.nodes[b].k ? col[net.nodes[a].k] : ink;
      g.strokeStyle = `rgba(${cc[0]},${cc[1]},${cc[2]},${.55 * al * (0.5 + (P[a][2] + P[b][2]) / 2)})`; g.lineWidth = 2;
      g.beginPath(); g.moveTo(P[a][0], P[a][1]); g.lineTo(P[b][0], P[b][1]); g.stroke();
    });
    net.nodes.map((n, i) => i).sort((a, b) => P[b][3] - P[a][3]).forEach((i) => {
      const n = net.nodes[i], c = col[n.k], r = 15 * P[i][2] * 1.2;
      g.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${fa[n.k] * Math.min(1, .45 + P[i][2] * .6)})`;
      g.beginPath(); g.arc(P[i][0], P[i][1], r, 0, 7); g.fill();
    });
    g.font = `600 28px ${getComputedStyle(cv).fontFamily}`; g.textAlign = "center";
    net.centers.forEach((c, k) => { const q = proj(c, yaw); g.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${fa[k]})`; g.fillText(names[k], q[0], q[1] - 130 * q[2]); });
    if (alive) ctx.raf = requestAnimationFrame(draw);
  };
  ctx.raf = requestAnimationFrame(draw);
  ctx.cleanup(() => { alive = false; cancelAnimationFrame(ctx.raf); });
};

Deck.slide({
  id: "network", section: "data", title: "Orbit network · a 3D graph that turns slowly", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-net-root" data-s="0"><div class="p5-view p5-netview"><canvas class="p5-net" width="3360" height="1240"></canvas></div><div class="p5-capbar"><span class="p5-cp" data-for="0">All three clusters, turning slowly.</span><span class="p5-cp" data-for="1">Cluster A on its own.</span><span class="p5-cp" data-for="2">Cluster B on its own.</span><span class="p5-cp" data-for="3">Cluster C on its own.</span></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a network where groups matter. The slow turn gives depth, and each step lights one cluster so the others fade back.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true);
    startNet(ctx); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "A 27-node graph in three clusters drawn on a canvas, rotating slowly; each step highlights one cluster. Sample structure only.",
});
})();
