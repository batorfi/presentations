// Title-slide background demo: edge-network (lives in the right quarter of the slide only).
Deck.slide({
  id: "edge-network",
  section: "themes",
  title: "Packets on a network",
  navTitle: "Network",
  titlebar: false,
  className: "tb-title-slide",
  background: "edge-network",
  html: `
    <p class="s-kicker" data-anim="fade">Title background · Network</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Packets on a network</h1>
    <p class="s-lead" data-anim="up" data-delay="260">A small web of nodes sways at the edge of the slide while light packets hop from node to node.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420"><code>background: "edge-network"</code></p>
  `,
  notes: "Fits a title slide next to a left-aligned title. Press B to switch the animation between animated, still and off.",
});
