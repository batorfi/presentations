(() => {
  // Slide 12 — ADLC defined: the canonical gated pipeline from roadmap to merge. Twelve gates in four phases, one phase per click,
  // then the five verdicts a person can give at any gate. Interface gates are tinted; gates with an independent judge show it as a badge.
  // Content: the author's process diagram (tool neutral).
  const PHASES = [
    { cls: "pr", name: "Program", gates: [
      { n: "", t: "Roadmap gate", q: "Which feature next, in what order, and how does this factory run? Admits one feature at a time.", tag: "Person only", foot: "Re-opens after every merge" },
    ], },
    { cls: "co", name: "Contract: what to build", gates: [
      { n: "1", t: "Concept", q: "Is this worth building, on these premises?" },
      { n: "2", t: "Architecture", q: "Is this the right structure?", judge: "architecture critic" },
      { n: "2a", t: "Experience design", q: "Right experience for these users and journeys, within the charter?", judge: "design critic", ui: 1 },
      { n: "3", t: "Specification", q: "What exactly counts as done, and what must not change?" },
      { n: "4", t: "Work plan", q: "In what pieces and order? Sets the model order on the lane." },
    ] },
    { cls: "bp", name: "Build and prove", gates: [
      { n: "5", t: "Implementation", q: "Start from a safe, restorable point. Still one feature?" },
      { n: "6", t: "Code review", q: "Is the code right, against the specification?", judge: "code reviewer" },
      { n: "6a", t: "UI review", q: "Does what was built match what was approved?", judge: "UI reviewer", ui: 1 },
      { n: "7", t: "Verification", q: "Does it work as specified? Up to two automatic fix rounds first.", judge: "verifier" },
    ] },
    { cls: "re", name: "Release", gates: [
      { n: "8", t: "Documentation", q: "Do docs and knowledge describe what was built?" },
      { n: "9", t: "Merge", q: "Do we ship it? The only place “ship it” is authorised." },
    ] },
  ];
  const VERDICTS = [
    ["approve", "moves to the next gate"],
    ["revise", "your note goes back to the same author"],
    ["reject", "a fresh author, or an earlier gate you name"],
    ["restart", "rebuild from the restorable commit"],
    ["split + revise", "grow into two features"],
  ];
  const gate = (g) => `<div class="p1ad-g${g.judge ? " has-j" : ""}${g.ui ? " is-ui" : ""}" data-gate="${g.n || "0"}">
      <b class="p1ad-n">${g.n || "★"}</b><h4>${g.t}</h4><p>${g.q}</p>${g.judge ? `<span class="p1ad-j">${g.judge}</span>` : ""}${g.tag ? `<span class="p1ad-tag">${g.tag}</span>` : ""}${g.foot ? `<span class="p1ad-ft">${g.foot}</span>` : ""}</div>`;
  const cols = PHASES.map((p) => `<section class="p1ad-ph ${p.cls}"><h3>${p.name}</h3><div class="p1ad-gates">${p.gates.map(gate).join("")}</div></section>`).join("");
  const verdicts = VERDICTS.map(([v, t]) => `<div class="p1ad-v"><b>${v}</b><span>${t}</span></div>`).join("");
  const STOPS = ["0", "2a", "5", "8", "9"]; // the gate each state brings to the left edge
  const apply = (ctx, step, snap) => {
    const view = ctx.$(".p1ad-view"), strip = ctx.$(".p1ad-strip");
    if (!view || !strip) return;
    const vp = ctx.$(".p1ad-vp"), endX = vp.offsetLeft + vp.offsetWidth, W = strip.scrollWidth, H = strip.offsetHeight, vw = view.clientWidth, vh = view.clientHeight;
    const fit = vw / endX;
    let tf;
    if (step === 0) tf = `translate(0px, ${(vh - H * fit) / 2 + 60}px) scale(${fit})`;
    else {
      const key = STOPS[Math.min(step, STOPS.length) - 1];
      const el = key === "0" ? null : ctx.$(`.p1ad-g[data-gate="${key}"]`);
      const x = el ? el.offsetLeft + el.offsetParent.offsetLeft - 8 : 0;
      tf = `translate(${-x}px, 0px) scale(1)`;
    }
    strip.classList.toggle("p1ad-snap", !!snap);
    strip.style.transform = tf;
    ctx.$(".p1ad-lead").classList.toggle("is-off", step > 0);
  };
  Deck.slide({
    id: "adlc-defined",
    section: "what",
    title: "ADLC defined",
    className: "p1ad-s",
    steps: 5,
    onEnter: (ctx) => apply(ctx, 0, true),
    onStep: (step, dir, ctx) => apply(ctx, step, false),
    html: `<div class="p1ad">
      <p class="p1ad-lead">The default flow: twelve gates in four phases. A person decides at every gate.</p>
      <div class="p1ad-view"><div class="p1ad-strip">${cols}<section class="p1ad-vp"><h3>At any gate, a person can</h3><div class="p1ad-vs">${verdicts}</div></section></div></div>
    </div>`,
    notes: "ADLC defined: the lifecycle that runs inside the factory. Twelve gates in four phases, and a person decides at every gate. The slide opens on the whole pipeline, then zooms in and pans left to right. Click 1, Program: the roadmap gate is person only. It decides which feature comes next and admits one feature at a time, and it re-opens after every merge. Click 2, Contract, what to build: concept, architecture (with an architecture critic), experience design for interface work (design critic), specification, work plan. Click 3, Build and prove: implementation from a safe, restorable point, code review (code reviewer), UI review for interface work (UI reviewer), verification (verifier, up to two automatic fix rounds first). Click 4, Release: documentation, then merge, the only place ship it is authorised. Click 5: at any gate the person can approve, revise, reject, restart or split and revise. Independent judges, shown as dark badges, never review their own work.",
  });
})();
