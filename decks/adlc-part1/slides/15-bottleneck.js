(() => {
// Slide 16 — the SWE becomes the bottleneck. Typewriter statement, practitioner claims as proofs, and the in / near / out of the loop ladder.
// Content grounded in the Notion page "15" background material (no names on the slide). Role and experience wording is a draft.
const PROOFS = [
  ["Fewer mistakes", "Recent models make fewer mistakes than an engineer on a good day."],
  ["Attention is finite", "Watching many agents at once splits your attention. The human becomes the limit."],
  ["Most work can run alone", "Given the right system, much of today's work could run without the engineer."],
];
const STAGES = [
  { id: "in", name: "In the loop", verb: "Prompt", role: "Prompts and steers every step", dx: "Attention on every step, many terminals", trig: "You start the agent", tag: "Bottleneck" },
  { id: "near", name: "Near the loop", verb: "Approve", role: "Approves at gates, gives feedback, designs the triggers", dx: "Step away, step in when required", trig: "An event or you start the agent", tag: "Recommended for our teams" },
  { id: "out", name: "Out of the loop", verb: "Observe", role: "Builds the system, then watches it run", dx: "Things run on triggers, like a cron job", trig: "An event starts the agent", tag: "" },
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const proofs = PROOFS.map(([h, t]) => `<li class="p1b-proof"><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join("");
const stages = STAGES.map((s, i) => `<article class="p1b-st" data-st="${s.id}" data-i="${i}" style="--h:${[80, 90, 100][i]}%">
  <span class="p1b-n">${i + 1}</span>
  ${s.tag ? `<span class="p1b-tag">${esc(s.tag)}</span>` : ""}
  <header><span class="p1b-verb">${esc(s.verb)}</span><h3>${esc(s.name)}</h3></header>
  <dl><dt>The SWE's role</dt><dd>${esc(s.role)}</dd><dt>Developer experience</dt><dd>${esc(s.dx)}</dd><dt>What starts the agent</dt><dd>${esc(s.trig)}</dd></dl>
</article>`).join("");
const html = `<div class="p1b-root" data-s="0">
  <div class="s-typewriter p1b-tw" data-font-size="68" data-cps="24" data-width="100%" data-style="bar" data-cursor-end="hide">
    <p>Stay in the loop, and **you** become the bottleneck.</p>
  </div>
  <div class="p1b-lab">Claims from practitioners, not measured data</div>
  <ul class="p1b-proofs">${proofs}</ul>
  <div class="p1b-ladder">${stages}</div>
</div>`;

const apply = (ctx, step, snap) => {
  const r = ctx.$(".p1b-root"); if (!r) return;
  if (snap) r.classList.add("p1b-snap");
  r.dataset.s = step;
  if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1b-snap")); }
};

Deck.slide({
  id: "bottleneck",
  section: "engineer",
  title: "Warning: eventually we SWEs become the bottleneck",
  navTitle: "The SWE as bottleneck",
  className: "p1b-s",
  steps: 3,
  html,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "Warning: eventually we SWEs become the bottleneck. Step 0: the statement types itself while the three claims appear under it: if we stay inside the agentic implementation loop, the human becomes the bottleneck. The three practitioner claims (opinion and experience of one practitioner, not measured data): recent models make fewer mistakes than an engineer on a good day; split attention across many agents makes the human the limit; given the right system, much of today's work could run without the engineer. Do not quote any percentage: the figure given in the source (80% or more) is unmeasured. Steps 1 to 3 uncover the stairs one by one, from the bottom: the three stages are an evolution of the SWE's role. In the loop: you prompt and steer every step; the agent starts when you start it. Near the loop: you approve, respond and give feedback; the work happens before and after you check in; events (webhook, cron, ticket, log event) start the agents, and the engineer designs what reaches the agents and what reaches the human. Out of the loop: you observe and the system runs on triggers. Near the loop is the stage we recommend for our teams: the ADLC human gates and independent judges are exactly this stage, and the end state of fully leaving the loop is not what the ADLC proposes. The measure of progress is how many useful systems run without you. Role and experience wording per stage is a draft to check. Slide 15 shows where the engineer works (the levels); this slide shows where the engineer sits relative to the loop.",
});
})();
