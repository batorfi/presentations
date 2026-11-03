Deck.slide({
  id: "morph",
  section: "morph",
  title: "Shared-element morphs",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">What stays on screen keeps moving</h2>
    <p class="s-lead">Give the same element the same <code>data-morph</code> key on two slides and it glides from one place to the other.</p>
    <div class="demo-mo-row">
      <div class="s-card" data-morph="m-concept"><h3>Concept</h3><p>Is this worth building?</p></div>
      <div class="s-card" data-morph="m-arch"><h3>Architecture</h3><p>Is this the right structure?</p></div>
      <div class="s-card" data-morph="m-spec"><h3>Specification</h3><p>What exactly counts as done?</p></div>
    </div>
    <p class="s-caption">Press → : the three cards travel into a new layout.</p>
  `,
  notes: "Next slide: the cards morph. Going back with ← plays it in reverse.",
});
