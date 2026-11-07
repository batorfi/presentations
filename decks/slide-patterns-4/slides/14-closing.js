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
  id: "closing", section: "close", title: "Pick the pattern that fits the message", className: "p4-s",
  html: `<div class="p4-map p4-stage"><table><tbody><tr data-anim="up" data-delay="0"><td>Show the big picture, then the detail</td><td>Zoom · map</td><td>#1</td></tr><tr data-anim="up" data-delay="55"><td>Go from a programme to one day</td><td>Zoom · timeline</td><td>#2</td></tr><tr data-anim="up" data-delay="110"><td>Add detail without moving anything</td><td>Level of detail</td><td>#3</td></tr><tr data-anim="up" data-delay="165"><td>Go from a total to the rows behind it</td><td>Drill-down</td><td>#4</td></tr><tr data-anim="up" data-delay="220"><td>Look inside one part of a process</td><td>Expanding node</td><td>#5</td></tr><tr data-anim="up" data-delay="275"><td>Watch a system grow</td><td>Build-up</td><td>#6</td></tr></tbody></table><table><tbody><tr data-anim="up" data-delay="200"><td>Build the argument in stages</td><td>Chart build</td><td>#7</td></tr><tr data-anim="up" data-delay="255"><td>Split one thing into several</td><td>Split morph</td><td>#8</td></tr><tr data-anim="up" data-delay="310"><td>Rearrange the same items</td><td>Regroup morph</td><td>#9</td></tr><tr data-anim="up" data-delay="365"><td>Feel how much bigger each level is</td><td>Scale ladder</td><td>#10</td></tr><tr data-anim="up" data-delay="420"><td>Take a stack apart, layer by layer</td><td>Layer peel</td><td>#11</td></tr></tbody></table></div>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Mapping from message to pattern for volume 4.",
});
})();
