// Slide 23 — ADLC in a brownfield project. Content from the Notion page "23 – ADLC in a brownfield project".
// Author decisions 2026-11-12: tool neutral; Rehearse shown as a recommended step; no attribution to a specific implementation;
// scenario to picture: a large legacy SaaS built as a huge collection of cloud-native microservices.
// States: 0 hub and spokes (many codebases, context services = LLM Wiki + Codebases Graphified, existing workflows with looping workflow icons) ·
// 1-4 autonomy track (Observe, Rehearse, Contribute, Own).
(function () {
  const STAGES = [
    ["Observe", "", "Reads the code base and answers questions.", "Changes a file.", "The team reads what it learned and corrects it."],
    ["Rehearse", "Recommended", "Replays a change the team already solved, in a scratch copy.", "Opens a pull request.", "Its findings compared with the team's own reviews and later fixes."],
    ["Contribute", "", "Runs real features in its territory as ordinary pull requests.", "Merges on its own, or touches paths outside its territory.", "Review outcomes, CI results and post-merge defects, counted."],
    ["Own", "", "For a well-bounded area, may get the team's merge path, still under the code host's rules.", "Changes its own territory or the team's rules.", "A recorded team decision."],
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

  // ---- autonomy track ----
  const nodes = STAGES.map((s, i) => `<span class="p1bf-node" data-n="${i + 1}" style="--c:color-mix(in srgb, var(--deck-info) ${100 - i * 30}%, var(--deck-ok));left:${210 + i * 420}px">${i + 1}</span>`).join("");
  const cols = STAGES.map(([n, tag, does, never, ex], i) => `<div class="p1bf-col"><div class="p1bf-st" data-n="${i + 1}" style="--i:${i}">
      <div class="p1bf-sn"><i>Stage ${i + 1}</i>${tag ? `<em>${tag}</em>` : ""}</div><h3>${n}</h3>
      <div class="p1bf-b"><i>Does</i>${does}</div><div class="p1bf-b"><i>Never</i>${never}</div><div class="p1bf-b is-x"><i>Exit evidence</i>${ex}</div></div></div>`).join("");

  const html = `<div class="p1bf-root" data-s="0" style="--k:1">
    <p class="p1bf-lead is-a"><b>Introduce ADLC pipelines incrementally:</b> explore and discover how the team works today, and build a strong context layer over the existing codebases and operations.</p>
    <p class="p1bf-lead is-b"><b>Earn trust in four stages.</b> Each one has evidence the team can read.</p>
    <div class="p1bf-v0">${svg}</div>
    <div class="p1bf-v1"><div class="p1bf-ends"><span>Less autonomy</span><span>More autonomy</span></div>
      <div class="p1bf-rail"><div class="p1bf-fill"></div></div>${nodes}<span class="p1bf-mark"></span>
      <div class="p1bf-cols">${cols}</div><p class="p1bf-note">Any stage can be the last one. Going back is always allowed.</p></div>
  </div>`;

  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1bf-root"); if (!r) return;
    const prev = +r.dataset.s;
    if (snap) r.classList.add("p1bf-snap");
    r.dataset.s = step;
    const k = Math.min(Math.max(step, 1), 4);
    r.style.setProperty("--k", k);
    r.querySelectorAll(".p1bf-st").forEach((c) => { const n = +c.dataset.n; c.classList.toggle("is-on", step >= 1 && n <= Math.min(step, 4)); c.classList.toggle("is-cur", n === step); });
    r.querySelectorAll(".p1bf-node").forEach((c) => c.classList.toggle("is-on", step >= 1 && +c.dataset.n <= Math.min(step, 4)));
    if (step === 0 && (snap || prev !== 0)) { r.classList.remove("p1bf-play"); void r.offsetWidth; r.classList.add("p1bf-play"); }
    if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1bf-snap")); }
  };
  Deck.slide({
    id: "brownfield",
    section: "building",
    title: "ADLC in a brownfield project",
    navTitle: "Brownfield",
    className: "p1bf-s",
    steps: 4,
    html,
    onEnter(ctx) { apply(ctx, ctx.step, true); },
    onStep(step, dir, ctx) { apply(ctx, step, false); },
    notes: "Picture a large legacy SaaS: a huge collection of cloud-native microservices. It is a typical brownfield case. Introduce ADLC pipelines incrementally: explore and discover how the team works today, and build a strong context layer over the existing codebases and operations. The opening picture: many codebases in a ring, each read into the context services in the middle: the LLM Wiki, a graph of markdown files, and Codebases Graphified, a collection of JSON files that represent semantic graphs of the codebases. The team's existing workflows around the outside (issues, branches and commits, pull requests, CI, code review, merge queue, each with a small looping workflow icon) draw on that context and stay in charge. Nothing changes until a person admits a feature: read first. Then earn trust along an autonomy track in four stages, each with exit evidence the team can read. 1 Observe: reads the code base and answers questions, changes no file; the team reads what it learned and corrects it. 2 Rehearse (recommended): replays a change the team already solved in a scratch copy and opens no pull request; compare its findings with the team's own reviews and later fixes. 3 Contribute: real features inside the territory as ordinary pull requests, never merging on its own or touching paths outside the territory; watch review outcomes, CI results and post-merge defects. 4 Own: for a well-bounded area only, with a recorded team decision, still under the code host's rules. Any stage can be the last one, and going back is always allowed; many teams will stay at Contribute. Missing or flaky tests: record a baseline, pin today's behaviour with tests before changing it, state what must not change; new failures belong to the feature, old ones are shown as old. Knowledge only in people's heads: pages say what they rest on and open questions go to the people who know. Hidden dependencies and drift: the territory limits where agents write (to start with one service), shared files stay outside it and drift is shown before it becomes a conflict. The team's existing process: ordinary pull requests, the team's review, CI and merge queue; the factory adds gates and bypasses none. Greenfield follows on the next slide. Source material: the author's brownfield concept paper (final, 2026-10-21); the slide stays tool neutral and does not name it.",
  });
})();
