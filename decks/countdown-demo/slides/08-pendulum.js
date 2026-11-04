Deck.slide({
  id: "pendulum", section: "visuals", title: "06 · Pendulum wave", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">A row of pendulums drifts into wave patterns and realigns exactly at zero.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Hypnotic order emerging from chaos.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Technical audiences; looks great on a big screen.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="pendulum">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "pendulum"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "pendulum"); },
});
