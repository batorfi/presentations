// PATTERN: title slide — no title bar, centred, optional animated background.
// TODO: replace the kicker, the title and the lead; delete `background` for a still slide.
Deck.slide({
  id: "title",
  section: "opening",
  title: "{{TITLE}}",
  navTitle: "Title",
  titlebar: false,
  className: "tpl-title-slide",
  background: "aurora",
  html: `
    <p class="s-kicker" data-anim="fade">Series or event name · Part 1</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">{{TITLE}}</h1>
    <p class="s-lead" data-anim="up" data-delay="260">One sentence that says what the audience will take away.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420">Presenter · Date</p>
  `,
  notes: "Welcome, who I am, what this session covers (one sentence).",
});
