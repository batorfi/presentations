(() => {
const apply = (ctx, step, snap) => {
  const r = ctx.$(".p4-root"); if (!r) return;
  if (snap) r.classList.add("p4-snap");
  r.dataset.s = step;
  const cam = r.querySelector(".p4-cam"), cams = r.dataset.cams && JSON.parse(r.dataset.cams);
  if (cam && cams) cam.style.transform = cams[step];
  const vp = r.querySelector(".p4-vp"), vps = r.dataset.vps && JSON.parse(r.dataset.vps);
  if (vp && vps) vp.style.transform = vps[step];
  if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p4-snap")); }
};
Deck.slide({
  id: "overview", section: "opening", title: "Eleven patterns", className: "p4-s",
  html: `<div class="p4-ov"><div class="p4-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="40"><span>01</span><h3>Zoom · map</h3><p>Fly into a map, level by level</p></div><div class="p4-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="80"><span>02</span><h3>Zoom · timeline</h3><p>From programme down to one day</p></div><div class="p4-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="120"><span>03</span><h3>Level of detail</h3><p>Same picture, one more layer</p></div><div class="p4-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="160"><span>04</span><h3>Drill-down</h3><p>A total, its parts, the rows</p></div><div class="p4-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="200"><span>05</span><h3>Expanding node</h3><p>Open one part inside the whole</p></div><div class="p4-ov-card" style="--c:var(--deck-info)" data-anim="up" data-delay="240"><span>06</span><h3>Build-up</h3><p>Start from one dot, grow the system</p></div><div class="p4-ov-card" style="--c:var(--deck-info)" data-anim="up" data-delay="280"><span>07</span><h3>Chart build</h3><p>Draw the argument in stages</p></div><div class="p4-ov-card" style="--c:var(--deck-ok)" data-anim="up" data-delay="320"><span>08</span><h3>Split morph</h3><p>One block becomes services</p></div><div class="p4-ov-card" style="--c:var(--deck-ok)" data-anim="up" data-delay="360"><span>09</span><h3>Regroup morph</h3><p>Same items, new arrangement</p></div><div class="p4-ov-card" style="--c:var(--deck-delegated)" data-anim="up" data-delay="400"><span>10</span><h3>Scale ladder</h3><p>Feel the size of things</p></div><div class="p4-ov-card" style="--c:var(--deck-delegated)" data-anim="up" data-delay="440"><span>11</span><h3>Layer peel</h3><p>Take a stack apart</p></div></div>
<div class="p4-fam" data-anim="fade" data-delay="600"><span><b style="background:var(--deck-accent)"></b>Semantic zoom 1–5</span><span><b style="background:var(--deck-info)"></b>Build-up 6–7</span><span><b style="background:var(--deck-ok)"></b>Morph 8–9</span><span><b style="background:var(--deck-delegated)"></b>Depth 10–11</span></div>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Overview: semantic zoom (1 to 5), build-up (6, 7), morph (8, 9) and depth (10, 11).",
});
})();
