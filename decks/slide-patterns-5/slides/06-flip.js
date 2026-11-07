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
  id: "flip", section: "rotate", title: "Flip cards · front and back of the same idea", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-fl-root" data-s="0"><div class="p5-view p5-fl-view"><div class="p5-fl" data-at="1" data-on="0"><div class="p5-fl-in"><div class="p5-fl-f front"><small>Planning</small><b>Before</b><p>Plans live in documents nobody reads twice.</p></div><div class="p5-fl-f back"><small>Planning</small><b>After</b><p>The plan is a living board the whole team sees.</p></div></div></div><div class="p5-fl" data-at="2" data-on="0"><div class="p5-fl-in"><div class="p5-fl-f front"><small>Building</small><b>Before</b><p>Work waits in a queue for a single person.</p></div><div class="p5-fl-f back"><small>Building</small><b>After</b><p>Work flows to whoever is free, in small pieces.</p></div></div></div><div class="p5-fl" data-at="3" data-on="0"><div class="p5-fl-in"><div class="p5-fl-f front"><small>Shipping</small><b>Before</b><p>Releases are rare, large and stressful.</p></div><div class="p5-fl-f back"><small>Shipping</small><b>After</b><p>Releases are small, frequent and boring.</p></div></div></div></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> two sides of the same idea: before and after, myth and fact, question and answer. Flip one card per step.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Three cards that flip from before to after, one per step. Sample sentences only.",
});
})();
