(() => {
  // Slide 12 — ADLC defined: the canonical gated pipeline from roadmap to merge. Twelve gates in four phases, one phase per click,
  // then the five verdicts a person can give at any gate. Interface gates are tinted; gates with an independent judge show it as a badge.
  // Content: the author's process diagram (tool neutral).
  // Each gate: workers (who prepares the work), judge (independent, never decides), moves (what a person can decide, with where it leads).
  const PHASES = [
    { cls: "pr", name: "Program", gates: [
      { n: "", t: "Roadmap gate", q: "Which feature next, in what order?", c: "Knowledge, past record, candidate ideas, your roadmap brief", a: ["ROADMAP.md"], w: ["planner"], m: [["approve", "admits the next feature"], ["revise", "planner redrafts"], ["reject", "nothing admitted"], ["edit rows", "reshape the roadmap"]] },
    ] },
    { cls: "co", name: "Contract: what to build", gates: [
      { n: "1", t: "Concept", q: "Is this worth building, on these premises?", c: "Knowledge base, code, permitted sources", a: ["concept.md"], w: ["researcher", "concept writer"], m: [["approve", "to Architecture"], ["revise", "note to the same writer"], ["reject", "back to the Roadmap gate"]] },
      { n: "2", t: "Architecture", q: "Is this the right structure?", c: "The concept", a: ["design.md"], w: ["designer"], j: ["architecture critic"], m: [["approve", "to Specification"], ["revise", "critic re-runs"], ["reject", "fresh designer, or Concept"]] },
      { n: "2a", t: "Experience design", q: "Right experience for these users and journeys?", c: "The concept, the charter, the design system", a: ["experience.md", "mockups", "states matrix"], ui: 1, w: ["ux designer"], j: ["design critic"], m: [["approve", "to Specification"], ["approve with open points", "carried to UI review"], ["revise", "same ux designer"], ["reject", "Architecture or earlier"]] },
      { n: "3", t: "Specification", q: "What exactly counts as done?", c: "The concept, the design, the constitution", a: ["spec.md"], w: ["spec writer"], m: [["approve", "to Work plan; can arm the unattended tail"], ["revise", "note to the same writer"], ["reject", "fresh writer, or Architecture"]] },
      { n: "4", t: "Work plan", q: "In what pieces and order?", c: "The specification and the design; teammates' claims", a: ["plan.md", "tasks.md"], w: ["planner"], m: [["approve", "to Implementation"], ["revise", "note to the planner"], ["reject", "fresh plan, or Specification"]] },
    ] },
    { cls: "bp", name: "Build and prove", gates: [
      { n: "5", t: "Implementation", q: "Start from a safe, restorable point. Still one feature?", c: "The plan and the tasks", a: ["restorable commit"], w: ["director"], m: [["approve", "building starts"], ["split + revise", "the rest becomes a new roadmap feature"]] },
      { n: "6", t: "Code review", q: "Is the code right, against the specification?", c: "The specification and the design", a: ["diff", "review notes"], w: ["workers"], j: ["code reviewer"], m: [["approve", "to Verification"], ["revise", "workers fix, fresh review"], ["restart", "rebuild from the restorable commit"]] },
      { n: "6a", t: "UI review", q: "Does what was built match what was approved?", c: "The approved experience, charter, design system", a: ["ui-review-report.md", "screenshots"], ui: 1, w: ["UI checker"], j: ["UI reviewer"], m: [["approve", "to Verification"], ["approve with deviations", "accepted and noted"], ["revise", "workers fix, checker re-runs"], ["restart", "fresh build"]] },
      { n: "7", t: "Verification", q: "Does it work as specified? Up to two automatic fix rounds first.", c: "The specification, the yardstick", a: ["verification report"], w: ["worker"], j: ["verifier"], m: [["approve", "failures recorded as accepted"], ["reject", "back to implementation, or Specification"]] },
    ] },
    { cls: "re", name: "Release", gates: [
      { n: "8", t: "Documentation", q: "Do docs and knowledge describe what was built?", c: "The as-built code and the specification", a: ["docs", "feature story"], w: ["techwriter", "wiki keeper"], m: [["approve", "to Merge"], ["revise", "note to the techwriter"], ["reject", "fresh techwriter"]] },
      { n: "9", t: "Merge", q: "Do we ship it?", c: "Every gate's decision and the risks carried forward", a: ["pull request"], w: ["PR writer"], m: [["approve", "merge; the Roadmap gate re-opens"], ["reject", "the gate you name, or Roadmap"]] },
    ] },
  ];
  const VERDICTS = [
    ["approve", "moves to the next gate"],
    ["revise", "your note goes back to the same author"],
    ["reject", "a fresh author, or an earlier gate you name"],
    ["restart", "rebuild from the restorable commit"],
    ["split + revise", "grow into two features"],
  ];
  const MV = { approve: "ok", revise: "wait", reject: "no", restart: "re", split: "re", edit: "re" };
  const chips = (l) => l.map((x) => `<span>${x}</span>`).join("");
  const gate = (g) => `<div class="p1ad-g${g.j ? " has-j" : ""}${g.ui ? " is-ui" : ""}" data-gate="${g.n || "0"}">
      <div class="p1ad-hd"><b class="p1ad-n">${g.n || "★"}</b><h4>${g.t}</h4></div><p>${g.q}</p>
      <div class="p1ad-blk bc"><i>Context</i><span>${g.c}</span></div>
      <div class="p1ad-blk bw"><i>Workers</i><div class="p1ad-ch">${chips(g.w)}</div></div>
      ${g.j ? `<div class="p1ad-blk bj"><i>Judge</i><div class="p1ad-ch">${chips(g.j)}</div></div>` : ""}
      <div class="p1ad-blk ba"><i>Assets</i><div class="p1ad-ch">${chips(g.a)}</div></div>
      <div class="p1ad-blk bh"><i>A person decides</i>${g.m.map(([v, t]) => `<div class="p1ad-m ${MV[v.split(" ")[0]] || "re"}"><b>${v}</b><span>${t}</span></div>`).join("")}</div></div>`;
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
    title: "ADLC pipeline blueprint",
    className: "p1ad-s",
    steps: 5,
    onEnter: (ctx) => apply(ctx, 0, true),
    onStep: (step, dir, ctx) => apply(ctx, step, false),
    html: `<div class="p1ad">
      <div class="p1ad-lead"><p>The default flow: twelve gates in four phases. A person decides at every gate.</p><div class="p1ad-leg"><span class="lw">Workers do the work</span><span class="lj">Judges check it, and never decide</span><span class="lc">Context it reads</span><span class="la">Assets it produces</span><span class="lh">People decide</span></div></div>
      <div class="p1ad-view"><div class="p1ad-strip">${cols}<section class="p1ad-vp"><h3>At any gate, a person can</h3><div class="p1ad-vs">${verdicts}</div></section></div></div>
    </div>`,
    notes: "ADLC defined: the lifecycle that runs inside the factory. Twelve gates in four phases, and a person decides at every gate. The slide opens on the whole pipeline, then zooms in and pans left to right. Click 1, Program: the roadmap gate is person only. It decides which feature comes next and admits one feature at a time, and it re-opens after every merge. Click 2, Contract, what to build: concept, architecture (with an architecture critic), experience design for interface work (design critic), specification, work plan. Click 3, Build and prove: implementation from a safe, restorable point, code review (code reviewer), UI review for interface work (UI reviewer), verification (verifier, up to two automatic fix rounds first). Click 4, Release: documentation, then merge, the only place ship it is authorised. Click 5: at any gate the person can approve, revise, reject, restart or split and revise. Each gate card shows the context it reads, its workers, its independent judge if it has one (a judge never decides and never edits), the key assets it produces (concept, design, spec, plan, tasks and so on), and the moves a person can make there.",
  });
})();
