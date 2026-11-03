Deck.slide({
  id: "title",
  section: "basics",
  title: "Framework demo · Basics & Tools",
  titlebar: false, // title slides hide the title bar
  className: "demo-title",
  html: `
    <p class="s-kicker" data-anim="fade">Basics & Tools</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">A calm, keyboard-driven deck engine</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Elements on this slide animate in by themselves when it opens. Press <b>→</b> to continue, <b>?</b> for every shortcut, or right-click for the menu.</p>
    <div class="s-row" data-anim="fade" data-delay="420">
      <span class="s-pill is-ok">✓ Runs from file://</span>
      <span class="s-pill is-info">ⓘ GPU-friendly motion</span>
      <span class="s-pill is-wait">● KILN design system</span>
    </div>
  `,
  notes: "Speaker notes live here; the presenter view will show them later.",
});
