// Slide 5 — Dan Shapiro's levels of AI-assisted development (staircase). Source: Simon Willison, "The Five Levels: from Spicy Autocomplete
// to the Dark Factory" (2026-01-28). Content from the Notion page "05 – Dan Shapiro's levels of AI-assisted development". The six levels appear one by one by themselves on entering the slide, each with its own looping icon;
// the single step marks where the ADLC aims (level 4, author-confirmed 2026-11-12). No shares or percentages: the source gives none.
(function () {
  const LEVELS = [
    ["Spicy autocomplete", "Inline suggestions and snippets", "Writes and drives the code"],
    ["The coding intern", "Minor snippets and boilerplate", "Reviews all of it"],
    ["The junior developer", "Pair programs with the human", "Still reviews every line"],
    ["The developer", "Generates most of the code", "Full-time code reviewer"],
    ["The engineering team", "Agents do the building", "Works on specs and plans, like a manager"],
    ["The dark software factory", "A black box turns specs into software", "Neither needed nor welcome"],
  ];
  const ICONS = [
    `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 22H34"/><path class="i0-sug" d="M38 22H54"/><path d="M10 36H26"/><path class="i0-sug i0-b" d="M30 36H48"/><path class="i0-caret" d="M12 48V58"/></svg>`,
    `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="8" width="38" height="48" rx="5"/><path d="M16 20H38M16 30H32"/><g class="i1-snip"><rect x="30" y="38" width="22" height="12" rx="3"/></g><path class="i1-ck" d="M42 16l4 4 8-9"/></svg>`,
    `<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="i2-a" cx="18" cy="24" r="9"/><circle class="i2-b" cx="46" cy="24" r="9"/><path d="M6 54C6 44 28 44 30 54M34 54C36 44 58 44 58 54"/><path class="i2-link" d="M27 24H37"/></svg>`,
    `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="6" width="40" height="52" rx="5"/><path class="i3-l i3-l1" d="M16 18H40"/><path class="i3-l i3-l2" d="M16 28H36"/><path class="i3-l i3-l3" d="M16 38H40"/><path class="i3-l i3-l4" d="M16 48H32"/><g class="i3-scan"><circle cx="50" cy="20" r="7"/><path d="M55 25l6 6"/></g></svg>`,
    `<svg viewBox="0 0 64 64" aria-hidden="true"><path class="i4-link" d="M32 17V30M32 30H12V42M32 30H52V42M32 30V42"/><circle class="i4-n i4-n0" cx="32" cy="12" r="7"/><circle class="i4-n i4-n1" cx="12" cy="48" r="7"/><circle class="i4-n i4-n2" cx="32" cy="48" r="7"/><circle class="i4-n i4-n3" cx="52" cy="48" r="7"/></svg>`,
    `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="6" width="52" height="52" rx="8" class="i5-box"/><g class="i5-gear"><circle cx="32" cy="32" r="8"/><path d="M32 14V20M32 44V50M14 32H20M44 32H50M19 19l4 4M41 41l4 4M45 19l-4 4M23 41l-4 4"/></g></svg>`,
  ];
  const cols = LEVELS.map(([n, ai, hu], i) => `<div class="p1s-col${i === 4 ? " is-adlc" : ""}" style="--i:${i};--h:${470 + i * 58}px">
      ${i === 4 ? `<div class="p1s-pin"><b>ADLC aims here</b></div>` : ""}
      <div class="p1s-top"><div class="p1s-lv">Level ${i}</div><span class="p1s-ico">${ICONS[i]}</span></div><h3>${n}</h3>
      <div class="p1s-r is-ai"><i>AI</i><span>${ai}</span></div>
      <div class="p1s-r is-hu"><i>Human</i><span>${hu}</span></div></div>`).join("");
  const html = `<div class="p1s-root" data-s="0">
    <p class="p1s-cap">The work moves from the human to the AI, one level at a time.</p>
    <div class="p1s-steps">${cols}</div>
    <p class="p1s-src">Model by Dan Shapiro · described by Simon Willison, 28 Jan 2026</p></div>`;

  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1s-root"); if (!r) return;
    if (snap) r.classList.add("p1s-snap");
    r.dataset.s = step;
    if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1s-snap")); }
  };
  // the levels come in one by one on their own: first after 0.7 s, then every 1.4 s
  const run = (ctx) => {
    clear();
    const r = ctx.$(".p1s-root"); if (!r) return;
    const cols = r.querySelectorAll(".p1s-col");
    cols.forEach((c) => c.classList.remove("is-on"));
    if (ctx.step >= 1) { cols.forEach((c) => c.classList.add("is-on")); return; }
    cols.forEach((c, i) => timers.push(setTimeout(() => c.classList.add("is-on"), 700 + i * 1400)));
  };

  Deck.slide({
    id: "ai-maturity",
    section: "why",
    title: "Dan Shapiro's levels of AI-assisted development",
    navTitle: "Levels of AI-assisted dev",
    className: "p1s-s",
    steps: 1,
    html,
    onEnter(ctx) { apply(ctx, ctx.step ? 6 : 0, true); run(ctx); },
    onStep(step, dir, ctx) { apply(ctx, step ? 6 : 0, false); if (step) { clear(); ctx.$(".p1s-root").querySelectorAll(".p1s-col").forEach((c) => c.classList.add("is-on")); } },
    notes: "Dan Shapiro's maturity model of AI-assisted software development, as described by Simon Willison on 2026-01-28. It is numbered from zero, so it has six steps, modelled on the levels of driving automation. Level 0, spicy autocomplete: the AI offers inline suggestions and the human writes and drives the code. Level 1, the coding intern: the AI writes minor snippets and boilerplate and the human reviews all of it. Level 2, the junior developer: the human pair programs with the model and still reviews every line. Level 3, the developer: the AI generates most of the code and the human is a full-time code reviewer. Level 4, the engineering team: the human works on specs and plans like a manager and agents do the building. Level 5, the dark software factory: a black box turns specs into software; humans are neither needed nor welcome. Shapiro says only a handful of people work at level 5, on teams of fewer than five. The ADLC of this series aims at level 4: agents build, people own the specification and every human gate. The one-line role descriptions are paraphrases of the source. The move along the scale is the human's job changing from writing, to reviewing, to specifying and governing; see slides 18 and 19. A team is rarely at one level for all its work. No shares of teams per level are shown because the sources give none.",
  });
})();
