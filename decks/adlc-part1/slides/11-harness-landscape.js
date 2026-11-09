(() => {
// Slide 11 — AI coding harness landscape: vertical split, closed (left) and open (right), four cards each.
// Step n expands card n (closed side first); expanded card shows two more strengths. Content: Notion page "11 – AI coding harness landscape"
// (background material from the harness landscape report, 9 Nov 2026). Strengths only, no numbers on the slide; evidence and caveats in the notes.
const SIDES = [
  { id: "closed", name: "Closed harnesses", lead: "Commercial products; platforms competing on distribution", cards: [
    { n: "Claude Code", o: "Anthropic", h: "Documented, open-sourced sandbox", s: ["Plan mode", "Full MCP"] },
    { n: "Cursor", o: "Anysphere", h: "Event-driven cloud agents", s: ["Own agentic models", "MCP marketplace"] },
    { n: "GitHub Copilot agent", o: "Microsoft / GitHub", h: "Safe by design: own branches only", s: ["Async draft PRs", "Claude and Codex backends"] },
    { n: "OpenAI Codex", o: "OpenAI · CLI is open source", h: "Clear sandbox and approval modes", s: ["Open-source CLI", "Long autonomous runs"] },
  ] },
  { id: "open", name: "Open harnesses", lead: "Open-source frameworks; light cores, growing as embedded infrastructure", cards: [
    { n: "OpenHands", o: "MIT", h: "Sandbox built in (Docker)", s: ["Full MCP", "Hosted option"] },
    { n: "Goose", o: "Apache-2.0 · Linux Foundation", h: "Neutral governance", s: ["MCP at the core", "Self-enabling extensions"] },
    { n: "DeepSeek Harness", o: "MIT · DeepSeek-AI", h: "Everything is a plugin", s: ["Sub-agents", "Auto-approval reviewer"] },
    { n: "pi harness", o: "MIT · pi.dev", h: "Minimal core: four tools", s: ["Opt-in extensions", "Embeds in other tools"] },
  ] },
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
let k = 0;
const cols = SIDES.map((sd) => {
  const cards = sd.cards.map((c) => {
    k++;
    return `<article class="p1h-card" data-i="${k}" data-on="0"><header><h3>${esc(c.n)}</h3><span class="p1h-own">${esc(c.o)}</span></header><div class="p1h-head">${esc(c.h)}</div><ul class="p1h-more">${c.s.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>`;
  }).join("");
  return `<section class="p1h-col is-${sd.id}"><div class="p1h-ch"><h2>${esc(sd.name)}</h2><p>${esc(sd.lead)}</p></div><div class="p1h-cards">${cards}</div></section>`;
}).join("");
const html = `<div class="p1h-root" data-s="0">${cols}</div>`;

const apply = (ctx, step, snap) => {
  const r = ctx.$(".p1h-root"); if (!r) return;
  if (snap) r.classList.add("p1h-snap");
  r.dataset.s = step;
  r.querySelectorAll(".p1h-card").forEach((el) => { el.dataset.on = +el.dataset.i === step ? "1" : "0"; el.dataset.seen = +el.dataset.i < step ? "1" : "0"; });
  if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1h-snap")); }
};

Deck.slide({
  id: "harness-landscape",
  section: "landscape",
  title: "AI Coding Harness Landscape",
  className: "p1h-s",
  steps: 8,
  html,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "AI coding harness landscape: closed on the left, open on the right, eight harnesses. A harness is the agent-loop scaffolding around an LLM that lets it read, write, run and test code: tools, a multi-step loop, context management and an autonomy model. Step 0: the whole split. Steps 1 to 8: one card at a time, closed side first, each showing its headline strength and two more. Evidence behind the strengths (from the harness landscape report, 9 Nov 2026; vendor-reported unless marked): Claude Code: OS-level sandbox (Seatbelt, bubblewrap) open-sourced as sandbox-runtime, off by default; plan mode and auto-approve; full MCP. Cursor: cloud agents in isolated VMs subscribing to GitHub, Slack and Linear events, with automatic CI fixes on Teams plans; in-house agentic models (Composer); MCP marketplace. Copilot coding agent: asynchronous draft PRs in an ephemeral, firewalled GitHub Actions environment, pushes only to copilot/* branches and cannot approve or merge its own PRs; can run Claude or Codex as backends. Codex: three sandbox modes (read-only, workspace-write, danger-full-access) separate from the approval policy; the CLI repository is Apache-2.0 while the models and cloud service are proprietary; reported to work independently for over 7 hours. OpenHands: MIT, Docker-based sandbox as a first-class design, MCP across UI, SDK and Cloud, hosted tiers. Goose: Apache-2.0, donated by Block to the Linux Foundation Agentic AI Foundation (with MCP and AGENTS.md); extensions are MCP servers and it can self-enable one. DeepSeek Harness: MIT, plugin framework Cordis, developer preview with a breaking-changes warning; sub-agents and the auto-approval reviewer are experimental; no published benchmark yet. pi harness: MIT, four tools (read, write, edit, bash) and a very small system prompt, everything else opt-in; no sandbox of its own; Thoughtworks Radar Vol. 35 describes its adoption as mostly embedded infrastructure; its MCP support is described differently by two sources. Caveats: no numbers on the slide on purpose (benchmarks are not comparable across vendors, prices and valuations move fast); the report excluded Devin, Windsurf, Amazon Q Developer, Replit Agent, Aider, Cline, Plandex, Gemini CLI and OpenCode from this slide only for space. Takeaway for the talk: choose on documented sandboxing, MCP support and governance, not on a benchmark score.",
});
})();
