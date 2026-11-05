// Slide 5 — five challenges for R&D teams building their own AI software factory, each with what we learned.
// Content from the Notion page "05 – The Challenge" (light grammar fixes only). Layout: a rail of the five challenges on the left
// (revealed one per press, passed ones fade) and a stage on the right that shows the current challenge in detail.
(function () {
  const ICONS = {
    // 1 — gears: systems that build systems
    1: `<circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
      <g><animateTransform attributeName="transform" type="rotate" from="0 48 66" to="360 48 66" dur="14s" repeatCount="indefinite"/>
        <circle cx="48" cy="66" r="23" class="p1-ch-teeth" stroke-dasharray="7 5.1"/><circle cx="48" cy="66" r="19" class="p1-ch-gear"/><circle cx="48" cy="66" r="6" class="p1-ch-hole"/></g>
      <g><animateTransform attributeName="transform" type="rotate" from="360 84 38" to="0 84 38" dur="9s" repeatCount="indefinite"/>
        <circle cx="84" cy="38" r="13" class="p1-ch-teeth p1-ch-teeth2" stroke-dasharray="5.4 4.6"/><circle cx="84" cy="38" r="10" class="p1-ch-gear"/><circle cx="84" cy="38" r="3.5" class="p1-ch-hole"/></g>`,
    // 2 — knowledge graph: context for agents
    2: `<circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
      <path class="p1-ch-link" d="M60 62 L30 40 M60 62 L92 42 M60 62 L36 92 M60 62 L88 90 M30 40 L36 92 M92 42 L88 90"/>
      <circle cx="60" cy="62" r="10" class="p1-ch-hub"><animate attributeName="r" values="10;13;10" dur="3.2s" repeatCount="indefinite"/></circle>
      <circle cx="30" cy="40" r="7" class="p1-ch-node"><animate attributeName="opacity" values="0.35;1;0.35" dur="3.2s" begin="0s" repeatCount="indefinite"/></circle>
      <circle cx="92" cy="42" r="7" class="p1-ch-node"><animate attributeName="opacity" values="0.35;1;0.35" dur="3.2s" begin="0.8s" repeatCount="indefinite"/></circle>
      <circle cx="88" cy="90" r="7" class="p1-ch-node"><animate attributeName="opacity" values="0.35;1;0.35" dur="3.2s" begin="1.6s" repeatCount="indefinite"/></circle>
      <circle cx="36" cy="92" r="7" class="p1-ch-node"><animate attributeName="opacity" values="0.35;1;0.35" dur="3.2s" begin="2.4s" repeatCount="indefinite"/></circle>`,
    // 3 — roles in orbit around the decision point
    3: `<circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
      <circle cx="60" cy="60" r="32" class="p1-ch-orbit"/>
      <path d="M60 46 l14 14 l-14 14 l-14 -14z" class="p1-ch-gate"/>
      <g><animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="16s" repeatCount="indefinite"/>
        <circle cx="60" cy="28" r="7" class="p1-ch-node"/><circle cx="87.7" cy="76" r="7" class="p1-ch-node p1-ch-node2"/><circle cx="32.3" cy="76" r="7" class="p1-ch-node p1-ch-node3"/></g>`,
    // 4 — moving away from the loop: ripples outwards
    4: `<circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
      <circle cx="60" cy="60" r="8" class="p1-ch-hub"/>
      <circle cx="60" cy="60" r="12" class="p1-ch-ripple"><animate attributeName="r" values="12;46" dur="4s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0" dur="4s" begin="0s" repeatCount="indefinite"/></circle>
      <circle cx="60" cy="60" r="12" class="p1-ch-ripple"><animate attributeName="r" values="12;46" dur="4s" begin="1.33s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0" dur="4s" begin="1.33s" repeatCount="indefinite"/></circle>
      <circle cx="60" cy="60" r="12" class="p1-ch-ripple"><animate attributeName="r" values="12;46" dur="4s" begin="2.66s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0" dur="4s" begin="2.66s" repeatCount="indefinite"/></circle>`,
    // 5 — hybrid: dev machine, on-prem gateway, cloud, with work moving between them
    5: `<circle cx="60" cy="60" r="54" class="p1-ch-ring"/>
      <path class="p1-ch-link" d="M30 84 L60 36 L90 84 Z"/>
      <rect x="18" y="74" width="24" height="18" rx="4" class="p1-ch-blk"/>
      <rect x="49" y="24" width="22" height="24" rx="4" class="p1-ch-blk"/><path d="M54 32 H66 M54 38 H66" class="p1-ch-lane"/>
      <circle cx="82" cy="86" r="7" class="p1-ch-cloud"/><circle cx="92" cy="82" r="9" class="p1-ch-cloud"/><circle cx="100" cy="88" r="6" class="p1-ch-cloud"/>
      <circle r="5" class="p1-ch-dotm"><animate attributeName="cx" values="30;60;90;30" dur="7s" repeatCount="indefinite"/><animate attributeName="cy" values="84;36;84;84" dur="7s" repeatCount="indefinite"/></circle>`,
  };

  const C = [
    { rail: "Each team must build its own AI factory",
      title: "Each team must build its own AI factory",
      body: ["Each SWE should learn how to “build systems to build systems”.", "R&amp;D teams must invent their very own ADLC pipelines and semantic services for context engineering, all based on their existing way of work."],
      learn: ["Brownfield and greenfield adoptions are totally different.", "Shared process blueprints and a golden set of skills are important, but teams must add customization.", "One size won’t fit all."] },
    { rail: "You need to invest in context engineering",
      title: "You need to invest in context engineering",
      body: ["Worker and Judge agents need grounded knowledge of the codebases and tacit, tribal knowledge."],
      learn: ["You need to find your way to reverse-document everything relevant for providing context to agents.", "Graphifying the codebase, building markdown-based knowledge vaults and embracing standards like Google’s Open Knowledge Format is key."] },
    { rail: "Reimagining how teams work is a necessity",
      title: "Reimagining how teams work is a necessity",
      body: ["Traditional roles like frontend, backend or data engineering are changing.", "SWEs operate on higher levels than hand-typed programming."],
      learn: ["The software engineer becomes orchestrator, decider, reviewer, and AI factory builder and maintainer.", "The focus of engineering spans from source to AI factory operations."] },
    { rail: "SWE roles and responsibilities are changing",
      title: "SWE roles and responsibilities are changing",
      body: ["Full end-to-end ownership of features.", "Responsibility for the spec-driven workflow.", "Context engineering for agentic delivery.", "Expertise on many levels of the AI factory."],
      learn: ["People need to learn how to move away from in-the-loop to near-the-loop and eventually out-of-the-loop."] },
    { rail: "AI factories should run on hybrid LLM infrastructure",
      title: "AI factories should run on a hybrid LLM infrastructure",
      body: ["The gap between open and closed models is narrowing.", "AI factories can be deployed on hybrid LLM infrastructures."],
      learn: ["A factory pipeline can run fully local on dev machines that can host at least one judge and one worker model.", "AI factories must be architected as durable agentic workflows that run distributed across many hosts: local dev machines, on-prem gateways and hyperscalers."] },
  ];
  const svg = (n) => `<svg viewBox="0 0 120 120" aria-hidden="true">${ICONS[n]}</svg>`;

  Deck.slide({
    id: "challenge",
    section: "why",
    title: "The challenge",
    className: "p1-ch",
    html: `
    <h2 class="p1-ch-head" data-anim="fade">Five challenges for every R&amp;D team building its own AI software factory</h2>
    <div class="p1-ch-wrap" data-anim="up" data-delay="200">
      <ol class="p1-ch-rail" data-focus="reveal">${C.map((c, i) => `<li><span class="p1-ch-no">${i + 1}</span><span class="p1-ch-rt">${c.rail}</span></li>`).join("")}</ol>
      <div class="p1-ch-idle">${C.map((_, i) => `<div class="p1-ch-idleico">${svg(i + 1)}<b>${i + 1}</b></div>`).join("")}</div>
      <div class="p1-ch-stage">
        ${C.map((c, i) => `<article class="p1-ch-card" data-i="${i + 1}">
          <header><div class="p1-ch-ico">${svg(i + 1)}</div><h3>${c.title}</h3></header>
          <div class="p1-ch-body">${c.body.map((t) => `<p>${t}</p>`).join("")}</div>
          <div class="p1-ch-learn"><div class="p1-ch-lh">What we learned</div>${c.learn.map((t) => `<p>${t}</p>`).join("")}</div>
        </article>`).join("")}
      </div>
    </div>`,
    onStep(step) { sync(step); },
    notes: "Five challenges for R&D teams building their own AI software factory; each press shows the next challenge and fades the ones already shown. 1) Each team must build its own AI factory: SWEs learn to build systems to build systems; brownfield and greenfield differ; blueprints and golden skills need customization; one size won't fit all. 2) Invest in context engineering: Worker and Judge agents need grounded codebase and tribal knowledge; reverse-document, graphify the codebase, markdown knowledge vaults, open knowledge format. 3) Reimagining how teams work: roles change, SWEs become orchestrators, deciders, reviewers and factory builders. 4) SWE roles and responsibilities change: end-to-end ownership, spec-driven workflow, context engineering; from in-the-loop to near-the-loop to out-of-the-loop. 5) Hybrid LLM infrastructure: open and closed models converge; a factory can run fully local on dev machines, and must be a durable workflow distributed across dev machines, on-prem gateways and hyperscalers.",
  });

  // Show the card that belongs to the current step (step 0 = overview of the five icons).
  function sync(step) {
    const root = document.querySelector(".p1-ch");
    if (!root) return;
    const s = typeof step === "number" ? step : Deck.state.step || 0;
    root.querySelector(".p1-ch-wrap").classList.toggle("is-idle", s < 1);
    root.querySelectorAll(".p1-ch-card").forEach((c) => c.classList.toggle("is-on", +c.dataset.i === s));
  }
  Deck.on("slidechange", () => sync());
  Deck.on("stepchange", ({ step }) => sync(step));
  Deck.on("ready", () => sync(0));
})();
