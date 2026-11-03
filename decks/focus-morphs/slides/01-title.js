Deck.slide({
  id: "title",
  section: "focus",
  title: "Framework demo · Focus & Morphs",
  titlebar: false, // title slides hide the title bar
  className: "demo-title",
  html: `
    <p class="s-kicker" data-anim="fade">Focus & Morphs</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Guide the eye, move the story</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Line-by-line focus and the spotlight direct attention; shared-element morphs let the same thing glide from one slide to the next. Press <b>→</b> to continue.</p>
    <div class="s-row" data-anim="fade" data-delay="420">
      <span class="s-pill is-ok">✓ Line-by-line focus</span>
      <span class="s-pill is-info">ⓘ Spotlight</span>
      <span class="s-pill is-wait">● Shared-element morphs</span>
    </div>
  `,
  notes: "Speaker notes live here; the presenter view will show them later.",
});
