(() => {
// Slide 15 — what an agentic engineer works on: the levels spectrum (system leverage <-> direct control) with a spotlight that sweeps up and down in a loop.
// Levels and groups follow the author's "Most common levels" graphic (see Notion page 15, background material). Own layout; theme tokens only.
const GROUPS = [
  { name: "Agentic system", mix: 0, say: "Shapes the system that builds the software: factories, workflows and agents.",
    levels: ["Software factory", "AI developer workflow", "Agent", "Product"] },
  { name: "Delivery + intent", mix: 25, say: "States the intent and checks what is delivered: plans, documentation, repository, application.",
    levels: ["Documentation", "Plan", "Repository", "Application"] },
  { name: "Data + execution", mix: 50, say: "Looks at what actually runs: scripts, command-line tools and data.",
    levels: ["Script", "CLI", "Database", "Database table"] },
  { name: "Code structure", mix: 75, say: "Reads and reshapes structure when an agent needs a steer.",
    levels: ["Directory", "Module", "File"] },
  { name: "Code primitives", mix: 100, say: "Direct control: edits a line or a function by hand, only when it is needed.",
    levels: ["Class", "Type", "Function", "Block", "Line"] },
];
// flat list, top (index 0) to bottom
const FLAT = [];
GROUPS.forEach((g, gi) => g.levels.forEach((l) => FLAT.push({ name: l, g: gi })));
const N = FLAT.length; // 18

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
let k = 0;
const bands = GROUPS.map((g, gi) => {
  const rows = g.levels.map((l) => `<li class="p1l-lv" data-k="${k++}" data-g="${gi}"><span class="p1l-dot"></span><span class="p1l-name">${esc(l)}</span></li>`).join("");
  return `<section class="p1l-band" data-g="${gi}" style="--p1l-mix:${g.mix}%"><h3 class="p1l-gname">${esc(g.name)}</h3><ul class="p1l-lvs">${rows}</ul></section>`;
}).join("");
const html = `<div class="p1l-root" data-g="0" data-k="0">
  <div class="p1l-board">
    <div class="p1l-axis" aria-hidden="true"><b class="p1l-ax-top">System leverage</b><i class="p1l-ax-bar"><u class="p1l-ax-mark"></u></i><b class="p1l-ax-bot">Direct control</b></div>
    <div class="p1l-bands">${bands}</div>
  </div>
  <aside class="p1l-side">
    <div class="p1l-kicker">The engineer works at</div>
    <div class="p1l-cur">Software factory</div>
    <div class="p1l-grp">Agentic system</div>
    <p class="p1l-say">${esc(GROUPS[0].say)}</p>
    <div class="p1l-meters">
      <div class="p1l-m"><span>Leverage</span><i><u class="p1l-m-lev"></u></i></div>
      <div class="p1l-m"><span>Direct control</span><i><u class="p1l-m-ctl"></u></i></div>
    </div>
    <p class="p1l-foot">The focus moves along the whole spectrum. Higher up buys leverage and gives up control, which is why gates and independent judges matter.</p>
  </aside>
</div>`;

const setPos = (ctx, k) => {
  const r = ctx.$(".p1l-root"); if (!r) return;
  const f = FLAT[k], g = GROUPS[f.g];
  r.dataset.k = k; r.dataset.g = f.g;
  r.querySelectorAll(".p1l-lv").forEach((el) => { const d = Math.abs(+el.dataset.k - k); el.dataset.d = d > 2 ? "3" : String(d); });
  const q = (s) => r.querySelector(s);
  q(".p1l-cur").textContent = f.name;
  q(".p1l-grp").textContent = g.name;
  q(".p1l-say").textContent = g.say;
  const lev = 1 - k / (N - 1);
  q(".p1l-m-lev").style.width = (8 + lev * 92) + "%";
  q(".p1l-m-ctl").style.width = (8 + (1 - lev) * 92) + "%";
  const el = r.querySelector(`.p1l-lv[data-k="${k}"]`), bar = q(".p1l-ax-bar"), board = q(".p1l-board");
  if (el && bar && board) {
    const b = el.getBoundingClientRect(), a = bar.getBoundingClientRect(), s = a.height ? board.getBoundingClientRect().height / board.offsetHeight : 1;
    const y = ((b.top + b.height / 2) - a.top) / (s || 1); q(".p1l-ax-mark").style.transform = `translateY(${Math.max(0, Math.min(a.height / (s || 1), y))}px)`;
  }
};

Deck.slide({
  id: "swe-role",
  section: "engineer",
  title: "What an agentic engineer works on",
  navTitle: "The SWE's role",
  className: "p1l-s",
  html,
  onEnter(ctx) {
    setPos(ctx, 0);
    if (ctx.reduced()) return;
    let k = 0, dir = 1, hold = 2;
    const id = setInterval(() => {
      if (hold > 0) { hold--; return; }
      k += dir;
      if (k >= N - 1) { k = N - 1; dir = -1; hold = 2; }
      else if (k <= 0) { k = 0; dir = 1; hold = 2; }
      setPos(ctx, k);
    }, 950);
    ctx.cleanup(() => clearInterval(id));
  },
  notes: "What does an agentic engineer actually work on? The levels spectrum runs from system leverage at the top (software factory, AI developer workflow, agent, product) to direct control at the bottom (class, type, function, block, line), in five groups: agentic system, delivery and intent, data and execution, code structure, code primitives. A spotlight loops up and down the whole spectrum: the engineer can work at any level, and the higher the level, the more leverage and the less direct control. That trade is why the ADLC has human gates and independent judges. The one-line description per group is a draft to check. The levels follow the author's 'Most common levels' graphic; its original source is not stated yet, so add it before quoting (see Notion page 15, background material). No steps: the loop runs on its own.",
});
})();
