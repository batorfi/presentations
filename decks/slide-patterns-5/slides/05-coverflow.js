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
  id: "coverflow", section: "rotate", title: "Coverflow · a focused card between its neighbours", className: "p5-s",
  steps: 4,
  html: `<div class="p5-stage"><div class="p5-root p5-cf-root" data-s="0"><div class="p5-view p5-cf-view"><div class="p5-cf" data-i="0" style="--i:0"><small>Sample · 1 of 5</small><h3>Case one</h3><p>Context, the change and the result in two lines.</p><div class="p5-cf-bar"><u></u><u></u><u></u></div></div><div class="p5-cf" data-i="1" style="--i:1"><small>Sample · 2 of 5</small><h3>Case two</h3><p>Context, the change and the result in two lines.</p><div class="p5-cf-bar"><u></u><u></u><u></u></div></div><div class="p5-cf" data-i="2" style="--i:2"><small>Sample · 3 of 5</small><h3>Case three</h3><p>Context, the change and the result in two lines.</p><div class="p5-cf-bar"><u></u><u></u><u></u></div></div><div class="p5-cf" data-i="3" style="--i:3"><small>Sample · 4 of 5</small><h3>Case four</h3><p>Context, the change and the result in two lines.</p><div class="p5-cf-bar"><u></u><u></u><u></u></div></div><div class="p5-cf" data-i="4" style="--i:4"><small>Sample · 5 of 5</small><h3>Case five</h3><p>Context, the change and the result in two lines.</p><div class="p5-cf-bar"><u></u><u></u><u></u></div></div></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a collection where one item is in focus at a time: cases, speakers, products. The neighbours stay visible, so people know there is more.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Five cards in a coverflow arrangement; the focused card faces the audience.",
});
})();
