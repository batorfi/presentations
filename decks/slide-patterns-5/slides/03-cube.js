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
  id: "cube", section: "rotate", title: "Cube · six faces, one turn at a time", className: "p5-s",
  steps: 5,
  html: `<div class="p5-stage"><div class="p5-root p5-cu" data-s="0"><ol class="p5-cu-list"><li><i style="background:var(--deck-accent)"></i>Reliable</li><li><i style="background:var(--deck-info)"></i>Fast</li><li><i style="background:var(--deck-ok)"></i>Secure</li><li><i style="background:var(--deck-delegated)"></i>Simple</li><li><i style="background:var(--deck-danger)"></i>Visible</li><li><i style="background:var(--deck-text-2)"></i>Affordable</li></ol><div class="p5-view"><div class="p5-cube"><div class="p5-face" style="--fc:var(--deck-accent);transform: translateZ(260px)"><small>1 of 6</small><h3>Reliable</h3><p>It keeps working when things go wrong.</p></div><div class="p5-face" style="--fc:var(--deck-info);transform:rotateY(90deg) translateZ(260px)"><small>2 of 6</small><h3>Fast</h3><p>It answers before anyone has to wait.</p></div><div class="p5-face" style="--fc:var(--deck-ok);transform:rotateY(180deg) translateZ(260px)"><small>3 of 6</small><h3>Secure</h3><p>It protects what people trust it with.</p></div><div class="p5-face" style="--fc:var(--deck-delegated);transform:rotateY(-90deg) translateZ(260px)"><small>4 of 6</small><h3>Simple</h3><p>It is easy to understand and to change.</p></div><div class="p5-face" style="--fc:var(--deck-danger);transform:rotateX(90deg) translateZ(260px)"><small>5 of 6</small><h3>Visible</h3><p>It tells us what is happening inside.</p></div><div class="p5-face" style="--fc:var(--deck-text-2);transform:rotateX(-90deg) translateZ(260px)"><small>6 of 6</small><h3>Affordable</h3><p>It costs what it is worth.</p></div></div></div></div></div><p class="p5-use" data-anim="fade" data-delay="500"><b>Use it for</b> a topic with several equal aspects. The cube turns to one face per step, so each aspect gets the whole stage.</p>`,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "A cube that turns to show one aspect per step. Six sample qualities.",
});
})();
