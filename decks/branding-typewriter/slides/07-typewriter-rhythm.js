Deck.slide({
  id: "typewriter-rhythm",
  section: "typewriter",
  title: "Typewriter: rhythm, lines, emphasis",
  html: `
    <div class="s-stack" style="gap:40px;justify-content:center;flex:1">
      <div>
        <p class="s-kicker">Natural rhythm (default): pauses at commas, full stops, lines</p>
        <div class="s-typewriter" data-size="m" data-cps="18" data-width="88%">
          <p>Agents write the code, and engineers own the outcome.<br>Specs first. Then code. Then proof.</p>
          <p>Mark **key words** with double stars, or use <mark>highlights</mark>.</p>
        </div>
      </div>
      <div>
        <p class="s-kicker">Steady pace · mono · underscore cursor · hides when done</p>
        <div class="s-typewriter" data-size="s" data-cps="30" data-rhythm="steady" data-font="mono" data-cursor="underscore" data-cursor-end="hide" data-width="88%">
          <p>$ adlc plan --spec payments.md --review human</p>
        </div>
      </div>
    </div>
  `,
  notes: "data-rhythm steady removes the variation and the pauses.",
});
