// Slide 23 — ADLC in a brownfield project. Content from the Notion page "23 – ADLC in a brownfield project".
// Author decisions 2026-11-12: tool neutral; Rehearse shown as a recommended step; no attribution to a specific implementation;
// scenario to picture: a large legacy SaaS built as a huge collection of cloud-native microservices.
// States: 0 hub and spokes (many codebases, knowledge graphs as context services, existing workflows) · 1-4 autonomy track
// (Observe, Rehearse, Contribute, Own) · 5 challenges and what answers them.
(function () {
  const STAGES = [
    ["Observe", "", "Reads the code base and answers questions.", "Changes a file.", "The team reads what it learned and corrects it."],
    ["Rehearse", "Recommended", "Replays a change the team already solved, in a scratch copy.", "Opens a pull request.", "Its findings compared with the team's own reviews and later fixes."],
    ["Contribute", "", "Runs real features in its territory as ordinary pull requests.", "Merges on its own, or touches paths outside its territory.", "Review outcomes, CI results and post-merge defects, counted."],
    ["Own", "", "For a well-bounded area, may get the team's merge path, still under the code host's rules.", "Changes its own territory or the team's rules.", "A recorded team decision."],
  ];
  const RISKS = [
    ["Missing or flaky tests", "Record a baseline. Pin today's behaviour with tests before changing it, and state what must not change."],
    ["Knowledge only in people's heads", "Knowledge pages say what they rest on: code, history or a person. Open questions go to the people who know."],
    ["Hidden dependencies and drift", "A territory limits where agents write, to start with one service. Shared files such as lock files and CI configuration stay outside it. Drift is shown before it becomes a conflict."],
    ["The team's existing process", "Ordinary pull requests, the team's review, CI and merge queue. The factory adds gates and bypasses none."],
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
    const a = rad(-90 + i * 60), x = CX + 790 * Math.cos(a), y = CY + 330 * Math.sin(a), w = Math.max(190, t.length * 15 + 56), d = 3000 + i * 250;
    wl += `<path class="wl rev" style="--d:${d}ms" d="M${CX} ${CY} L${f(x)} ${f(y)}"/>`;
    pills += `<g class="rev" style="--d:${d}ms"><rect class="pill" x="${f(x - w / 2)}" y="${f(y - 24)}" width="${w}" height="48" rx="24"/><text class="pill-t" x="${f(x)}" y="${f(y)}">${t}</text></g>`;
  });
  // decorative knowledge graph inside the hub (deterministic)
  const KN = [[590, 262], [680, 258], [790, 262], [890, 258], [1000, 262], [1090, 258], [1112, 340], [1114, 420], [1092, 496], [1000, 502], [890, 498], [790, 502], [680, 498], [588, 496], [566, 420], [568, 340]];
  const KE = KN.map((_, i) => [i, (i + 1) % KN.length]).concat([[1, 3], [4, 6], [8, 10], [11, 13], [14, 0], [2, 5], [9, 12]]);
  const PX = (x) => Math.round(840 + (x - 840) * 640 / 580);
  KE.forEach(([a, b]) => { kg += `<path class="kg-l" d="M${PX(KN[a][0])} ${KN[a][1]} L${PX(KN[b][0])} ${KN[b][1]}"/>`; });
  KN.forEach(([x0, y], i) => { const x = Math.round(840 + (x0 - 840) * 640 / 580); kg += `<circle class="kg-n" style="--d:${1700 + i * 60}ms" cx="${x}" cy="${y}" r="6"/>`; });
  const chips = CHIPS.map((t, i) => { const x = 540 + (i % 2) * 300, y = 374 + Math.floor(i / 2) * 56;
    return `<g><rect class="chip" x="${x}" y="${y}" width="280" height="44" rx="22"/><text class="chip-t" x="${x + 140}" y="${y + 22}">${t}</text></g>`; }).join("");
  const svg = `<svg class="p1bf-svg" viewBox="0 0 1680 744" role="img" aria-label="Many codebases feed knowledge graphs that serve as context services for the existing workflows">
    ${links}${wl}
    <g class="rev" style="--d:1600ms"><rect class="hub" x="520" y="236" width="640" height="272" rx="40"/>${kg}
      <text class="hub-t" x="840" y="302">Context services</text>
      <text class="hub-s" x="840" y="338">Knowledge graphs over the codebases and operations</text>${chips}</g>
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
  const rk = RISKS.map(([c, a]) => `<div class="p1bf-rk"><h3>${c}</h3><p>${a}</p></div>`).join("");

  const html = `<div class="p1bf-root" data-s="0" style="--k:1">
    <p class="p1bf-lead is-a"><b>Introduce ADLC pipelines incrementally:</b> explore and discover how the team works today, and build a strong context layer over the existing codebases and operations.</p>
    <p class="p1bf-lead is-b"><b>Earn trust in four stages.</b> Each one has evidence the team can read.</p>
    <div class="p1bf-v0">${svg}</div>
    <div class="p1bf-v1"><div class="p1bf-ends"><span>Less autonomy</span><span>More autonomy</span></div>
      <div class="p1bf-rail"><div class="p1bf-fill"></div></div>${nodes}<span class="p1bf-mark"></span>
      <div class="p1bf-cols">${cols}</div><p class="p1bf-note">Any stage can be the last one. Going back is always allowed.</p></div>
    <div class="p1bf-risks"><p class="p1bf-lead is-c">Where it gets hard, and what answers it</p><div class="p1bf-rgrid">${rk}</div></div>
  </div>`;

  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1bf-root"); if (!r) return;
    const prev = +r.dataset.s;
    if (snap) r.classList.add("p1bf-snap");
    r.dataset.s = step;
    r.style.setProperty("--k", Math.min(Math.max(step, 1), 4));
    r.querySelectorAll(".p1bf-st").forEach((c) => { const n = +c.dataset.n; c.classList.toggle("is-on", n <= Math.min(step, 4) || (step === 5 && n <= 4)); c.classList.toggle("is-cur", n === step); });
    r.querySelectorAll(".p1bf-node").forEach((c) => c.classList.toggle("is-on", +c.dataset.n <= Math.min(step, 4)));
    if (step === 0 && (snap || prev !== 0)) { r.classList.remove("p1bf-play"); void r.offsetWidth; r.classList.add("p1bf-play"); }
    if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1bf-snap")); }
  };
  Deck.slide({
    id: "brownfield",
    section: "building",
    title: "ADLC in a brownfield project",
    navTitle: "Brownfield",
    className: "p1bf-s",
    steps: 5,
    html,
    onEnter(ctx) { apply(ctx, ctx.step, true); },
    onStep(step, dir, ctx) { apply(ctx, step, false); },
    notes: "Picture a large legacy SaaS: a huge collection of cloud-native microservices. It is a typical brownfield case. Introduce ADLC pipelines incrementally: explore and discover how the team works today, and build a strong context layer over the existing codebases and operations. The opening picture: many codebases in a ring, each read into knowledge graphs that serve as context services in the middle (a profile of the code base, a full scan of the code and its history, a baseline of what already fails or is flaky, and a territory the agents may change); the team's existing workflows around the outside (issues, branches and commits, pull requests, CI, code review, merge queue) draw on that context and stay in charge. Nothing changes until a person admits a feature: read first. Then earn trust along an autonomy track in four stages, each with exit evidence the team can read. 1 Observe: reads the code base and answers questions, changes no file; the team reads what it learned and corrects it. 2 Rehearse (recommended): replays a change the team already solved in a scratch copy and opens no pull request; compare its findings with the team's own reviews and later fixes. 3 Contribute: real features inside the territory as ordinary pull requests, never merging on its own or touching paths outside the territory; watch review outcomes, CI results and post-merge defects. 4 Own: for a well-bounded area only, with a recorded team decision, still under the code host's rules. Any stage can be the last one, and going back is always allowed; many teams will stay at Contribute. Last step: where it gets hard and what answers it. Missing or flaky tests: record a baseline, pin today's behaviour with tests before changing it, state what must not change; new failures belong to the feature, old ones are shown as old. Knowledge only in people's heads: pages say what they rest on and open questions go to the people who know. Hidden dependencies and drift: the territory limits where agents write (to start with one service), shared files stay outside it and drift is shown before it becomes a conflict. The team's existing process: ordinary pull requests, the team's review, CI and merge queue; the factory adds gates and bypasses none. Greenfield follows on the next slide. Source material: the author's brownfield concept paper (final, 2026-10-21); the slide stays tool neutral and does not name it.",
  });
})();
