Deck.slide({
  id: "puzzle", section: "visuals", title: "07 · Sliding puzzle", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">Tiles shuffle and solve themselves; the last piece slides in at zero.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Things falling into place.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Workshops and team sessions.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="puzzle">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "puzzle"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "puzzle"); },
});
