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

Deck.slide({
  id: "overview", section: "opening", title: "Ten patterns", className: "p5-s",
  html: `<div class="p5-ov"><div class="p5-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="40"><span>01</span><h3>Cube</h3><p>Six faces, one turn at a time</p></div><div class="p5-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="80"><span>02</span><h3>Carousel ring</h3><p>Cards on a rotating cylinder</p></div><div class="p5-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="120"><span>03</span><h3>Coverflow</h3><p>A focused card between neighbours</p></div><div class="p5-ov-card" style="--c:var(--deck-accent)" data-anim="up" data-delay="160"><span>04</span><h3>Flip cards</h3><p>Front and back of the same idea</p></div><div class="p5-ov-card" style="--c:var(--deck-info)" data-anim="up" data-delay="200"><span>05</span><h3>Fly-through</h3><p>Move the camera through frames in depth</p></div><div class="p5-ov-card" style="--c:var(--deck-info)" data-anim="up" data-delay="240"><span>06</span><h3>Orbit layers</h3><p>Walk around a stack of planes</p></div><div class="p5-ov-card" style="--c:var(--deck-ok)" data-anim="up" data-delay="280"><span>07</span><h3>Isometric bars</h3><p>A skyline of values</p></div><div class="p5-ov-card" style="--c:var(--deck-ok)" data-anim="up" data-delay="320"><span>08</span><h3>Isometric scene</h3><p>A system as a small world</p></div><div class="p5-ov-card" style="--c:var(--deck-delegated)" data-anim="up" data-delay="360"><span>09</span><h3>Orbit network</h3><p>A 3D graph that turns slowly</p></div><div class="p5-ov-card" style="--c:var(--deck-delegated)" data-anim="up" data-delay="400"><span>10</span><h3>Surface</h3><p>Height as the third dimension</p></div></div>
<div class="p5-fam" data-anim="fade" data-delay="600"><span><b style="background:var(--deck-accent)"></b>Rotating objects 1–4</span><span><b style="background:var(--deck-info)"></b>Camera travel 5–6</span><span><b style="background:var(--deck-ok)"></b>Isometric 7–8</span><span><b style="background:var(--deck-delegated)"></b>3D data 9–10</span></div>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Overview: rotating objects (1 to 4), camera travel (5, 6), isometric (7, 8) and 3D data (9, 10).",
});
})();
