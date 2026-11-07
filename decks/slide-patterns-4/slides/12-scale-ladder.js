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
  id: "scale-ladder", section: "depth", title: "Scale ladder · feel the size of things", className: "p4-s",
  steps: 4,
  html: `<div class="p4-stage"><div class="p4-root p4-sl" data-s="0" data-cams='["translate(400px,350px) scale(6.666667)","translate(400px,350px) scale(2.222222)","translate(400px,350px) scale(0.740741)","translate(400px,350px) scale(0.246914)","translate(400px,350px) scale(0.082305)"]'><ol class="p4-rail"><li class="p4-rung"><i>1</i><div><b>Line</b><span>One statement</span></div></li><li class="p4-rung"><i>2</i><div><b>Function</b><span>A few lines that do one thing</span></div></li><li class="p4-rung"><i>3</i><div><b>Module</b><span>A set of functions with a purpose</span></div></li><li class="p4-rung"><i>4</i><div><b>Repository</b><span>A project with its history</span></div></li><li class="p4-rung"><i>5</i><div><b>Organisation</b><span>Many repositories and teams</span></div></li></ol><div class="p4-sv"><svg class="s-svg" viewBox="0 0 800 700" width="800" height="700" role="img" aria-label="Nested squares at five scales"><g class="p4-cam" style="transform:translate(400px,350px) scale(6.666667)"><rect class="p4-ring r4" x="-3645.00" y="-3645.00" width="7290.00" height="7290.00" rx="218.70"/><text class="p4-rl" x="-3316.95" y="-2916.00" style="font-size:510.30px">Organisation</text><rect class="p4-ring r3" x="-1215.00" y="-1215.00" width="2430.00" height="2430.00" rx="72.90"/><text class="p4-rl" x="-1105.65" y="-972.00" style="font-size:170.10px">Repository</text><rect class="p4-ring r2" x="-405.00" y="-405.00" width="810.00" height="810.00" rx="24.30"/><text class="p4-rl" x="-368.55" y="-324.00" style="font-size:56.70px">Module</text><rect class="p4-ring r1" x="-135.00" y="-135.00" width="270.00" height="270.00" rx="8.10"/><text class="p4-rl" x="-122.85" y="-108.00" style="font-size:18.90px">Function</text><rect class="p4-ring r0" x="-45.00" y="-45.00" width="90.00" height="90.00" rx="2.70"/><text class="p4-rl" x="-40.95" y="-36.00" style="font-size:6.30px">Line</text><text class="p4-mono" x="0" y="6.30" text-anchor="middle" style="font-size:11.70px">a = b + c</text></g></svg><p class="p4-sv-note">Schematic drawing: each rung is drawn three times wider than the one before it.</p></div></div></div><p class="p4-use" data-anim="fade" data-delay="500"><b>Use it for</b> making size tangible. Zoom out one rung at a time, so each level is seen at its own scale and the jump between them is felt.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Five nested levels from a line of code to an organisation. Each step zooms out one rung. The drawing is schematic, not to scale.",
});
})();
