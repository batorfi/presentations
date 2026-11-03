// PATTERN: one big statement the audience must remember. For a typed effect load plugins/typewriter.js and use
// <div class="s-typewriter" data-size="l" data-cps="16"><p>…</p></div> instead (see docs/04-plugins.md).
Deck.slide({
  id: "statement",
  section: "core",
  title: "The one thing to remember",
  background: "constellation",
  html: `
    <div class="s-center s-grow">
      <p class="s-kicker" data-anim="fade">Remember</p>
      <h2 class="s-hero" data-anim="up" data-delay="120">One sentence worth remembering.</h2>
    </div>
  `,
  notes: "Pause. Say it slowly. Let it sit.",
});
