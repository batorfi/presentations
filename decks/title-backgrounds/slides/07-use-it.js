// How to use the title-slide themes.
Deck.slide({
  id: "use-it",
  section: "use",
  title: "Use it on your title slide",
  navTitle: "Use it",
  background: "edge-stars",
  html: `
    <p class="s-kicker" data-anim="fade">How to</p>
    <h2 class="s-title" data-anim="up">Use it on your title slide</h2>
    <div class="tb-how">
      <pre class="tb-code" data-anim="up" data-delay="200">Deck.slide({
  id: "title",
  titlebar: false,
  background: "edge-hex",
  html: "…",
});</pre>
      <div class="tb-rules">
        <div class="s-card" data-anim="up" data-delay="320"><h3>Right quarter only</h3><p>The animation lives in x 1440 to 1920 and fades toward the left. Keep the title and text in the left three quarters.</p></div>
        <div class="s-card" data-anim="up" data-delay="420"><h3>Five themes</h3><p>edge-network, edge-branches, edge-pcb, edge-hex, edge-stars. intensity, speed, seed and colors work as for every other background.</p></div>
      </div>
    </div>
  `,
});
