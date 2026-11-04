Deck.slide({
  id: "summit", section: "visuals", title: "05 · Summit", background: "none", className: "cd-v",
  html: `
    <p class="s-lead" data-anim="up">A climber ascends a ridge line toward a flag on the peak.</p>
    <div class="s-grid s-cols-2" style="gap:40px">
      <div class="s-card" data-anim="up" data-delay="140"><h3>Feels like</h3><p>Progress toward a goal, not time running out.</p></div>
      <div class="s-card" data-anim="up" data-delay="220"><h3>Best for</h3><p>Talks about journeys and change.</p></div>
    </div>
    <div class="cd-play-row" data-anim="up" data-delay="320">
      <button class="cd-play" data-v="summit">▶ Preview full screen</button>
      <span class="s-small s-muted">or press <b>W</b> · 45 seconds · Esc to return · <code>visual: "summit"</code></span>
    </div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx, "summit"); },
});
