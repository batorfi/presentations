// PATTERN: section divider — big number, section name, one line. Use between major parts.
Deck.slide({
  id: "section-core",
  section: "core",
  title: "Section divider",
  titlebar: false,
  className: "tpl-section-slide",
  background: "circuit",
  html: `
    <p class="tpl-section-no" data-anim="fade">01</p>
    <h2 class="s-hero" data-anim="up" data-delay="100">Section name</h2>
    <p class="s-lead" data-anim="up" data-delay="200">The one question this section answers.</p>
  `,
  notes: "Transition sentence into this section.",
});
