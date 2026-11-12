(() => {
// Slide 18 — "recipe card": what it takes to build your own ADLC pipeline. Ingredients (competencies), method (blueprints + golden skills),
// crew (AI Factory team) and kitchen (dev machines + shared inference). Content: Notion page "17" (the author's text, typos fixed).
const COMPS = ["Spec-driven development", "Harness engineering", "Context engineering", "Building and operating hybrid agentic pipelines"];
const MODES = ["Full local", "Hybrid", "Cloud"];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = `<div class="p1r-root" data-s="4">
  <section class="p1r-card p1r-ing" data-st="1"><div class="p1r-lab"><b>01</b>Ingredients</div><h3>Core competencies the R&amp;D team builds</h3>
    <ul>${COMPS.map((c, i) => `<li style="--d:${i * 220}ms"><i></i><span>${esc(c)}</span></li>`).join("")}</ul></section>
  <section class="p1r-card p1r-met" data-st="2"><div class="p1r-lab"><b>02</b>Method</div><h3>Customise the ADLC workflow</h3>
    <div class="p1r-flow"><div class="p1r-box">Blueprints</div><span class="p1r-plus">+</span><div class="p1r-box">Golden set of agent skills</div></div>
    <div class="p1r-arrow" aria-hidden="true"><svg viewBox="0 0 40 60" width="40" height="60"><path d="M20 4v44M8 36l12 14 12-14" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="p1r-box p1r-out">Your ADLC workflow</div><p>Fitted to the way the team works today.</p></section>
  <section class="p1r-card p1r-crew" data-st="3"><div class="p1r-lab"><b>03</b>Crew</div><h3>A dedicated AI Factory team</h3>
    <div class="p1r-verbs"><span>Designs</span><span>Builds</span><span>Operates</span></div><p>The ADLC workflows and the infrastructure.</p></section>
  <section class="p1r-card p1r-kit" data-st="4"><div class="p1r-lab"><b>04</b>Kitchen</div><h3>Investment in the infrastructure</h3>
    <ul class="p1r-inv"><li>AI-ready dev machines</li><li>Shared LLM inference infrastructure</li></ul>
    <div class="p1r-modes">${MODES.map((m, i) => `<span style="--i:${i}">${esc(m)}</span>`).join("")}</div></section>
</div>`;

Deck.slide({
  id: "own-pipeline",
  section: "building",
  title: "What does it take to build your own ADLC pipeline?",
  navTitle: "Building your own pipeline",
  className: "p1r-s",
  html,
  notes: "What does it take to build your own ADLC pipeline? A recipe card in four parts, all shown at once. 1 Ingredients: R&D teams need to build four core competencies: spec-driven development, harness engineering, context engineering, and how to build and operate hybrid agentic pipelines. 2 Method: start from blueprints and a golden set of agent skills, and customise the ADLC workflow so it fits the way the team works today. 3 Crew: set up a dedicated AI Factory team that is responsible for designing, building and operating the ADLC workflows and the infrastructure. 4 Kitchen: invest in AI-ready dev machines and shared LLM inference infrastructure that support full local, hybrid and cloud configurations (see slide 13 for the machines). The three modes light up in turn: the same workflow runs in all three. Wording is the author's from the Notion page (typos fixed). Which blueprints and which golden skills, the size of the team and any budget are not stated yet, so nothing on the slide claims them. Earlier outline notes for this slide (ADLC principles): Humans decide; models work. No model approves its own work, and no missing person ever counts as a yes. Independent judges hold the line. Architecture, code review and verification are judged by separate agents on the strongest available model. You decide where your models run. Local by default; private or cloud models only for the roles you choose, under a policy that records everything that leaves. Work is durable. A crash, a reboot or a closed laptop interrupts work; it never loses it — and never approves anything. Everything is explainable. Every decision, model swap and gate has a recorded cause and actor. Calm, sequential work. One feature at a time per factory, in an order that keeps the right model loaded; parallelism happens between factories. Your workshop is yours; the team works in the open. Teams coordinate by making work visible — never by deciding for each other.",
});
})();
