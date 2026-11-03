Deck.slide({
  id: "typewriter-quote",
  section: "typewriter",
  title: "Typewriter: a quote",
  html: `
    <div style="flex:1;display:flex;align-items:center">
      <div class="s-typewriter" data-size="l" data-cps="15" data-width="78%" data-style="bar">
        <p>The best software is written by people who <strong>understand the problem</strong>, not by people who type the fastest.</p>
        <cite>A thoughtful engineer, somewhere</cite>
      </div>
    </div>
  `,
  notes: "Types automatically after the slide settles. The next-key finishes it at once; Y types it again.",
});
