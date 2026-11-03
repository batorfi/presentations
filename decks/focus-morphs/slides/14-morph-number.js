Deck.slide({
  id: "morph-number",
  section: "morph",
  title: "Morph: a number",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph-fit="uniform"</p>
    <div class="demo-big-n">
      <div class="demo-nine" data-morph="nine" data-morph-fit="uniform">9</div>
      <div class="s-stack">
        <h2 class="s-title">gates between an idea and a merge</h2>
        <p class="s-lead">Text and numbers morph too. With <code>data-morph-fit="uniform"</code> they scale evenly instead of stretching.</p>
      </div>
    </div>
  `,
  notes: "The big numeral becomes a small badge on the next slide.",
});
