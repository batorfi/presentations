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
  id: "closing", section: "close", title: "Pick the pattern that fits the message", className: "p5-s",
  html: `<div class="p5-map p5-stage"><table><tbody><tr data-anim="up" data-delay="0"><td>Walk through six aspects of one thing</td><td>Cube</td><td>#1</td></tr><tr data-anim="up" data-delay="55"><td>Offer a ring of options</td><td>Carousel ring</td><td>#2</td></tr><tr data-anim="up" data-delay="110"><td>Focus on one card among its neighbours</td><td>Coverflow</td><td>#3</td></tr><tr data-anim="up" data-delay="165"><td>Reveal the other side of an idea</td><td>Flip cards</td><td>#4</td></tr><tr data-anim="up" data-delay="220"><td>Take the audience on a journey</td><td>Fly-through</td><td>#5</td></tr></tbody></table><table><tbody><tr data-anim="up" data-delay="200"><td>Show layers from every angle</td><td>Orbit layers</td><td>#6</td></tr><tr data-anim="up" data-delay="255"><td>Compare values as a skyline</td><td>Isometric bars</td><td>#7</td></tr><tr data-anim="up" data-delay="310"><td>Draw a system as a small world</td><td>Isometric scene</td><td>#8</td></tr><tr data-anim="up" data-delay="365"><td>Show a network with clusters</td><td>Orbit network</td><td>#9</td></tr><tr data-anim="up" data-delay="420"><td>Show how a value varies over two inputs</td><td>Surface</td><td>#10</td></tr></tbody></table></div>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Mapping from message to pattern for volume 5.",
});
})();
