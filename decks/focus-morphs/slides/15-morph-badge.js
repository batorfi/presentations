Deck.slide({
  id: "morph-badge",
  section: "morph",
  title: "Morph: a badge",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph-fit="uniform"</p>
    <h2 class="s-title">The big number settles into a badge</h2>
    <div class="demo-badge-row">
      <div class="demo-badge" data-morph="nine" data-morph-fit="uniform">9</div>
      <p class="s-lead">gates · every one waits for a person, a judge never reviews its own work, and every decision is recorded.</p>
    </div>
    <ul class="s-list demo-gates" data-anim="fade" data-delay="500">
      <li>Concept</li><li>Architecture</li><li>Specification</li>
    </ul>
  `,
  notes: "Same element, radically different look and size.",
});
