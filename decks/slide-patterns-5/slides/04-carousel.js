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
  id: "carousel", section: "rotate", title: "Carousel ring · cards on a rotating cylinder", className: "p5-s",
  steps: 5,
  html: `<div class="p5-stage"><div class="p5-root p5-car-root" data-s="0"><div class="p5-view p5-car-view"><div class="p5-car"><div class="p5-cc" data-i="0" style="--i:0"><b>1</b><h3>Option one</h3><p>A short line that explains it.</p></div><div class="p5-cc" data-i="1" style="--i:1"><b>2</b><h3>Option two</h3><p>A short line that explains it.</p></div><div class="p5-cc" data-i="2" style="--i:2"><b>3</b><h3>Option three</h3><p>A short line that explains it.</p></div><div class="p5-cc" data-i="3" style="--i:3"><b>4</b><h3>Option four</h3><p>A short line that explains it.</p></div><div class="p5-cc" data-i="4" style="--i:4"><b>5</b><h3>Option five</h3><p>A short line that explains it.</p></div><div class="p5-cc" data-i="5" style="--i:5"><b>6</b><h3>Option six</h3><p>A short line that explains it.</p></div></div></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a short set of alternatives or stages. The ring turns to the next card on every step; the cards behind stay out of the way.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Six cards arranged on a cylinder; each step rotates to the next card.",
});
})();
