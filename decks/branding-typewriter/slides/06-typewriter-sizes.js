Deck.slide({
  id: "typewriter-sizes",
  section: "typewriter",
  title: "Typewriter: four sizes",
  html: `
    <div class="s-stack" style="gap:34px;justify-content:center;flex:1">
      <div class="s-typewriter" data-size="xl" data-cps="14" data-cursor="block" data-delay="200"><p>Extra large</p></div>
      <div class="s-typewriter" data-size="l" data-cps="22" data-width="80%"><p>Large text for a short statement.</p></div>
      <div class="s-typewriter" data-size="m" data-cps="28" data-width="70%"><p>Medium text carries a paragraph of two or three lines, a size that is easy to read from the back of the room.</p></div>
      <div class="s-typewriter" data-size="s" data-cps="40" data-width="62%" data-font="sans"><p>Small text, <em>data-size="s"</em>: 36 px. The four sizes are 36, 48, 68 and 96 px, or set data-font-size to any pixel size.</p></div>
    </div>
  `,
  notes: "Several typewriters on one slide type one after the other.",
});
