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
  id: "iso-architecture", section: "iso", title: "Isometric scene · a system as a small world", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-iso p5-ia" data-s="0"><div class="p5-view p5-iso-view"><div class="p5-world3 p5-w3a"><div class="p5-slab p5-slab-a"></div><div class="p5-road" data-at="2" data-on="0" style="--x:-220.0px;--y:0.0px;--rw:114px;--rh:14px"></div><div class="p5-road" data-at="3" data-on="0" style="--x:-5.0px;--y:0.0px;--rw:104px;--rh:14px"></div><div class="p5-road" data-at="3" data-on="0" style="--x:40.0px;--y:0.0px;--rw:14px;--rh:314px"></div><div class="p5-road" data-at="3" data-on="0" style="--x:80.0px;--y:-150.0px;--rw:94px;--rh:14px"></div><div class="p5-road" data-at="3" data-on="0" style="--x:80.0px;--y:150.0px;--rw:94px;--rh:14px"></div><div class="p5-road" data-at="4" data-on="0" style="--x:250.0px;--y:-150.0px;--rw:124px;--rh:14px"></div><div class="p5-road" data-at="4" data-on="0" style="--x:250.0px;--y:150.0px;--rw:124px;--rh:14px"></div><div class="p5-box" data-at="1" data-on="0" style="--x:-330px;--y:0px;--w:120px;--d:120px;--kt:0.35;--bc:var(--deck-text-2)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-box" data-at="2" data-on="0" style="--x:-110px;--y:0px;--w:120px;--d:200px;--kt:0.7;--bc:var(--deck-accent)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-box" data-at="3" data-on="0" style="--x:120px;--y:-150px;--w:150px;--d:150px;--kt:1.5;--bc:var(--deck-info)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-box" data-at="3" data-on="0" style="--x:120px;--y:150px;--w:150px;--d:150px;--kt:1.1;--bc:var(--deck-info)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-box" data-at="4" data-on="0" style="--x:380px;--y:-150px;--w:150px;--d:150px;--kt:0.6;--bc:var(--deck-ok)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-box" data-at="4" data-on="0" style="--x:380px;--y:150px;--w:150px;--d:150px;--kt:0.45;--bc:var(--deck-delegated)"><i class="t"></i><i class="s"></i><i class="e"></i></div><div class="p5-bill p5-bl" data-at="1" data-on="0" style="--x:-330px;--y:0px;--z:129.0px">Users</div><div class="p5-bill p5-bl" data-at="2" data-on="0" style="--x:-110px;--y:0px;--z:164.0px">Gateway</div><div class="p5-bill p5-bl" data-at="3" data-on="0" style="--x:120px;--y:-150px;--z:244.0px">Service A</div><div class="p5-bill p5-bl" data-at="3" data-on="0" style="--x:120px;--y:150px;--z:244.0px">Service B</div><div class="p5-bill p5-bl" data-at="4" data-on="0" style="--x:380px;--y:-150px;--z:154.0px">Datastore</div><div class="p5-bill p5-bl" data-at="4" data-on="0" style="--x:380px;--y:150px;--z:139.0px">Queue</div></div></div><div class="p5-capbar"><span class="p5-cp" data-for="0">Start with the people who use it.</span><span class="p5-cp" data-for="1">One door in front of everything.</span><span class="p5-cp" data-for="2">Two services do the work.</span><span class="p5-cp" data-for="3">Data and background work sit behind them.</span></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> explaining how a system is laid out. Blocks stand on a floor, roads show who talks to whom, and height says how big each part is.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "An isometric scene built in four steps: users, gateway, services, data and queue.",
});
})();
