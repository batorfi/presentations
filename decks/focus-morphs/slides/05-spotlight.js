Deck.slide({
  id: "spotlight",
  section: "focus",
  title: "Spotlight: aim at anything",
  html: `
    <p class="s-kicker">Press S</p>
    <h2 class="s-title">Dim everything except where you point</h2>
    <div class="s-grid s-cols-3" style="margin-top:36px; gap:32px">
      <div class="s-card"><h3>Gate 2 · Architecture</h3><p>Holds the lane. A critic on the strongest model checks structure.</p></div>
      <div class="s-card"><h3>Gate 5 · Checkpoint</h3><p>A restorable base before risk. It may split a feature in two.</p></div>
      <div class="s-card"><h3>Gate 9 · Pull request</h3><p>Approving is the merge. The final human sign-off.</p></div>
    </div>
    <div class="demo-keys demo-keys-row">
      <kbd>S</kbd><span>on / off</span>
      <kbd>Shift+S</kbd><span>rectangle / circle</span>
      <kbd>[ ]</kbd><span>or the wheel: size</span>
      <kbd>Right-click</kbd><span>dimming and border style</span>
    </div>
    <p class="s-caption">The window's edge has marching dashes and a soft pulse, so the boundary stays clear on light and dark slides.</p>
  `,
  notes: "Turn it on, sweep across the three cards, switch to the circle, resize with the wheel.",
});
