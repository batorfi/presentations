(() => {
// Slide 16 — SWE roles in an AI software factory: the SWE in the centre, seven roles on a ring, all shown at once, grouped in three by colour.
// Roles are the author-approved seven from the Notion page 16 ("My views"), named after the ADLC of slide 8 (gates, judges, engine room, control room). Wording is a draft.
const GROUPS = [
  { name: "Shape the work", roles: [
    { n: "Intent owner", d: "Turns a need into a spec an agent can act on", a: "Roadmap to Specification" },
    { n: "Architecture steward", d: "Keeps boundaries, types and the domain sound", a: "Architecture · Experience" },
  ] },
  { name: "Build the factory", roles: [
    { n: "Factory builder", d: "Builds and tunes the harness, context and pipeline", a: "Engine room · Orchestrator" },
    { n: "Verification owner", d: "Designs the proof: tests and independent judges", a: "Verify · Code and UI review" },
  ] },
  { name: "Keep it trustworthy", roles: [
    { n: "Gatekeeper", d: "Decides what ships and signs for the outcome", a: "Merge · every human gate" },
    { n: "Operator", d: "Watches the factory and feeds learning back", a: "Control room · Record" },
    { n: "Mentor", d: "Grows judgement in the next engineers", a: "The team" },
  ] },
];
const CX = 840, CY = 405, RX = 600, RY = 300, W = 424, H = 148;
const flat = [];
GROUPS.forEach((g, gi) => g.roles.forEach((r) => flat.push({ ...r, g: gi })));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pos = flat.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / flat.length; return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) }; });
const spokes = pos.map((p, i) => `<line class="p1o-sp" data-g="${flat[i].g}" x1="${CX}" y1="${CY}" x2="${p.x.toFixed(0)}" y2="${p.y.toFixed(0)}"/>`).join("");
// light loop: a dot runs out along each spoke and back (the loop between the SWE and the role)
const dots = pos.map((p, i) => `<circle class="p1o-dot" data-g="${flat[i].g}" r="8"><animateMotion dur="3.6s" begin="-${(i * 0.5).toFixed(1)}s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0" keyTimes="0;.5;1" path="M ${CX} ${CY} L ${p.x.toFixed(0)} ${p.y.toFixed(0)}"/></circle>`).join("");
const cards = flat.map((r, i) => `<article class="p1o-role" data-g="${r.g}" style="left:${(pos[i].x - W / 2).toFixed(0)}px;top:${(pos[i].y - H / 2).toFixed(0)}px;width:${W}px;height:${H}px">
  <span class="p1o-n">${i + 1}</span><h3>${esc(r.n)}</h3><p>${esc(r.d)}</p><small>${esc(r.a)}</small></article>`).join("");
const html = `<div class="p1o-root" data-s="3">
  <svg class="p1o-svg" viewBox="0 0 1680 848" width="1680" height="848" aria-hidden="true">
    <ellipse class="p1o-orbit" cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}"/>${spokes}${dots}
  </svg>
  <div class="p1o-core"><svg viewBox="0 0 40 48" width="64" height="77" aria-hidden="true"><circle cx="20" cy="13" r="9" fill="currentColor"/><path d="M3 47C3 31 11 26 20 26s17 5 17 21z" fill="currentColor"/></svg><b>The SWE</b><span class="p1o-cap">Owns the delivery</span></div>
  ${cards}
</div>`;

Deck.slide({
  id: "full-ownership",
  section: "engineer",
  title: "SWEs taking full ownership of delivery",
  navTitle: "Full ownership of delivery",
  className: "p1o-s",
  html,
  notes: "In an AI software factory the SWE stops being the person who types the change and becomes accountable for the whole delivery and its outcome. These are roles a person plays, not job titles; one SWE usually plays several, and the mix changes with team size. Shape the work (first colour group): the intent owner turns a need into a specification an agent can act on (roadmap, concept, specification gates); the architecture steward keeps boundaries, types and the domain sound (architecture and experience gates). Build the factory (second group): the factory builder builds and tunes the harness, context and pipeline (the engine room and the orchestrator of slide 8); the verification owner designs the proof, tests and independent judges (verify, code review and UI review gates), which is the weakest and most contested gate in every source. Keep it trustworthy (third group): the gatekeeper decides what ships and signs for the outcome (merge and every human gate); the operator watches the factory and feeds what production teaches back into specifications, skills and gates (control room, record); the mentor grows judgement in the next engineers when routine tasks go to agents. Evidence: the author's research report on SWE roles (see Notion page 16): attention consolidates at the specification and release gates, verification is the weakest gate, accountability stays human; no settled job titles, so no titles and no numbers on the slide. The role names and one-line duties are a draft; the ADLC anchors follow slide 8. Links: slide 14 (higher up means more leverage and less control, so gates matter) and slide 15 (these roles are what moves a SWE near the loop).",
});
})();
