// Slide 10 — Case studies: StrongDM leads (the extreme case), Spotify follows (the pragmatic case). Content and figures from the
// Notion page "10 – Case studies" (research summary); every figure is company-reported and labelled so. Step 1 reveals Spotify, step 2 the takeaway.
(function () {
  const stat = (n, c) => `<div class="p1c-stat"><b>${n}</b><span>${c}</span></div>`;
  Deck.slide({
    id: "case-studies",
    section: "what",
    title: "Case studies",
    className: "p1c-s",
    steps: 2,
    html: `<div class="p1c-grid">
      <section class="p1c-card is-lead">
        <header><span class="p1c-name">StrongDM</span><span class="p1c-tag">The extreme case</span></header>
        <p class="p1c-what">A small team writes specifications and test scenarios. By charter, no human writes or reviews the code.</p>
        <div class="p1c-stats">${stat("3", "people on the team")}${stat("0", "lines written or reviewed by humans, by charter")}${stat("$1,000+", "of inference per engineer per day")}</div>
        <p class="p1c-how"><b>How it stays honest:</b> scenarios the code generator cannot see, and cloned services to test against.</p>
        <footer class="p1c-src">Company-reported · Simon Willison, Feb 2026</footer>
      </section>
      <section class="p1c-card is-second" data-step="1">
        <header><span class="p1c-name">Spotify</span><span class="p1c-tag">The pragmatic case</span></header>
        <p class="p1c-what">Honk, a background coding agent, makes migrations and ad hoc changes. An engineer approves each pull request.</p>
        <div class="p1c-stats">${stat("1,500+", "merged AI pull requests by Nov 2025")}${stat("~1,000", "merged every 10 days by Mar 2026")}${stat("60–90%", "less time on migrations")}</div>
        <p class="p1c-how"><b>How it stays honest:</b> verification runs apart from the agent, so it never grades its own work.</p>
        <footer class="p1c-src">Company-reported · Spotify Engineering, Nov 2025 · InfoQ, Mar 2026</footer>
      </section>
    </div>
    <p class="p1c-take" data-step="2">Both put the effort into <b>verification the generator cannot game</b>.</p>`,
    notes: "Two cases, StrongDM first. StrongDM: an internal charter says code must not be written or reviewed by humans; a three-person team writes specifications and test scenarios, keeps holdout scenarios the generator cannot see, tests against cloned services (Okta, Jira, Slack) and watches AI-judged satisfaction scores; at least $1,000 of inference per engineer per day; Level 5, the dark factory, in Dan Shapiro's five-level model. Reportedly agents wrote trivial passing code and rewrote tests to match bugs, which is why the verification is hidden from the generator. Spotify: Honk, a Claude Code based background agent, for migrations and ad hoc changes; more than 1,500 merged AI pull requests by November 2025 and about 1,000 per 10 days by March 2026; 60 to 90 percent time saved on migrations; verification decoupled from the agent runtime; engineers approve the pull requests. The earnings-call line that the best developers have not written code since December is broader than Spotify's own engineering account, so it is not on the slide. All figures are company-reported; independent studies (DORA 2025, Veracode, CodeRabbit) show more instability and weaker security for AI-generated code, and none tested a factory without human review. Sources: Simon Willison 2026-02-07; Spotify Engineering 2025-11; InfoQ 2026-03.",
  });
})();
