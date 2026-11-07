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
  id: "orbit-layers", section: "travel", title: "Orbit layers · walk around a stack of planes", className: "p5-s",
  steps: 3,
  html: `<div class="p5-stage"><div class="p5-root p5-orb-root" data-s="0"><div class="p5-view p5-orb-view"><div class="p5-orb"><div class="p5-pl" style="--z:255.0px;--c:var(--deck-accent)"><b>Experience</b><div class="p5-pl-t"><u>Pages</u><u>Forms</u><u>Charts</u><u>Alerts</u><u>Search</u><u>Help</u></div></div><div class="p5-pl" style="--z:85.0px;--c:var(--deck-info)"><b>Services</b><div class="p5-pl-t"><u>Orders</u><u>Billing</u><u>Users</u><u>Reports</u><u>Notify</u><u>Audit</u></div></div><div class="p5-pl" style="--z:-85.0px;--c:var(--deck-ok)"><b>Platform</b><div class="p5-pl-t"><u>Identity</u><u>Queue</u><u>Cache</u><u>Events</u><u>Config</u><u>Gateway</u></div></div><div class="p5-pl" style="--z:-255.0px;--c:var(--deck-delegated)"><b>Infrastructure</b><div class="p5-pl-t"><u>Compute</u><u>Network</u><u>Storage</u><u>Backups</u><u>Secrets</u><u>Monitoring</u></div></div></div></div><div class="p5-capbar"><span class="p5-cp" data-for="0">Face on, it looks like one flat picture.</span><span class="p5-cp" data-for="1">Turn the camera: the layers appear.</span><span class="p5-cp" data-for="2">From the side, the depth is clear.</span><span class="p5-cp" data-for="3">From above, see what each layer holds.</span></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> anything built in layers. The camera orbits the stack, so the audience understands the order before they read the labels.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Four translucent planes in depth; each step moves the camera to a new angle.",
});
})();
