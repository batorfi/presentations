Deck.slide({
  id: "steps",
  section: "basics",
  title: "Steps and element animations",
  html: `
    <h2 class="s-title">Build a slide one step at a time</h2>
    <p class="s-lead" data-anim="fade">Each press of → reveals the next step before moving on; ← takes it back.</p>
    <div class="demo-anims">
      <div class="s-card" data-step="1" data-anim="up"><h3>up</h3><p><code>data-step="1" data-anim="up"</code></p></div>
      <div class="s-card" data-step="2" data-anim="left"><h3>left</h3><p><code>data-anim="left"</code> enters from the left</p></div>
      <div class="s-card" data-step="3" data-anim="pop"><h3>pop</h3><p><code>data-anim="pop"</code> with a little overshoot</p></div>
      <div class="s-card" data-step="4" data-anim="wipe"><h3>wipe</h3><p><code>data-anim="wipe"</code> reveals left to right</p></div>
      <div class="s-card" data-step="4" data-anim="blur" data-delay="150"><h3>blur</h3><p>Two elements can share a step; <code>data-delay</code> staggers them</p></div>
      <div class="s-card is-accent" data-step="2" data-anim="zoom" data-out-step="5" data-out="down"><h3>leaves at step 5</h3><p><code>data-out-step="5" data-out="down"</code></p></div>
    </div>
    <p class="s-caption" style="margin-top:auto" data-out="fade">This caption has <code>data-out</code>: it fades away before the slide leaves.</p>
  `,
});
