// PATTERN: two-column comparison (before/after, option A/B) with status pills.
Deck.slide({
  id: "compare",
  section: "core",
  title: "Comparison",
  html: `
    <h2 class="s-title">Before and after</h2>
    <div class="tpl-compare">
      <div class="s-card" data-anim="left">
        <span class="s-pill is-wait">● Before</span>
        <ul><li>First observation</li><li>Second observation</li></ul>
      </div>
      <div class="s-card is-accent" data-step="1" data-anim="right">
        <span class="s-pill is-ok">✓ After</span>
        <ul><li>First observation</li><li>Second observation</li></ul>
      </div>
    </div>
  `,
  notes: "Left first; press → for the right side; end with the difference in one sentence.",
});
