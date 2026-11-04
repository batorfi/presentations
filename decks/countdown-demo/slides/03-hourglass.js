Deck.slide({
  id: "hourglass", section: "visuals", title: "01 · Hourglass", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">Sand streams through the neck; the top bulb empties, the pile below grows.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Time as a physical quantity you can see running out.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Calm, classic. A safe default for any audience.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="hourglass">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "hourglass"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "hourglass"); },
});
