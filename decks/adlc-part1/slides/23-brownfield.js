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
  const CELLS = [
    ["Profile", "Read-only look at build, tests, conventions and risks."],
    ["Full scan", "Reads code and history into cited knowledge pages."],
    ["Baseline", "Records what passes, fails or is flaky today."],
    ["Territory", "The paths agents may change; the rest is read-only."],
  ];

  // ---- hub and spokes (SVG, 1680 x 744) ----
  const CX = 840, CY = 372, rad = (d) => d * Math.PI / 180;
  const f = (n) => Math.round(n * 10) / 10;
  let links = "", tiles = "", wl = "", pills = "", kg = "";
  const NT = 24;
  const rays = WORKFLOWS.map((_, i) => { const a = rad(-90 + i * 60); return Math.atan2(330 * Math.sin(a), 790 * Math.cos(a)); });
  // a small code window: title bar and four lines of colour-coded code
  const CODE_COL = ["var(--deck-accent)", "var(--deck-delegated)", "var(--deck-wait)", "var(--deck-info)", "var(--deck-text-2)"];
  const codeTile = (x, y, n, d) => {
    const W = 88, H = 62, x0 = x - W / 2, y0 = y - H / 2;
    let g = `<g class="rev" style="--d:${d}ms"><rect class="tile" x="${f(x0)}" y="${f(y0)}" width="${W}" height="${H}" rx="8"/><path class="tile-bar" d="M${f(x0)} ${f(y0 + 14)} H${f(x0 + W)}"/>`;
    [0, 1, 2].forEach((k) => { g += `<circle class="tile-d" cx="${f(x0 + 10 + k * 9)}" cy="${f(y0 + 7)}" r="2.4"/>`; });
    for (let r = 0; r < 4; r++) {
      const ind = [0, 1, 1, 0][(r + n) % 4] * 9, ly = y0 + 24 + r * 9;
      let cx = x0 + 9 + ind;
      for (let sgm = 0; sgm < 2; sgm++) {
        const w = 8 + ((n * 7 + r * 11 + sgm * 5) % 5) * 5, col = CODE_COL[(n + r * 2 + sgm * 3) % 5];
        g += `<path d="M${f(cx)} ${f(ly)} h${w}" stroke="${col}" stroke-width="3.6" stroke-linecap="round" opacity=".9"/>`;
        cx += w + 6;
      }
    }
    return g + "</g>";
  };
  const PTS = [];
  for (let i = 0; i < NT; i++) {
    const a = rad(-90 + 7.5 + i * (360 / NT)), x = CX + 600 * Math.cos(a), y = CY + 285 * Math.sin(a);
    if (Math.abs(y - CY) > 70) continue; // only the free middle bands left and right; the corners belong to the workflow pills
    PTS.push([x, y]);
  }
  [[440, 108], [540, 52], [645, 112], [1240, 108], [1140, 52], [1035, 112], [440, 636], [540, 692], [645, 632], [1240, 636], [1140, 692], [1035, 632]].forEach((q) => PTS.push(q));
  PTS.forEach(([x, y], i) => {
    const d = 900 + i * 45;
    links += `<path class="sp rev" style="--d:${d}ms" d="M${f(x)} ${f(y)} L${CX} ${CY}"/>`;
    tiles += codeTile(x, y, i, d);
  });
  WORKFLOWS.forEach((t, i) => {
    const a = rad(-90 + i * 60), x = CX + 790 * Math.cos(a), y = CY + 330 * Math.sin(a), w = Math.max(240, t.length * 15 + 112), d = 3000 + i * 250;
    const x0 = x - w / 2 + 22; // generic workflow icon: start, step, end, with a token that runs through it in a loop
    wl += `<path class="wl rev" style="--d:${d}ms" d="M${CX} ${CY} L${f(x)} ${f(y)}"/>`;
    pills += `<g class="rev" style="--d:${d}ms"><rect class="pill" x="${f(x - w / 2)}" y="${f(y - 27)}" width="${w}" height="54" rx="27"/>
      <g transform="translate(${f(x0)} ${f(y)})" style="--wd:${(i * 0.45).toFixed(2)}s"><path class="wfi-l" d="M0 0 H34"/><circle class="wfi-n" cx="0" cy="0" r="5"/><rect class="wfi-n wfi-n2" x="12" y="-6" width="12" height="12" rx="3"/><circle class="wfi-n" cx="34" cy="0" r="5"/><circle class="wfi-d" cx="0" cy="0" r="4"/></g>
      <text class="pill-t" x="${f(x + 24)}" y="${f(y)}">${t}</text></g>`;
  });
  // one conceptual graph inside the hub (faint two-tone: teal = wiki side, purple = graph side) and four descriptions
  const GN = [[470, 305, "w", 7], [555, 290, "w", 12], [625, 335, "j", 7], [510, 375, "w", 8], [590, 400, "j", 13], [450, 430, "j", 8], [540, 470, "j", 7], [620, 490, "w", 9], [470, 515, "w", 7], [580, 535, "j", 7]];
  const GE = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6], [5, 8], [6, 7], [4, 7], [6, 8], [7, 9], [6, 9], [3, 6]];
  GE.forEach(([a, b], i) => { kg += `<path class="fe fe-${GN[a][2]} rev" style="--d:${2000 + i * 50}ms" d="M${GN[a][0]} ${GN[a][1]} L${GN[b][0]} ${GN[b][1]}"/>`; });
  GN.forEach(([x, y, t, r], i) => { kg += `<circle class="kg-n kg-${t} rev" style="--d:${2000 + i * 80}ms" cx="${x}" cy="${y}" r="${r * 1.35}"/>`; });
  GN.forEach(([x, y, t, r], i) => { if (r >= 12) kg += `<circle class="kg-rip kg-rip-${t} rev" style="--d:${2600 + i * 80}ms;--rd:${i * 0.5}s" cx="${x}" cy="${y}" r="${r * 1.35}"/>`; });
  [[1, 4], [0, 3], [4, 7], [3, 6], [5, 8], [2, 4]].forEach(([a, b], i) => {
    kg += `<circle class="kg-sig" r="4.5" fill="var(--deck-text)"><animateMotion dur="${(2.6 + (i % 3) * 0.5).toFixed(1)}s" begin="${(3.2 + i * 0.55).toFixed(2)}s" repeatCount="indefinite" path="M${GN[a][0]} ${GN[a][1]} L${GN[b][0]} ${GN[b][1]}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="${(2.6 + (i % 3) * 0.5).toFixed(1)}s" begin="${(3.2 + i * 0.55).toFixed(2)}s" repeatCount="indefinite"/></circle>`;
  });
  const wrap = (t, n) => { const o = []; let l = ""; t.split(" ").forEach((w) => { if ((l + " " + w).trim().length > n) { o.push(l); l = w; } else l = (l + " " + w).trim(); }); o.push(l); return o; };
  const cells = CELLS.map(([h, t], i) => { const x = 680 + (i % 2) * 298, y = 258 + Math.floor(i / 2) * 152, d = 2500 + i * 350;
    return `<g class="rev" style="--d:${d}ms"><rect class="cell" x="${x}" y="${y}" width="282" height="136" rx="16"/><text class="cell-h" x="${x + 18}" y="${y + 34}">${h}</text><text class="cell-t" x="${x + 18}" y="${y + 66}">${wrap(t, 24).map((l, j) => `<tspan x="${x + 18}" dy="${j ? 26 : 0}">${l}</tspan>`).join("")}</text></g>`; }).join("");
  const svg = `<svg class="p1bf-svg" viewBox="0 0 1680 744" role="img" aria-label="Many codebases feed a knowledge graph that serves as the context service for the existing workflows">
    ${links}${wl}
    <g class="rev" style="--d:1600ms"><rect class="hub" x="400" y="162" width="880" height="420" rx="42"/>
      <text class="hub-t" x="840" y="222">Context services</text></g>${kg}
      ${cells}
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
    notes: "Picture a large legacy SaaS: a huge collection of cloud-native microservices. It is a typical brownfield case. Introduce ADLC pipelines incrementally: explore and discover how the team works today, and build a strong context layer over the existing codebases and operations. The opening picture: many codebases in a ring, each read into the context services in the middle: a graph of knowledge (the two techniques are demoed on the next slide), described by four steps: Profile, a read-only look at build, tests, conventions and risks; Full scan, which reads the code and its history into cited knowledge pages; Baseline, which records what passes, fails or is flaky today; and Territory, the paths agents may change, everything else read-only. The team's existing workflows around the outside (issues, branches and commits, pull requests, CI, code review, merge queue, each with a small looping workflow icon) draw on that context and stay in charge. Nothing changes until a person admits a feature: read first. Then earn trust along an autonomy track in four stages, each with exit evidence the team can read. 1 Observe: reads the code base and answers questions, changes no file; the team reads what it learned and corrects it. 2 Rehearse (recommended): replays a change the team already solved in a scratch copy and opens no pull request; compare its findings with the team's own reviews and later fixes. 3 Contribute: real features inside the territory as ordinary pull requests, never merging on its own or touching paths outside the territory; watch review outcomes, CI results and post-merge defects. 4 Own: for a well-bounded area only, with a recorded team decision, still under the code host's rules. Any stage can be the last one, and going back is always allowed; many teams will stay at Contribute. Missing or flaky tests: record a baseline, pin today's behaviour with tests before changing it, state what must not change; new failures belong to the feature, old ones are shown as old. Knowledge only in people's heads: pages say what they rest on and open questions go to the people who know. Hidden dependencies and drift: the territory limits where agents write (to start with one service), shared files stay outside it and drift is shown before it becomes a conflict. The team's existing process: ordinary pull requests, the team's review, CI and merge queue; the factory adds gates and bypasses none. Greenfield follows on the next slide. Source material: the author's brownfield concept paper (final, 2026-10-21); the slide stays tool neutral and does not name it.",
  });
})();
