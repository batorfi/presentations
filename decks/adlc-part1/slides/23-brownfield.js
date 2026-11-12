// Slide 23 — ADLC in a brownfield project. Content from the Notion page "23 – ADLC in a brownfield project".
// Author decisions 2026-11-12: tool neutral; no attribution to a specific implementation;
// scenario to picture: a large legacy SaaS built as a huge collection of cloud-native microservices.
// States: 0 hub and spokes (many codebases, context services = LLM Wiki + Codebases Graphified, existing workflows with looping workflow icons) ·
// 1 learn before you touch (Profile, Full scan, Baseline, Territory with descriptions).
(function () {
  const LEARN = [
    ["Profile", "A quick, read-only look at the code base: its shape, build and test commands, conventions, history and risk areas. It takes minutes."],
    ["Full scan", "The whole code base and its history, read module by module and written into the LLM Wiki and Codebases Graphified. Every claim cited and labelled measured or inferred."],
    ["Baseline", "What the build and tests do today: what passes, what fails, what is flaky. Recorded before the first change, so old failures are never blamed on new work."],
    ["Territory", "The services and paths the agents may change, to start with one. Everything else stays read-only context."],
  ];
  const WORKFLOWS = ["Issues", "Branches and commits", "Pull requests", "CI", "Code review", "Merge queue"];
  const CHIPS = ["Profile", "Full scan", "Baseline", "Territory"];

  // ---- hub and spokes (SVG, 1680 x 744) ----
  const CX = 840, CY = 372, rad = (d) => d * Math.PI / 180;
  const f = (n) => Math.round(n * 10) / 10;
  let links = "", tiles = "", wl = "", pills = "", kg = "";
  const NT = 24;
  const rays = WORKFLOWS.map((_, i) => { const a = rad(-90 + i * 60); return Math.atan2(330 * Math.sin(a), 790 * Math.cos(a)); });
  for (let i = 0; i < NT; i++) {
    const a = rad(-90 + 7.5 + i * (360 / NT)), x = CX + 475 * Math.cos(a), y = CY + 268 * Math.sin(a), d = 900 + i * 45;
    const ta = Math.atan2(y - CY, x - CX);
    if (rays.some((r) => Math.abs(Math.atan2(Math.sin(ta - r), Math.cos(ta - r))) < rad(7.5))) continue;
    links += `<path class="sp rev" style="--d:${d}ms" d="M${f(x)} ${f(y)} L${CX} ${CY}"/>`;
    tiles += `<g class="rev" style="--d:${d}ms"><rect class="tile" x="${f(x - 28)}" y="${f(y - 19)}" width="56" height="38" rx="8"/><circle class="tile-d" cx="${f(x - 14)}" cy="${f(y)}" r="3.5"/><path d="M${f(x - 2)} ${f(y)} h14" stroke="var(--deck-info)" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`;
  }
  WORKFLOWS.forEach((t, i) => {
    const a = rad(-90 + i * 60), x = CX + 790 * Math.cos(a), y = CY + 330 * Math.sin(a), w = Math.max(240, t.length * 15 + 112), d = 3000 + i * 250;
    const x0 = x - w / 2 + 22; // generic workflow icon: start, step, end, with a token that runs through it in a loop
    wl += `<path class="wl rev" style="--d:${d}ms" d="M${CX} ${CY} L${f(x)} ${f(y)}"/>`;
    pills += `<g class="rev" style="--d:${d}ms"><rect class="pill" x="${f(x - w / 2)}" y="${f(y - 27)}" width="${w}" height="54" rx="27"/>
      <g transform="translate(${f(x0)} ${f(y)})" style="--wd:${(i * 0.45).toFixed(2)}s"><path class="wfi-l" d="M0 0 H34"/><circle class="wfi-n" cx="0" cy="0" r="5"/><rect class="wfi-n wfi-n2" x="12" y="-6" width="12" height="12" rx="3"/><circle class="wfi-n" cx="34" cy="0" r="5"/><circle class="wfi-d" cx="0" cy="0" r="4"/></g>
      <text class="pill-t" x="${f(x + 24)}" y="${f(y)}">${t}</text></g>`;
  });
  // two graphs inside the hub: LLM Wiki (markdown files) and Codebases Graphified (JSON files holding semantic graphs)
  const doc = (x, y, inner) => `<g transform="translate(${x - 22} ${y - 27}) scale(.85)"><path class="fn-d" d="M6 0 H34 L52 18 V56 Q52 64 44 64 H6 Q0 64 0 58 V6 Q0 0 6 0 Z"/><path class="fn-c" d="M34 0 V14 Q34 18 38 18 H52"/>${inner}</g>`;
  const MD = [[578, 392], [664, 372], [752, 400], [616, 448], [712, 452]];
  const MDE = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]];
  const JS = [[918, 382], [1008, 368], [1098, 388], [934, 448], [1022, 452], [1110, 446]];
  const JSE = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
  const glyph = `<circle class="fn-gd" cx="14" cy="46" r="4"/><circle class="fn-gd" cx="38" cy="40" r="4"/><circle class="fn-gd" cx="26" cy="26" r="4"/><path class="fn-gl" d="M14 46 L26 26 L38 40 M14 46 L38 40"/>`;
  kg += `<rect class="gp gp-w rev" style="--d:1900ms" x="512" y="290" width="316" height="190" rx="22"/><text class="gp-h rev" style="--d:1900ms" x="670" y="322">LLM Wiki</text>
    <rect class="gp gp-j rev" style="--d:1900ms" x="852" y="290" width="326" height="190" rx="22"/><text class="gp-h rev" style="--d:1900ms" x="1015" y="322">Codebases Graphified</text>`;
  MDE.forEach(([a, b], i) => { kg += `<path class="fe fe-w rev" style="--d:${2100 + i * 60}ms" d="M${MD[a][0]} ${MD[a][1]} L${MD[b][0]} ${MD[b][1]}"/>`; });
  JSE.forEach(([a, b], i) => { kg += `<path class="fe fe-j rev" style="--d:${2300 + i * 60}ms" d="M${JS[a][0]} ${JS[a][1]} L${JS[b][0]} ${JS[b][1]}"/>`; });
  MD.forEach(([x, y], i) => { kg += `<g class="fn fn-md rev" style="--d:${2100 + i * 90}ms">${doc(x, y, '<text class="fn-t" x="26" y="42">.md</text>')}</g>`; });
  JS.forEach(([x, y], i) => { kg += `<g class="fn fn-json rev" style="--d:${2300 + i * 90}ms">${doc(x, y, glyph)}</g>`; });
  const chips = CHIPS.map((t, i) => { const x = 520 + i * 162, y = 486;
    return `<g><rect class="chip" x="${x}" y="${y}" width="150" height="40" rx="20"/><text class="chip-t" x="${x + 75}" y="${y + 20}">${t}</text></g>`; }).join("");
  const svg = `<svg class="p1bf-svg" viewBox="0 0 1680 744" role="img" aria-label="Many codebases feed knowledge graphs that serve as context services for the existing workflows">
    ${links}${wl}
    <g class="rev" style="--d:1600ms"><rect class="hub" x="490" y="200" width="700" height="344" rx="42"/>
      <text class="hub-t" x="840" y="258">Context services</text>${kg}
      ${chips}</g>
    ${tiles}${pills}
    <g class="rev" style="--d:3800ms"><circle cx="8" cy="26" r="8" fill="var(--deck-info)"/><text class="lg-t lg-c" x="26" y="33">Many codebases</text>
      <circle cx="8" cy="62" r="8" fill="var(--deck-accent)"/><text class="lg-t lg-h" x="26" y="69">Context services</text>
      <circle cx="8" cy="98" r="8" fill="var(--deck-wait)"/><text class="lg-t lg-w" x="26" y="105">Existing workflows</text></g>
  </svg>`;

  const lc = LEARN.map(([h, t], i) => `<div class="p1bf-lc" style="--i:${i}"><h3>${h}</h3><p>${t}</p></div>`).join("");

  const html = `<div class="p1bf-root" data-s="0">
    <p class="p1bf-lead is-a"><b>Introduce ADLC pipelines incrementally:</b> explore and discover how the team works today, and build a strong context layer over the existing codebases and operations.</p>
    <p class="p1bf-lead is-d"><b>Learn before you touch.</b> Build the context layer first; nothing changes until a person admits a feature.</p>
    <div class="p1bf-v0">${svg}</div>
    <div class="p1bf-v2"><div class="p1bf-learn">${lc}</div></div>
  </div>`;

  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1bf-root"); if (!r) return;
    const prev = +r.dataset.s;
    if (snap) r.classList.add("p1bf-snap");
    r.dataset.s = step;
    if (step === 0 && (snap || prev !== 0)) { r.classList.remove("p1bf-play"); void r.offsetWidth; r.classList.add("p1bf-play"); }
    if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1bf-snap")); }
  };
  Deck.slide({
    id: "brownfield",
    section: "building",
    title: "ADLC in a brownfield project",
    navTitle: "Brownfield",
    className: "p1bf-s",
    steps: 1,
    html,
    onEnter(ctx) { apply(ctx, ctx.step, true); },
    onStep(step, dir, ctx) { apply(ctx, step, false); },
    notes: "Picture a large legacy SaaS: a huge collection of cloud-native microservices. It is a typical brownfield case. Introduce ADLC pipelines incrementally: explore and discover how the team works today, and build a strong context layer over the existing codebases and operations. The opening picture: many codebases in a ring, each read into the context services in the middle: the LLM Wiki, a graph of markdown files, and Codebases Graphified, a collection of JSON files that represent semantic graphs of the codebases. The team's existing workflows around the outside (issues, branches and commits, pull requests, CI, code review, merge queue, each with a small looping workflow icon) draw on that context and stay in charge. Next click, learn before you touch: a profile (a quick read-only look at the shape, build and test commands, conventions, history and risk areas), a full scan (the whole code base and its history written into the wiki and the graphs, every claim cited and labelled measured or inferred), a baseline (what passes, fails or is flaky today, recorded before the first change) and a territory (the services and paths the agents may change, to start with one). Nothing changes until a person admits a feature: read first.",
  });
})();
