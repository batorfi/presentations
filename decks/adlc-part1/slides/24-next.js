// Slide 24 — wrap-up of Part 1: six key takeaways synthesised from the whole deck, and what is coming (Parts 2 and 3).
// The Part 2 / Part 3 wording and durations come from the series-intro slide (02). Icons are small looping SVGs (SMIL).
(() => {
  const ICONS = {
    // accountable: a gate with a check, a ring that pulses
    1: `<path d="M36 8 L64 36 L36 64 L8 36 Z" class="p1tk-ln"/><path d="M24 37 l9 9 l16-18" class="p1tk-ok"/>
      <circle cx="36" cy="36" r="28" class="p1tk-rip"><animate attributeName="r" values="28;35" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="3.2s" repeatCount="indefinite"/></circle>`,
    // spec: a document, a scan line moving down it
    2: `<rect x="15" y="8" width="42" height="56" rx="6" class="p1tk-ln"/><path d="M24 24 H48 M24 34 H48 M24 44 H40" class="p1tk-mut"/>
      <rect x="19" y="12" width="34" height="5" rx="2.5" class="p1tk-scan"><animate attributeName="y" values="12;52;12" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;.9;.9" dur="4s" repeatCount="indefinite"/></rect>`,
    // factory lane: a work item pausing at three gates
    3: `<path d="M6 36 H66" class="p1tk-mut"/><circle cx="20" cy="36" r="7" class="p1tk-pip"/><circle cx="36" cy="36" r="7" class="p1tk-pip"/><circle cx="52" cy="36" r="7" class="p1tk-pip"/>
      <circle cy="36" r="5.5" class="p1tk-dot"><animate attributeName="cx" values="6;20;20;36;36;52;52;66" keyTimes="0;.18;.34;.5;.62;.78;.9;1" dur="6s" repeatCount="indefinite"/></circle>`,
    // twelve gates on a ring, one lit
    4: `<g class="p1tk-ring12"></g><g><animateTransform attributeName="transform" type="rotate" from="0 36 36" to="360 36 36" dur="9s" repeatCount="indefinite"/><circle cx="36" cy="9" r="5.5" class="p1tk-dot"/></g>`,
    // moving out of the loop: ripples outward from the centre
    5: `<circle cx="36" cy="36" r="7" class="p1tk-hub"/><circle cx="36" cy="36" r="16" class="p1tk-mut2"/><circle cx="36" cy="36" r="28" class="p1tk-mut2"/>
      <circle cx="36" cy="36" r="9" class="p1tk-rip"><animate attributeName="r" values="9;30" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="4s" repeatCount="indefinite"/></circle>
      <circle cx="36" cy="36" r="9" class="p1tk-rip"><animate attributeName="r" values="9;30" dur="4s" begin="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="4s" begin="2s" repeatCount="indefinite"/></circle>`,
    // build step by step: a dot climbing four steps
    6: `<rect x="8" y="52" width="13" height="12" rx="3" class="p1tk-step"/><rect x="23" y="40" width="13" height="24" rx="3" class="p1tk-step"/><rect x="38" y="28" width="13" height="36" rx="3" class="p1tk-step"/><rect x="53" y="16" width="13" height="48" rx="3" class="p1tk-step"/>
      <circle r="5.5" class="p1tk-dot"><animate attributeName="cx" values="14.5;29.5;44.5;59.5;59.5;14.5" keyTimes="0;.2;.4;.6;.85;1" dur="6s" repeatCount="indefinite"/><animate attributeName="cy" values="45;33;21;9;9;45" keyTimes="0;.2;.4;.6;.85;1" dur="6s" repeatCount="indefinite"/></circle>`,
  };
  // the twelve gate dots (icon 4)
  ICONS[4] = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return `<circle cx="${(36 + 27 * Math.cos(a)).toFixed(1)}" cy="${(36 + 27 * Math.sin(a)).toFixed(1)}" r="3.6" class="p1tk-pip2"/>`;
  }).join("") + ICONS[4].replace('<g class="p1tk-ring12"></g>', "");
  const TAKE = [
    ["--deck-accent", "People stay accountable", "AI can write the feature, but it cannot own it. A person decides at every gate."],
    ["--deck-info", "Specs, not vibes", "Vibe coding has no review step. Spec-driven work gives agents intent, tests and a trace."],
    ["--deck-wait", "A factory, not a tool", "Independent judges, a local-by-default substrate and a team space around every gate."],
    ["--deck-ok", "The ADLC is the pipeline", "Twelve gates in four phases: workers build, judges check, a person decides."],
    ["--deck-delegated", "The engineer leaves the loop", "From prompting every step to approving at gates, and building the factory itself."],
    ["--deck-accent", "Build yours, step by step", "Invest in context, start from blueprints and golden skills, and earn autonomy: observe, rehearse, contribute, own."],
  ];
  const cards = TAKE.map(([c, t, b], i) => `<article class="p1tk-c" style="--c:var(${c})"><svg viewBox="0 0 72 72" aria-hidden="true">${ICONS[i + 1]}</svg><div><h3>${t}</h3><p>${b}</p></div></article>`).join("");
  Deck.slide({
    id: "next",
    section: "next",
    title: "Key takeaways and what comes next",
    navTitle: "Key takeaways",
    className: "p1tk-s",
    html: `<div class="p1tk">
      <h2 class="p1tk-h">Key takeaways</h2>
      <div class="p1tk-grid">${cards}</div>
      <section class="p1tk-n" data-step="1" data-anim="up"><h2>What is coming</h2>
        <div class="p1tk-x"><b>Part 2 · 90 min</b><span>ADLC stages, skills and human gates</span></div>
        <i class="p1tk-chev" aria-hidden="true"><s></s><s></s><s></s></i>
        <div class="p1tk-x"><b>Part 3 · 90 min</b><span>Live, from concept to merge request</span></div>
      </section>
    </div>`,
    notes: "Key takeaways of Part 1, six messages. 1 People stay accountable: AI can write the feature, but it cannot own it; a person decides at every gate. 2 Specs, not vibes: vibe coding has no review step; spec-driven work gives agents intent, tests and a trace. 3 A factory, not a tool: independent judges, a local-by-default substrate and a team space around every gate. 4 The ADLC is the pipeline: twelve gates in four phases, workers build, judges check, a person decides. 5 The engineer leaves the loop: from prompting every step to approving at gates, and building the factory itself. 6 Build yours step by step: invest in context, start from blueprints and golden skills, and earn autonomy in brownfield work: observe, rehearse, contribute, own. Click: what is coming. Part 2 (90 min) opens the ADLC process with its stages, skills and human gates; Part 3 (90 min) runs it live from concept to merge request. Then Q&A.",
  });
})();
