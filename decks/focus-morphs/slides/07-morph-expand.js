Deck.slide({
  id: "morph-expand",
  section: "morph",
  title: "Morph: one card opens up",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">The same cards, a new arrangement</h2>
    <div class="demo-mo-split">
      <div class="demo-mo-side">
        <div class="s-card demo-mo-mini" data-morph="m-concept"><h3>Concept</h3></div>
        <div class="s-card demo-mo-mini" data-morph="m-spec"><h3>Specification</h3></div>
      </div>
      <div class="s-card is-accent demo-mo-big" data-morph="m-arch">
        <h3>Architecture</h3>
        <p class="s-lead">Is this the right structure?</p>
        <ul class="s-list">
          <li>Holds the lane until a person decides</li>
          <li>A critic on the strongest model checks the design</li>
        </ul>
        <p class="s-small" data-step="1" data-anim="up">Content inside a morphing element can still use steps.</p>
      </div>
    </div>
  `,
  notes: "The cards keep their identity: one grows, two shrink. Their text crossfades while they travel.",
});
