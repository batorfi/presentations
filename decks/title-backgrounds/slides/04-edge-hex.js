// Title-slide background demo: edge-hex (lives in the right quarter of the slide only).
Deck.slide({
  id: "edge-hex",
  section: "themes",
  title: "A hex grid lighting up",
  navTitle: "Hex grid",
  titlebar: false,
  className: "tb-title-slide",
  background: "edge-hex",
  html: `
    <p class="s-kicker" data-anim="fade">Title background · Hex grid</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">A hex grid lighting up</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Hexagons light up and pass the glow to their neighbours, most often near the right edge.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420"><code>background: "edge-hex"</code></p>
  `,
  notes: "A soft honeycomb that fades out toward the left. Press B to switch the animation between animated, still and off.",
});
