Deck.slide({
  id: "fuse", section: "visuals", title: "04 · Fuse", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">A rope burns from one end with a glowing spark and a trail of embers.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Tension: the spark reaches the end at zero.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Energetic kick-offs and hackathons.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="fuse">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "fuse"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "fuse"); },
});
