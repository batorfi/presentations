Deck.slide({
  id: "focus",
  section: "tools",
  title: "Line-by-line focus and spotlight",
  html: `
    <h2 class="s-title">Guide the eye: focus a point, spotlight a spot</h2>
    <div class="s-grid s-cols-2" style="margin-top:24px; gap:64px">
      <div class="s-stack">
        <p class="s-kicker">data-focus · each → focuses the next point</p>
        <ul class="s-list" data-focus data-focus-release>
          <li>Humans decide; models work.</li>
          <li>Independent judges hold the line.</li>
          <li>You decide where your models run.</li>
          <li>Work is durable.</li>
        </ul>
        <p class="s-caption">Add <code>data-focus-release</code> and one more → brings everything back.</p>
      </div>
      <div class="s-stack">
        <p class="s-kicker">data-focus="reveal" · points arrive one by one</p>
        <div class="s-stack" data-focus="reveal" data-focus-from="1" style="gap:20px">
          <div class="s-card"><h3>Concept</h3><p>Is this worth building?</p></div>
          <div class="s-card"><h3>Architecture</h3><p>Is this the right structure?</p></div>
          <div class="s-card"><h3>Specification</h3><p>What exactly counts as done?</p></div>
        </div>
        <p class="s-caption">Press <b>S</b> for the spotlight, <b>Shift+S</b> for a round one, <b>[ ]</b> or the wheel to resize.</p>
      </div>
    </div>
  `,
});
