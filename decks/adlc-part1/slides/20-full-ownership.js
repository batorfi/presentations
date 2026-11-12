(() => {
// Slide 17 — SWE roles in an AI software factory: the SWE in the centre, seven roles on a ring, all shown at once, grouped in three by colour.
// Roles are the author-approved seven from the Notion page 17 ("My views"), named after the ADLC of slide 9 (gates, judges, engine room, control room). Wording and the human competencies per role are a draft (the author's views, to be challenged).
const GROUPS = [
  { name: "Shape the work", roles: [
    { n: "Intent owner", k: ["Requirements", "Spec writing", "Use cases"], c: ["Clear writing", "Product sense", "Questioning"], d: "Turns a need into an agent-ready spec", a: "Roadmap to Specification" },
    { n: "Architecture steward", k: ["Architecture", "API design", "Domain model"], c: ["Systems thinking", "Domain depth", "Trade-offs"], d: "Keeps boundaries and the domain sound", a: "Architecture · Experience" },
  ] },
  { name: "Build the factory", roles: [
    { n: "Factory builder", k: ["CI/CD", "Build systems", "Scripting"], c: ["Process design", "Automation", "Cost sense"], d: "Tunes the harness, context and pipeline", a: "Engine room · Orchestrator" },
    { n: "Verification owner", k: ["Test design", "Code review", "Debugging"], c: ["Critical thinking", "Scepticism", "Risk sense"], d: "Designs the proof: tests and judges", a: "Verify · Code and UI review" },
  ] },
  { name: "Keep it trustworthy", roles: [
    { n: "Gatekeeper", k: ["Code review", "Security", "Release mgmt"], c: ["Decisiveness", "Accountability", "Saying no"], d: "Decides what ships; signs the outcome", a: "Merge · every human gate" },
    { n: "Operator", k: ["Monitoring", "Incidents", "Root cause"], c: ["Curiosity", "Pattern spotting", "Composure"], d: "Watches it run, feeds learning back", a: "Control room · Record" },
    { n: "Mentor", k: ["Pairing", "Teaching", "Documentation"], c: ["Coaching", "Empathy", "Patience"], d: "Grows judgement in the next engineers", a: "The team" },
  ] },
];
const CX = 840, CY = 418, RX = 620, RY = 318, W = 460, H = 190;
const flat = [];
GROUPS.forEach((g, gi) => g.roles.forEach((r) => flat.push({ ...r, g: gi })));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pos = flat.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / flat.length; return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) }; });
const spokes = pos.map((p, i) => `<line class="p1o-sp" data-g="${flat[i].g}" data-r="${i}" x1="${CX}" y1="${CY}" x2="${p.x.toFixed(0)}" y2="${p.y.toFixed(0)}"/>`).join("");
// light loop: a dot runs out along each spoke and back (the loop between the SWE and the role)
const dots = pos.map((p, i) => `<circle class="p1o-dot" data-g="${flat[i].g}" data-r="${i}" r="8"><animateMotion dur="3.6s" begin="-${(i * 0.5).toFixed(1)}s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0" keyTimes="0;.5;1" path="M ${CX} ${CY} L ${p.x.toFixed(0)} ${p.y.toFixed(0)}"/></circle>`).join("");
const cards = flat.map((r, i) => `<article class="p1o-role" data-g="${r.g}" data-r="${i}" style="left:${(pos[i].x - W / 2).toFixed(0)}px;top:${(pos[i].y - H / 2).toFixed(0)}px;width:${W}px;height:${H}px">
  <h3>${esc(r.n)}</h3><p>${esc(r.d)}</p><small>${esc(r.a)}</small><ul class="p1o-comp" aria-label="Human competencies">${r.c.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><ul class="p1o-skill" aria-label="Classical software engineering skills">${r.k.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("");
const html = `<div class="p1o-root" data-s="3">
  <svg class="p1o-svg" viewBox="0 0 1680 848" width="1680" height="848" aria-hidden="true">
    <ellipse class="p1o-orbit" cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}"/>${spokes}${dots}
  </svg>
  <div class="p1o-core"><svg viewBox="0 0 40 48" width="64" height="77" aria-hidden="true"><circle cx="20" cy="13" r="9" fill="currentColor"/><path d="M3 47C3 31 11 26 20 26s17 5 17 21z" fill="currentColor"/></svg><b>The SWE</b><span class="p1o-cap">Owns the delivery</span></div>
  ${cards}
  <div class="p1o-legend"><span>Round pills = human competencies · Square pills = classical SWE skills</span></div>
</div>`;

Deck.slide({
  id: "full-ownership",
  section: "engineer",
  title: "SWEs taking full ownership of delivery",
  navTitle: "Full ownership of delivery",
  className: "p1o-s",
  html,
  notes: "In an AI software factory the SWE stops being the person who types the change and becomes accountable for the whole delivery and its outcome. These are roles a person plays, not job titles; one SWE usually plays several, and the mix changes with team size. Shape the work (first colour group): the intent owner turns a need into a specification an agent can act on (roadmap, concept, specification gates); the architecture steward keeps boundaries, types and the domain sound (architecture and experience gates). Build the factory (second group): the factory builder builds and tunes the harness, context and pipeline (the engine room and the orchestrator of slide 11); the verification owner designs the proof, tests and independent judges (verify, code review and UI review gates), which is the weakest and most contested gate in every source. Keep it trustworthy (third group): the gatekeeper decides what ships and signs for the outcome (merge and every human gate); the operator watches the factory and feeds what production teaches back into specifications, skills and gates (control room, record); the mentor grows judgement in the next engineers when routine tasks go to agents. Each panel also lists three human competencies the role needs (draft): intent owner: clear writing, product sense, questioning; architecture steward: systems thinking, domain depth, trade-offs; factory builder: process design, automation, cost sense; verification owner: critical thinking, scepticism, risk sense; gatekeeper: decisiveness, accountability, saying no; operator: curiosity, pattern spotting, composure; mentor: coaching, empathy, patience. Square pills list the classical software engineering skills each role builds on (draft): intent owner: requirements, spec writing, use cases; architecture steward: architecture, API design, domain model; factory builder: CI/CD, build systems, scripting; verification owner: test design, code review, debugging; gatekeeper: code review, security, release management; operator: monitoring, incidents, root cause; mentor: pairing, teaching, documentation. The message: the new roles sit on top of classical engineering, they do not replace it. Evidence: the author's research report on SWE roles (see Notion page 17): attention consolidates at the specification and release gates, verification is the weakest gate, accountability stays human; no settled job titles, so no titles and no numbers on the slide. The role names and one-line duties are a draft; the ADLC anchors follow slide 11. Links: slide 18 (higher up means more leverage and less control, so gates matter) and slide 19 (these roles are what moves a SWE near the loop).",
});
})();
