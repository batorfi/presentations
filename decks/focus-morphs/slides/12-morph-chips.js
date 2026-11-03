(() => {
const CHIPS = [
  ["Concept", "ok"], ["Architecture", "delegated"], ["Specification", "wait"], ["Plan", "ok"], ["Checkpoint", "wait"],
  ["Review", "delegated"], ["Verify", "ok"], ["Docs", "wait"], ["Pull request", "ok"],
];
Deck.slide({
  id: "morph-chips",
  section: "morph",
  title: "Morph: sorting",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">Nine gates, in the order they run</h2>
    <div class="demo-chips">${CHIPS.map(([n, k], i) => `<span class="s-pill is-${k}" data-morph="chip-${i}">${n}</span>`).join("")}</div>
    <p class="s-caption">Press → : the same chips sort themselves by who decided.</p>
  `,
  notes: "Many small elements morphing at once; good for regrouping and filtering.",
});
})();
