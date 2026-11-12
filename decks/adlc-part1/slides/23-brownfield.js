// Slide 23 — ADLC in a brownfield project. Content from the Notion page "23 – ADLC in a brownfield project" (author decisions 2026-11-12:
// tool neutral, Rehearse shown as a recommended step, no attribution to a specific implementation).
// States: 0 learn before you touch · 1-4 the four stages of trust appear one by one · 5 challenges and how the pipeline answers them.
(function () {
  const PRE = [
    ["Profile", "Shape, build and test commands, conventions, history and risk areas. Read-only, in minutes."],
    ["Full scan", "The whole code base and its history, written into cited knowledge pages and labelled measured or inferred."],
    ["Baseline", "What already fails or is flaky, recorded before the first change."],
    ["Territory", "The paths the agents may change. Everything else is read-only."],
  ];
  const STAGES = [
    ["Observe", "", "Reads the code and answers questions. Changes no file.", "The team reads what it learned and corrects it."],
    ["Rehearse", "Recommended", "Replays a change the team already solved, in a scratch copy. Opens no pull requests.", "Its findings compared with the team's own reviews and later fixes."],
    ["Contribute", "", "Runs real features in its territory as ordinary pull requests. Merges nothing on its own.", "Review outcomes, CI results and post-merge defects, counted."],
    ["Own", "", "For a well-bounded area, may get the team's merge path, still under the code host's rules.", "A recorded team decision."],
  ];
  const RISKS = [
    ["Missing or flaky tests", "Record a baseline. Pin today's behaviour with tests before changing it, and state what must not change."],
    ["Knowledge only in people's heads", "Knowledge pages say what they rest on: code, history or a person. Open questions go to the people who know."],
    ["Hidden dependencies and drift", "A territory limits where agents write. Shared files such as lock files and CI configuration stay outside it. Drift is shown before it becomes a conflict."],
    ["The team's existing process", "Ordinary pull requests, the team's review, CI and merge queue. The factory adds gates and bypasses none."],
  ];
  const pre = PRE.map(([h, t], i) => `<div class="p1bf-pre"><b>${h}</b><span>${t}</span></div>`).join("");
  const st = STAGES.map(([n, tag, does, ex], i) => `<div class="p1bf-st" data-n="${i + 1}" style="--i:${i};--h:${300 + i * 56}px">
      <div class="p1bf-sn"><i>Stage ${i + 1}</i>${tag ? `<em>${tag}</em>` : ""}</div><h3>${n}</h3>
      <p class="p1bf-do">${does}</p><p class="p1bf-ex"><i>Exit evidence</i>${ex}</p></div>`).join("");
  const rk = RISKS.map(([c, a], i) => `<div class="p1bf-rk" style="--i:${i}"><h3>${c}</h3><p>${a}</p></div>`).join("");
  const html = `<div class="p1bf-root" data-s="0">
    <div class="p1bf-main">
      <p class="p1bf-lead">Join as a careful newcomer: <b>read first, change nothing until a person admits a feature.</b></p>
      <div class="p1bf-pres"><div class="p1bf-prelab">Learn before you touch</div>${pre}</div>
      <div class="p1bf-stairs">${st}</div>
      <p class="p1bf-note">Any stage can be the last one. Going back is always allowed.</p>
    </div>
    <div class="p1bf-risks"><p class="p1bf-lead">Where it gets hard, and what answers it</p><div class="p1bf-rgrid">${rk}</div></div>
  </div>`;
  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1bf-root"); if (!r) return;
    if (snap) r.classList.add("p1bf-snap");
    r.dataset.s = step;
    r.querySelectorAll(".p1bf-st").forEach((c) => c.classList.toggle("is-on", +c.dataset.n <= step));
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
    notes: "Most software is not new, so most teams start the ADLC on an existing code base. The way in is to join as a careful newcomer: read first, change nothing until a person admits a feature, and work inside the team's own process. Learn before you touch: a read-only profile of the code base (shape, build and test commands, conventions, history, risk areas), a full scan of the code and its history written into cited knowledge pages labelled measured or inferred, a baseline of what already fails or is flaky, and a territory, the paths the agents may change. Then earn trust in four stages, each with exit evidence the team can read. 1 Observe: reads and answers questions, changes no file; the team reads what it learned and corrects it. 2 Rehearse (recommended): replays a change the team already solved in a scratch copy and opens no pull requests; compare its findings with the team's own reviews and later fixes. 3 Contribute: real features inside the territory as ordinary pull requests, never merging on its own; watch review outcomes, CI results and post-merge defects. 4 Own: for a well-bounded area only, with a recorded team decision, and still under the code host's rules. Any stage can be the last one, and going back is always allowed; many teams will stay at Contribute. Last step: where it gets hard and what answers it. Missing or flaky tests: record a baseline, pin today's behaviour with tests before changing it, and state what must not change; new failures belong to the feature, old ones are shown as old. Knowledge only in people's heads: pages say what they rest on and open questions go to the people who know. Hidden dependencies and drift: the territory limits where agents write, shared files stay outside it and drift is shown before it becomes a conflict. The team's existing process: ordinary pull requests, the team's review, CI and merge queue; the factory adds gates and bypasses none. Greenfield follows on the next slide. Source material: the author's brownfield concept paper (final, 2026-10-21); the slide stays tool neutral and does not name it.",
  });
})();
