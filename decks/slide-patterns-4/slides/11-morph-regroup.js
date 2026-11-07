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
  id: "morph-regroup", section: "build", title: "Regroup morph · same items, new arrangement", className: "p4-s",
  steps: 2,
  html: `<div class="p4-stage"><div class="p4-root p4-rg" data-s="0"><div class="p4-rg-area"><div class="p4-it g1" style="--x0:455px;--y0:70px;--x1:852px;--y1:150px;--x2:300px;--y2:170px;--v:64"><span>B2</span><i><b>64</b></i></div><div class="p4-it g0" style="--x0:655px;--y0:70px;--x1:98px;--y1:250px;--x2:300px;--y2:370px;--v:38"><span>A3</span><i><b>38</b></i></div><div class="p4-it g2" style="--x0:855px;--y0:70px;--x1:1218px;--y1:150px;--x2:300px;--y2:70px;--v:81"><span>C1</span><i><b>81</b></i></div><div class="p4-it g0" style="--x0:1055px;--y0:70px;--x1:98px;--y1:150px;--x2:300px;--y2:120px;--v:72"><span>A1</span><i><b>72</b></i></div><div class="p4-it g2" style="--x0:455px;--y0:200px;--x1:1218px;--y1:250px;--x2:300px;--y2:470px;--v:26"><span>C3</span><i><b>26</b></i></div><div class="p4-it g1" style="--x0:655px;--y0:200px;--x1:852px;--y1:250px;--x2:300px;--y2:420px;--v:30"><span>B4</span><i><b>30</b></i></div><div class="p4-it g0" style="--x0:855px;--y0:200px;--x1:292px;--y1:250px;--x2:300px;--y2:520px;--v:20"><span>A4</span><i><b>20</b></i></div><div class="p4-it g2" style="--x0:1055px;--y0:200px;--x1:1412px;--y1:150px;--x2:300px;--y2:270px;--v:47"><span>C2</span><i><b>47</b></i></div><div class="p4-it g1" style="--x0:455px;--y0:330px;--x1:658px;--y1:150px;--x2:300px;--y2:20px;--v:90"><span>B1</span><i><b>90</b></i></div><div class="p4-it g1" style="--x0:655px;--y0:330px;--x1:658px;--y1:250px;--x2:300px;--y2:320px;--v:44"><span>B3</span><i><b>44</b></i></div><div class="p4-it g0" style="--x0:855px;--y0:330px;--x1:292px;--y1:150px;--x2:300px;--y2:220px;--v:55"><span>A2</span><i><b>55</b></i></div><div class="p4-it g2" style="--x0:1055px;--y0:330px;--x1:1412px;--y1:250px;--x2:300px;--y2:570px;--v:14"><span>C4</span><i><b>14</b></i></div><div class="p4-glab g0" style="left:98px">Group A</div><div class="p4-glab g1" style="left:658px">Group B</div><div class="p4-glab g2" style="left:1218px">Group C</div><div class="p4-axis"><span>0</span><span>Value (sample)</span><span>100</span></div></div><div class="p4-capbar"><span class="p4-cp" data-for="0">Twelve items, no order yet.</span><span class="p4-cp" data-for="1">Group them by what they have in common.</span><span class="p4-cp" data-for="2">Now rank them by value.</span></div></div></div><p class="p4-use" data-anim="fade" data-delay="500"><b>Use it for</b> the same data seen three ways. Let the audience watch each item travel, so they trust that nothing was added or dropped.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Twelve items move from a mixed grid to three groups to a ranked bar list. Sample values only.",
});
})();
