Deck.slide({
  id: "sunrise", section: "visuals", title: "10 · Sunrise", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">The sun climbs from below the horizon, the sky shifts from night to day.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Dawn of the session.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Morning sessions, opening talks.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="sunrise">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "sunrise"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "sunrise"); },
});
