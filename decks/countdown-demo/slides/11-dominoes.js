Deck.slide({
  id: "dominoes", section: "visuals", title: "09 · Dominoes", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">A chain of dominoes topples across the screen, one per time slice.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Inevitable momentum.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Short countdowns; very visual.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="dominoes">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "dominoes"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "dominoes"); },
});
