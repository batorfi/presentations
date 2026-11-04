Deck.slide({
  id: "mosaic", section: "visuals", title: "03 · Minute mosaic", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">A grid of cells, one per 15 s (or per minute on long spans). Each goes dark when its time has passed.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Counting the minutes you can literally count.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Audiences who like to read the time at a glance.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="mosaic">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "mosaic"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "mosaic"); },
});
