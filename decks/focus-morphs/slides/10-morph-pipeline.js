(() => {
const GATES = ["Concept", "Architecture", "Specification", "Plan", "Review", "Verify"];
const dots = (cls) => GATES.map((g, i) => `<div class="demo-dot ${i < 3 ? "is-done" : i === 3 ? "is-now" : ""}" data-morph="dot-${i}" data-morph-delay="${i * 70}" title="${g}">${i + 1}</div>`).join("");
Deck.slide({
  id: "morph-pipeline",
  section: "morph",
  title: "Morph: a pipeline",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph · data-morph-delay</p>
    <h2 class="s-title">Six gates in a line…</h2>
    <div class="demo-line"><i></i>${dots()}</div>
    <p class="s-caption">Press → : each gate travels to its place on a ring, one after the other (<code>data-morph-delay</code>).</p>
  `,
  notes: "Staggered delays make a group of morphs read as one gesture.",
});
})();
