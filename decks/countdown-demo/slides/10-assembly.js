Deck.slide({
  id: "assembly", section: "visuals", title: "08 · Assembly", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">Triangles fly in from the edges and assemble into a ▶ play symbol.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Pieces become the start button.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Keynotes: the ▶ is the promise of what follows.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="assembly">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "assembly"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "assembly"); },
});
