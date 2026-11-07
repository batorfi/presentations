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
  id: "zoom-expand", section: "zoom", title: "Expanding node · open one part inside the whole", className: "p4-s",
  steps: 2,
  html: `<div class="p4-stage"><div class="p4-root p4-ex" data-s="0">
  <div class="p4-crumb2"><span>Pipeline</span><span data-step="1" data-anim="fade">› Build</span><span data-step="2" data-anim="fade">› Scan</span></div>
  <div class="p4-ex-row L0"><div class="p4-ex-card "><span class="p4-ex-tab">Plan</span><h3>Plan</h3><p class="p4-ex-cap">Decide what to build</p></div><div class="p4-ex-card is-open"><span class="p4-ex-tab">Build</span><h3>Build</h3><p class="p4-ex-cap">Make the change real</p><div class="p4-ex-row L1"><div class="p4-ex-card "><span class="p4-ex-tab">Compile</span><h3>Compile</h3><p class="p4-ex-cap">Turn source into artefacts</p></div><div class="p4-ex-card "><span class="p4-ex-tab">Package</span><h3>Package</h3><p class="p4-ex-cap">Bundle what ships</p></div><div class="p4-ex-card is-open"><span class="p4-ex-tab">Scan</span><h3>Scan</h3><p class="p4-ex-cap">Check what ships</p><div class="p4-ex-detail"><div class="p4-ex-chk"><span>Dependency check</span><b class="ok">pass</b></div><div class="p4-ex-chk"><span>Secret scan</span><b class="ok">pass</b></div><div class="p4-ex-chk"><span>Licence check</span><b class="warn">review</b></div></div></div></div></div><div class="p4-ex-card "><span class="p4-ex-tab">Test</span><h3>Test</h3><p class="p4-ex-cap">Prove it works</p></div><div class="p4-ex-card "><span class="p4-ex-tab">Release</span><h3>Release</h3><p class="p4-ex-cap">Put it in front of people</p></div></div></div></div><p class="p4-use" data-anim="fade" data-delay="500"><b>Use it for</b> a process whose stages hide their own processes. Open one stage inside the whole, so the audience never loses the surrounding context.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Four stages in a row; one expands to show its own sub-stages, and one of those expands again. Breadcrumb shows the path.",
});
})();
