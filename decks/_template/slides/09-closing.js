// PATTERN: closing slide — takeaways + what happens next.
Deck.slide({
  id: "closing",
  section: "close",
  title: "Takeaways and next steps",
  titlebar: false,
  className: "tpl-closing-slide",
  background: "aurora",
  html: `
    <h2 class="s-hero" data-anim="up">Takeaways</h2>
    <ul class="s-list s-body" data-step="1" data-anim="up">
      <li>First takeaway</li><li>Second takeaway</li><li>Third takeaway</li>
    </ul>
    <p class="s-lead" data-step="2" data-anim="fade">Next: what the audience does or what comes in the next session.</p>
  `,
  notes: "Recap in 30 seconds, then the call to action and questions.",
});
