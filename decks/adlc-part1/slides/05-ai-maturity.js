// Slide 5 — Dan Shapiro's levels of AI-assisted development (staircase). Source: Simon Willison, "The Five Levels: from Spicy Autocomplete
// to the Dark Factory" (2026-01-28). Content from the Notion page "05 – Dan Shapiro's levels of AI-assisted development". Steps 0-5 uncover levels 0-5 one by one,
// step 6 marks where the ADLC aims (level 4, author-confirmed 2026-11-12). No shares or percentages: the source gives none.
(function () {
  const LEVELS = [
    ["Spicy autocomplete", "Inline suggestions and snippets", "Writes and drives the code"],
    ["The coding intern", "Minor snippets and boilerplate", "Reviews all of it"],
    ["The junior developer", "Pair programs with the human", "Still reviews every line"],
    ["The developer", "Generates most of the code", "Full-time code reviewer"],
    ["The engineering team", "Agents do the building", "Works on specs and plans, like a manager"],
    ["The dark software factory", "A black box turns specs into software", "Neither needed nor welcome"],
  ];
  const cols = LEVELS.map(([n, ai, hu], i) => `<div class="p1s-col${i === 4 ? " is-adlc" : ""}" style="--i:${i};--h:${430 + i * 62}px">
      ${i === 4 ? `<div class="p1s-pin"><b>ADLC aims here</b></div>` : ""}
      <div class="p1s-lv">Level ${i}</div><h3>${n}</h3>
      <div class="p1s-r is-ai"><i>AI</i><span>${ai}</span></div>
      <div class="p1s-r is-hu"><i>Human</i><span>${hu}</span></div></div>`).join("");
  const html = `<div class="p1s-root" data-s="0">
    <p class="p1s-cap">The work moves from the human to the AI, one level at a time.</p>
    <div class="p1s-steps">${cols}</div>
    <p class="p1s-src">Model by Dan Shapiro · described by Simon Willison, 28 Jan 2026</p></div>`;

  const apply = (ctx, step, snap) => {
    const r = ctx.$(".p1s-root"); if (!r) return;
    if (snap) r.classList.add("p1s-snap");
    r.dataset.s = step;
    r.querySelectorAll(".p1s-col").forEach((c, i) => c.classList.toggle("is-on", i <= Math.min(step, 5)));
    if (snap) { void r.offsetWidth; requestAnimationFrame(() => r.classList.remove("p1s-snap")); }
  };

  Deck.slide({
    id: "ai-maturity",
    section: "why",
    title: "Dan Shapiro's levels of AI-assisted development",
    navTitle: "Levels of AI-assisted dev",
    className: "p1s-s",
    steps: 6,
    html,
    onEnter(ctx) { apply(ctx, ctx.step, true); },
    onStep(step, dir, ctx) { apply(ctx, step, false); },
    notes: "Dan Shapiro's maturity model of AI-assisted software development, as described by Simon Willison on 2026-01-28. It is numbered from zero, so it has six steps, modelled on the levels of driving automation. Level 0, spicy autocomplete: the AI offers inline suggestions and the human writes and drives the code. Level 1, the coding intern: the AI writes minor snippets and boilerplate and the human reviews all of it. Level 2, the junior developer: the human pair programs with the model and still reviews every line. Level 3, the developer: the AI generates most of the code and the human is a full-time code reviewer. Level 4, the engineering team: the human works on specs and plans like a manager and agents do the building. Level 5, the dark software factory: a black box turns specs into software; humans are neither needed nor welcome. Shapiro says only a handful of people work at level 5, on teams of fewer than five (StrongDM, slide 11). The ADLC of this series aims at level 4: agents build, people own the specification and every human gate. The one-line role descriptions are paraphrases of the source. The move along the scale is the human's job changing from writing, to reviewing, to specifying and governing; see slides 15 and 16. A team is rarely at one level for all its work. No shares of teams per level are shown because the sources give none.",
  });
})();
