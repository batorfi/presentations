// PATTERN: one message + three supporting cards that appear one by one (data-step).
// TODO: title states the message as a sentence; each card = a short heading + one line.
Deck.slide({
  id: "three-cards",
  section: "core",
  title: "Three supporting points",
  html: `
    <h2 class="s-title">A message stated as a full sentence</h2>
    <p class="s-lead" data-anim="fade">One line of context under the message.</p>
    <div class="s-grid s-cols-3">
      <div class="s-card" data-step="1" data-anim="up"><h3 class="s-h3">Point one</h3><p class="s-body">Short explanation.</p></div>
      <div class="s-card" data-step="2" data-anim="up"><h3 class="s-h3">Point two</h3><p class="s-body">Short explanation.</p></div>
      <div class="s-card" data-step="3" data-anim="up"><h3 class="s-h3">Point three</h3><p class="s-body">Short explanation.</p></div>
    </div>
  `,
  notes: "Say the message, then reveal each point and give one example.",
});
