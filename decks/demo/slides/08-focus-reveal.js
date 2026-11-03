Deck.slide({
  id: "focus-reveal",
  section: "focus",
  title: "Focus: reveal as you go",
  html: `
    <p class="s-kicker">data-focus="reveal"</p>
    <h2 class="s-title">Hold points back until you reach them</h2>
    <div class="s-grid s-cols-3" data-focus="reveal" style="margin-top:40px; gap:32px">
      <div class="s-card is-rail"><h3>Concept</h3><p>Is this worth building?</p></div>
      <div class="s-card is-rail"><h3>Architecture</h3><p>Is this the right structure?</p></div>
      <div class="s-card is-rail"><h3>Specification</h3><p>What exactly counts as done?</p></div>
    </div>
    <p class="s-caption" style="margin-top:36px">Points that have not come yet are hidden; the ones you passed stay visible but dimmed. Works on any container, not only lists.</p>
  `,
  notes: "Reveal mode: unseen points are invisible, passed ones dim, the current one is lit.",
});
