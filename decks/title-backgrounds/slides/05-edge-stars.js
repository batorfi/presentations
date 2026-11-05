// Title-slide background demo: edge-stars (lives in the right quarter of the slide only).
Deck.slide({
  id: "edge-stars",
  section: "themes",
  title: "A constellation at the edge",
  navTitle: "Stars",
  titlebar: false,
  className: "tb-title-slide",
  background: "edge-stars",
  html: `
    <p class="s-kicker" data-anim="fade">Title background · Stars</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">A constellation at the edge</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Slow drifting points joined by lines when they come close, twinkling gently.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420"><code>background: "edge-stars"</code></p>
  `,
  notes: "The quietest of the five. Press B to switch the animation between animated, still and off.",
});
