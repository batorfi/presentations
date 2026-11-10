(() => {
// Slide 11 — AI coding harness landscape: vertical split, closed (left) and open (right), four cards each.
// Step 0: what a harness is (anatomy: LLM, agent loop, harness capabilities for factory builders). Step 1: the landscape, all eight cards in full. Content: Notion page "11 – AI coding harness landscape"
// (background material from the harness landscape report, 9 Nov 2026). Strengths only, no numbers on the slide; evidence and caveats in the notes.
const SIDES = [
  { id: "closed", name: "Closed harnesses", lead: "Commercial products; platforms competing on distribution", cards: [
    { n: "Claude Code", o: "Anthropic", h: "Documented, open-sourced sandbox", s: ["Plan mode", "Full MCP"] },
    { n: "Cursor", o: "Anysphere", h: "Event-driven cloud agents", s: ["Own agentic models", "MCP marketplace"] },
    { n: "Google Antigravity", o: "Google", h: "Agent Manager: many agents in parallel", s: ["Built-in browser for agents", "Skills kept in the repo"] },
    { n: "GitHub Copilot agent", o: "Microsoft / GitHub", h: "Full end-to-end AI factory", s: ["Fusion model", "Accessible anywhere"] },
    { n: "OpenAI Codex", o: "OpenAI · CLI is open source", h: "Clear sandbox and approval modes", s: ["Open-source CLI", "Long autonomous runs"] },
  ] },
  { id: "open", name: "Open harnesses", lead: "Open-source frameworks and light, embeddable cores", cards: [
    { n: "OpenHands", o: "MIT", h: "Sandbox built in (Docker)", s: ["Full MCP", "Hosted option"] },
    { n: "Goose", o: "Apache-2.0 · Linux Foundation", h: "GDK: reusable agent-runtime components", s: ["Embed an agent in your app", "Composable state machine"] },
    { n: "DeepSeek Harness", o: "MIT · DeepSeek-AI", h: "Plugin system: everything is a plugin", s: ["Sub-agents", "Auto-approval reviewer"] },
    { n: "pi harness", o: "MIT · pi.dev", h: "Minimal core: four tools", s: ["Opt-in extensions", "Embeds in other tools"] },
  ] },
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
let k = 0;
const cols = SIDES.map((sd) => {
  const cards = sd.cards.map((c) => {
    k++;
    return `<article class="p1h-card" data-i="${k}"><header><h3>${esc(c.n)}</h3><span class="p1h-own">${esc(c.o)}</span></header><div class="p1h-head">${esc(c.h)}</div><ul class="p1h-more">${c.s.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>`;
  }).join("");
  return `<section class="p1h-col is-${sd.id}"><div class="p1h-ch"><h2>${esc(sd.name)}</h2><p>${esc(sd.lead)}</p></div><div class="p1h-cards">${cards}</div></section>`;
}).join("");
// anatomy view: LLM in the centre, agent loop around it (read, write, run, test), factory-builder capabilities on the outer ring
const CAPS = ["Session management", "Durable runtime", "Execution sandbox", "Short and long term memory", "Observability", "Governance", "Safety"];
const CX = 530, CY = 385, RX = 410, RY = 305;
const capNodes = CAPS.map((c, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / CAPS.length, x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a);
  return { c, x, y };
});
const lines = capNodes.map((n) => `<line x1="${CX}" y1="${CY}" x2="${n.x.toFixed(0)}" y2="${n.y.toFixed(0)}"/>`).join("");
const chips = capNodes.map((n, i) => `<div class="p1h-cap" style="left:${n.x.toFixed(0)}px;top:${n.y.toFixed(0)}px;--d:${i * 90}ms">${esc(n.c)}</div>`).join("");
const LOOP = [["Read", 0], ["Write", 90], ["Run", 180], ["Test", 270]].map(([t, d]) => {
  const a = ((d - 90) * Math.PI) / 180, x = CX + 150 * Math.cos(a), y = CY + 150 * Math.sin(a);
  return `<div class="p1h-lp" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px">${t}</div>`;
}).join("");
const anatomy = `<div class="p1h-what">
  <div class="p1h-def"><h2>What is an AI coding harness?</h2>
    <p>The scaffolding around an LLM that lets it <b>read, write, run and test code</b> in a real project: tools, a multi-step loop, context management and an autonomy model.</p>
    <ul><li><b>Chat</b> only talks about code.</li><li><b>Autocomplete</b> suggests the next few tokens.</li><li><b>A harness</b> acts on the codebase.</li></ul>
    <div class="p1h-note">Outer ring: what an AI factory builder needs from a harness.</div></div>
  <div class="p1h-diag"><svg viewBox="0 0 1060 770" width="1060" height="770" aria-hidden="true">
    <g class="p1h-lines">${lines}</g>
    <circle class="p1h-ring" cx="${CX}" cy="${CY}" r="150"/>
    <circle class="p1h-hring" cx="${CX}" cy="${CY}" r="215"/>
    <circle class="p1h-pulse" r="11"><animateMotion dur="7s" repeatCount="indefinite" path="M ${CX} ${CY - 150} A 150 150 0 1 1 ${CX - 0.01} ${CY - 150} Z"/></circle>
  </svg>
  ${LOOP}
  <div class="p1h-llm">LLM</div>
  <div class="p1h-hlab">Harness</div>
  ${chips}</div></div>`;
const html = `<div class="p1h-root" data-s="0"><div class="p1h-view is-what">${anatomy}</div><div class="p1h-view is-cards">${cols}</div></div>`;

const apply = (ctx, step, snap) => {
  const r = ctx.$(".p1h-root"); if (!r) return;
  if (snap) r.classList.add("p1h-snap");
  r.dataset.s = step;
  if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1h-snap")); }
};

Deck.slide({
  id: "harness-landscape",
  section: "landscape",
  title: "AI Coding Harness Landscape",
  className: "p1h-s",
  steps: 1,
  html,
  onEnter(ctx) { apply(ctx, ctx.step, true); },
  onStep(step, dir, ctx) { apply(ctx, step, false); },
  notes: "AI coding harness landscape. Step 0: what a harness is. A harness is the agent-loop scaffolding around an LLM that lets it read, write, run and test code in a real project: tool access, a multi-step loop, context or memory management and an autonomy model. It differs from a chat interface (only talks about code) and from autocomplete (suggests the next few tokens). The diagram shows the LLM in the centre, the agent loop around it (read, write, run, test) and, on the outer ring, the capabilities an AI factory builder needs from a harness: session management, durable runtime, execution sandbox, short and long term memory, observability, governance and safety (this list is the author's). Step 1: the landscape, closed on the left and open on the right, nine harnesses (five closed, four open), all cards shown in full with a headline strength and two more. Evidence behind the strengths (from the harness landscape report, 9 Nov 2026; vendor-reported unless marked): Claude Code: OS-level sandbox (Seatbelt, bubblewrap) open-sourced as sandbox-runtime, off by default; plan mode and auto-approve; full MCP. Cursor: cloud agents in isolated VMs subscribing to GitHub, Slack and Linear events, with automatic CI fixes on Teams plans; in-house agentic models (Composer); MCP marketplace. Google Antigravity: a standalone VS Code fork built on technology licensed from Windsurf, in public preview since November 2025 with Gemini 3; an Agent Manager runs several agents in parallel across tasks, a built-in Chromium browser lets agents work with live user interfaces, reusable skills live in the repository, and it connects to Google Cloud and Firebase through MCP; Thoughtworks Radar (April 2026) places it in Assess and says its security posture and enterprise readiness are still evolving; its own licence and sandbox model are not documented in the sources checked, and there is no general availability date. Copilot coding agent (card text is the author's: full end-to-end AI factory; fusion model; accessible anywhere; the evidence below is from the report): asynchronous draft PRs in an ephemeral, firewalled GitHub Actions environment, pushes only to copilot/* branches and cannot approve or merge its own PRs; can run Claude or Codex as backends. Codex: three sandbox modes (read-only, workspace-write, danger-full-access) separate from the approval policy; the CLI repository is Apache-2.0 while the models and cloud service are proprietary; reported to work independently for over 7 hours. OpenHands: MIT, Docker-based sandbox as a first-class design, MCP across UI, SDK and Cloud, hosted tiers. Goose: Apache-2.0, donated by Block to the Linux Foundation Agentic AI Foundation (with MCP and AGENTS.md). Card positioning (author's text): GDK is the set of reusable agent-runtime components used to build goose; it provides model integrations, a composable state machine, tools, context management and the interfaces needed to run an agent inside your application. From the report: extensions are MCP servers and goose can self-enable one. DeepSeek Harness: MIT, plugin framework Cordis, developer preview with a breaking-changes warning; sub-agents and the auto-approval reviewer are experimental; no published benchmark yet. pi harness: MIT, four tools (read, write, edit, bash) and a very small system prompt, everything else opt-in; no sandbox of its own; Thoughtworks Radar Vol. 35 describes its adoption as mostly embedded infrastructure; its MCP support is described differently by two sources. Caveats: no numbers on the slide on purpose (benchmarks are not comparable across vendors, prices and valuations move fast); the report excluded Devin, Windsurf, Amazon Q Developer, Replit Agent, Aider, Cline, Plandex, Gemini CLI and OpenCode from this slide only for space. Takeaway for the talk: choose on documented sandboxing, MCP support and governance, not on a benchmark score.",
});
})();
