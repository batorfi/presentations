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
  id: "zoom-drill", section: "zoom", title: "Drill-down · a total, its parts, the rows", className: "p4-s",
  steps: 2,
  html: `<div class="p4-stage"><div class="p4-root p4-dd" data-s="0">
  <div class="p4-dd-kpi"><small>Total · sample figure</small><strong>128</strong><span>items in scope</span><em>▲ 8 more than last period</em></div>
  <div class="p4-dd-chart" data-step="1" data-anim="left"><h3>By category</h3><div class="p4-dd-row"><span>Category A</span><i><u style="width:100.0%"></u></i><b>46</b></div><div class="p4-dd-row is-pick"><span>Category B</span><i><u style="width:73.9%"></u></i><b>34</b></div><div class="p4-dd-row"><span>Category C</span><i><u style="width:52.2%"></u></i><b>24</b></div><div class="p4-dd-row"><span>Category D</span><i><u style="width:34.8%"></u></i><b>16</b></div><div class="p4-dd-row"><span>Category E</span><i><u style="width:17.4%"></u></i><b>8</b></div></div>
  <div class="p4-dd-table" data-step="2" data-anim="left"><h3>Category B · 5 of 34 shown</h3><div class="p4-dd-th"><span>Item</span><span>Owner</span><b>Count</b></div><div class="p4-dd-tr"><span>Item B-01</span><span>Team 1</span><b>12</b></div><div class="p4-dd-tr"><span>Item B-02</span><span>Team 2</span><b>9</b></div><div class="p4-dd-tr"><span>Item B-03</span><span>Team 1</span><b>7</b></div><div class="p4-dd-tr"><span>Item B-04</span><span>Team 3</span><b>4</b></div><div class="p4-dd-tr"><span>Item B-05</span><span>Team 2</span><b>2</b></div></div>
</div></div><p class="p4-use" data-anim="fade" data-delay="500"><b>Use it for</b> a number that people will ask about. Show the total, then the parts that make it up, then the rows behind the biggest part.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "A headline figure moves aside to make room for its breakdown, then the rows behind one category. Sample figures only.",
});
})();
