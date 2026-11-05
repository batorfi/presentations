// Title-slide background demo: edge-branches (lives in the right quarter of the slide only).
Deck.slide({
  id: "edge-branches",
  section: "themes",
  title: "Branches growing in",
  navTitle: "Branches",
  titlebar: false,
  className: "tb-title-slide",
  background: "edge-branches",
  html: `
    <p class="s-kicker" data-anim="fade">Title background · Branches</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Branches growing in</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Branches grow in from the right edge, split, settle and fade, then new ones start.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420"><code>background: "edge-branches"</code></p>
  `,
  notes: "Growth that always heads toward the title, never into it. Press B to switch the animation between animated, still and off.",
});
