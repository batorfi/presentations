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
  id: "flythrough", section: "travel", title: "Fly-through · camera travels through frames", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-fly-root" data-s="0"><div class="p5-view p5-fly"><div class="p5-floor"></div><div class="p5-world"><div class="p5-fr" data-i="0" style="--i:0;--x:-90px"><small>Stage one</small><h3>Where we are</h3><ul><li>A first point about the present</li><li>A second point that supports it</li><li>A third point with a number</li></ul><span class="p5-fr-n">1</span></div><div class="p5-fr" data-i="1" style="--i:1;--x:90px"><small>Stage two</small><h3>What changes next</h3><ul><li>The first change, in plain words</li><li>The second change and who owns it</li><li>A risk we are watching</li></ul><span class="p5-fr-n">2</span></div><div class="p5-fr" data-i="2" style="--i:2;--x:-90px"><small>Stage three</small><h3>What it looks like</h3><ul><li>The outcome people will notice</li><li>How we will measure it</li><li>What we stop doing</li></ul><span class="p5-fr-n">3</span></div><div class="p5-fr" data-i="3" style="--i:3;--x:90px"><small>Stage four</small><h3>Where we end up</h3><ul><li>The target state in one sentence</li><li>The first step towards it</li><li>The decision we need today</li></ul><span class="p5-fr-n">4</span></div></div></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a story told as a journey, with stops in a fixed order. The camera flies forward one frame per step, and what is ahead stays visible in the distance.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Four frames placed one behind the other in depth; each step moves the camera to the next frame.",
});
})();
