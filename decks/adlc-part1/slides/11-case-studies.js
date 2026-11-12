// Slide 11 — Case studies: StrongDM leads (the extreme case), Spotify follows (the pragmatic case). Content and figures from the
// Notion page "11 – Case studies" (research summary); every figure is company-reported and labelled so. Step 1 reveals Spotify, step 2 the beat "What both cases teach" (cards fade out).
(function () {
  const INS = [
    ["Verification is the product", "Both spend their effort on checks the generator cannot game: hidden scenarios at StrongDM, a separate verification runtime at Spotify."],
    ["Autonomy follows what can be checked", "Migrations are objectively verifiable, so Spotify scales them. StrongDM can drop human review only because scenario suites judge the result."],
    ["People move to the two ends", "Humans define the intent and the acceptance checks; at Spotify they also approve every pull request."],
    ["Treat the numbers as hypotheses", "The figures are company-reported. Independent studies (DORA, Veracode, CodeRabbit) show more instability and weaker security for AI-generated code. Measure your own."],
  ];
  const set = (ctx, n) => { const r = ctx.$(".p1c-root"); if (r) r.dataset.s = n; };
  const stat = (n, c) => `<div class="p1c-stat"><b>${n}</b><span>${c}</span></div>`;
  Deck.slide({
    id: "case-studies",
    section: "what",
    title: "Case studies",
    className: "p1c-s",
    steps: 2,
    html: `<div class="p1c-root" data-s="0"><div class="p1c-grid">
      <section class="p1c-card is-lead">
        <header><span class="p1c-id"><span class="p1c-name">StrongDM</span></span><span class="p1c-tag">The extreme case</span></header>
        <p class="p1c-what">A small team writes specifications and test scenarios; by charter no human writes or reviews the code. Level 5, the “dark factory”, in Dan Shapiro’s five-level model.</p>
        <blockquote class="p1c-q"><p>“Code must not be written by humans.” “Code must not be reviewed by humans.”</p><cite>StrongDM’s internal charter, as reported by Simon Willison</cite></blockquote>
        <div class="p1c-stats">${stat("3", "people on the team")}${stat("0", "lines written or reviewed by humans, by charter")}${stat("$1,000+", "of inference per engineer per day")}</div>
        <p class="p1c-how"><b>How it stays honest:</b> scenarios the code generator cannot see, cloned services (Okta, Jira, Slack) to test against, and AI-judged satisfaction scores instead of reading diffs.</p>
        <footer class="p1c-src">Company-reported · Simon Willison, Feb 2026</footer>
      </section>
      <section class="p1c-card is-second" data-step="1">
        <header><span class="p1c-id"><span class="p1c-name">Spotify</span></span><span class="p1c-tag">The pragmatic case</span></header>
        <p class="p1c-what">Honk, a background coding agent, makes migrations and ad hoc changes. An engineer approves each pull request.</p>
        <blockquote class="p1c-q"><p>“…have not written a single line of code since December.”</p><cite>Gustav Söderström, co-CEO, Q4 2025 earnings call, about the company’s best developers</cite></blockquote>
        <div class="p1c-stats">${stat("1,500+", "merged AI pull requests by Nov 2025")}${stat("~1,000", "merged every 10 days by Mar 2026")}${stat("60–90%", "less time on migrations")}</div>
        <p class="p1c-how"><b>How it stays honest:</b> verification runs apart from the agent, so it never grades its own work, and migrations can be checked objectively.</p>
        <footer class="p1c-src">Company-reported · Spotify Engineering, Nov 2025 · InfoQ, Mar 2026</footer>
      </section>
    </div>
    <section class="p1c-ins"><h3>What both cases teach</h3><div class="p1c-ig">${INS.map(([t, d], i) => `<div class="p1c-i" style="--d:${i * 160}ms"><b>${i + 1}</b><h4>${t}</h4><p>${d}</p></div>`).join("")}</div></section></div>`,
    onEnter(ctx) { set(ctx, ctx.step); },
    onStep(step, dir, ctx) { set(ctx, step); },
    notes: "Two cases, StrongDM first. StrongDM: an internal charter says code must not be written or reviewed by humans; a three-person team writes specifications and test scenarios, keeps holdout scenarios the generator cannot see, tests against cloned services (Okta, Jira, Slack) and watches AI-judged satisfaction scores; at least $1,000 of inference per engineer per day; Level 5, the dark factory, in Dan Shapiro's five-level model. Reportedly agents wrote trivial passing code and rewrote tests to match bugs, which is why the verification is hidden from the generator. Spotify: Honk, a Claude Code based background agent, for migrations and ad hoc changes; more than 1,500 merged AI pull requests by November 2025 and about 1,000 per 10 days by March 2026; 60 to 90 percent time saved on migrations; verification decoupled from the agent runtime; engineers approve the pull requests. The quote on the slide is co-CEO Gustav Soderstrom on the Q4 2025 earnings call about the best developers; it is broader than Spotify's own engineering account (migrations and ad hoc tasks, merged by pull request with human approval), so the slide attributes it exactly and does not claim Spotify has no human review. The StrongDM quotes come from its internal charter as reported by Simon Willison. No logos yet: the official files have to be supplied (assets/logos/). All figures are company-reported; independent studies (DORA 2025, Veracode, CodeRabbit) show more instability and weaker security for AI-generated code, and none tested a factory without human review. Key insights on the last beat: verification is the product; autonomy follows what can be checked; people move to the two ends (intent and acceptance in, approval and accountability out); treat the numbers as hypotheses. Sources: Simon Willison 2026-02-07; Spotify Engineering 2025-11; InfoQ 2026-03.",
  });
})();
