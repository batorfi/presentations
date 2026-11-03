Deck.slide({
  id: "title",
  section: "branding",
  title: "Framework demo · Branding & Typewriter",
  titlebar: false, // title slides hide the title bar
  className: "demo-title",
  html: `
    <p class="s-kicker" data-anim="fade">Branding & Typewriter</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Your brand, your message</h1>
    <p class="s-lead" data-anim="up" data-delay="260">A logo in the title bar, a scrolling headline and a typewriter for the one message the audience must remember. Press <b>→</b> to continue.</p>
    <div class="s-row" data-anim="fade" data-delay="420">
      <span class="s-pill is-ok">✓ Header logo</span>
      <span class="s-pill is-info">ⓘ Scrolling headline</span>
      <span class="s-pill is-wait">● Typewriter</span>
    </div>
  `,
  notes: "Speaker notes live here; the presenter view will show them later.",
});
