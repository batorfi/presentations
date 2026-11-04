Deck.slide({
  id: "tide", section: "visuals", title: "02 · Tide", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">Layered waves recede from the screen; the waterline drops with the minutes.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>The sea pulling back before the talk.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Relaxed lobbies and long waits.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="tide">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "tide"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "tide"); },
});
