Deck.slide({
  id: "closing", section: "use", title: "Use it in your deck",
  html: `
    <pre class="cd-code" data-anim="up">&lt;script src="../../framework/plugins/countdown.js"&gt;&lt;/script&gt;

Deck.configure({ countdown: {
  title: "My talk", author: "Your name", duration: "90 minutes",
  minutes: 5, visual: "hourglass", show: false } });</pre>
    <p class="s-lead" data-anim="up" data-delay="160">Press <b>K</b> from any slide, or open the deck with <code>?lobby</code>. The chosen visual is remembered per deck.</p>
  `,
  notes: "Docs: docs/04-plugins.md → Countdown lobby.",
});
