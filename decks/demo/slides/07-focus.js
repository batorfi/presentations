Deck.slide({
  id: "focus",
  section: "focus",
  title: "Focus: one point at a time",
  html: `
    <p class="s-kicker">data-focus</p>
    <h2 class="s-title">Walk through a list, one point at a time</h2>
    <div class="demo-focus-split">
      <ul class="s-list demo-big" data-focus data-focus-release>
        <li>Humans decide; models work.</li>
        <li>Independent judges hold the line.</li>
        <li>You decide where your models run.</li>
        <li>Work is durable.</li>
      </ul>
      <div class="s-card is-rail demo-how">
        <h3>How it behaves</h3>
        <p>Press → : the first point takes the focus and the others fade back.</p>
        <p>Each → moves the focus down; ← moves it back up.</p>
        <p>With <code>data-focus-release</code> one last → brings everything back.</p>
      </div>
    </div>
  `,
  notes: "Plain list, only two attributes. Step with → and back with ←.",
});
