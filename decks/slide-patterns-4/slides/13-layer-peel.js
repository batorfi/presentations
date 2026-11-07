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
  id: "layer-peel", section: "depth", title: "Layer peel · take a stack apart", className: "p4-s",
  steps: 4,
  html: `<div class="p4-stage"><div class="p4-root p4-lp" data-s="0"><div class="p4-lp-svg"><svg class="s-svg" viewBox="0 0 1000 700" width="1000" height="700" role="img" aria-label="Layers pulled apart"><g class="p4-layer ly2" style="--sy:80px;--ey:430px"><path class="p4-sl-top is-data" d="M0 90.0 L330.0 0 L660 90.0 L330.0 180 Z"/><path class="p4-sl-l is-data" d="M0 90.0 L330.0 180 L330.0 204 L0 114.0 Z"/><path class="p4-sl-r is-data" d="M330.0 180 L660 90.0 L660 114.0 L330.0 204 Z"/><text class="p4-lt" x="690" y="102.0">Data</text></g><g class="p4-layer ly1" style="--sy:50px;--ey:225px"><path class="p4-sl-top is-logic" d="M0 90.0 L330.0 0 L660 90.0 L330.0 180 Z"/><path class="p4-sl-l is-logic" d="M0 90.0 L330.0 180 L330.0 204 L0 114.0 Z"/><path class="p4-sl-r is-logic" d="M330.0 180 L660 90.0 L660 114.0 L330.0 204 Z"/><text class="p4-lt" x="690" y="102.0">Logic</text></g><g class="p4-layer ly0" style="--sy:20px;--ey:20px"><path class="p4-sl-top is-ui" d="M0 90.0 L330.0 0 L660 90.0 L330.0 180 Z"/><path class="p4-sl-l is-ui" d="M0 90.0 L330.0 180 L330.0 204 L0 114.0 Z"/><path class="p4-sl-r is-ui" d="M330.0 180 L660 90.0 L660 114.0 L330.0 204 Z"/><text class="p4-lt" x="690" y="102.0">UI</text></g></svg></div><div class="p4-pinfo"><div class="p4-pi" data-for="0"><h3>One product</h3><p>From the outside it looks like a single thing.</p></div><div class="p4-pi" data-for="1"><h3>Three layers</h3><p>Pull it apart and each layer has its own job.</p></div><div class="p4-pi" data-for="2"><h3>UI</h3><p>What people see and touch. It changes often.</p></div><div class="p4-pi" data-for="3"><h3>Logic</h3><p>The rules and decisions behind every screen.</p></div><div class="p4-pi" data-for="4"><h3>Data</h3><p>What the system remembers. It changes with care.</p></div></div></div></div><p class="p4-use" data-anim="fade" data-delay="500"><b>Use it for</b> anything built in layers: a stack, an organisation, a process. Pull it apart, then put one layer in the light at a time.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "A three-layer stack pulled apart in an exploded view; each step puts one layer in focus. Sample layers only.",
});
})();
