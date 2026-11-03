(() => {
const CHIPS = [
  ["Concept", "ok"], ["Architecture", "delegated"], ["Specification", "wait"], ["Plan", "ok"], ["Checkpoint", "wait"],
  ["Review", "delegated"], ["Verify", "ok"], ["Docs", "wait"], ["Pull request", "ok"],
];
const col = (kind, title) => `<div class="demo-col"><h3>${title}</h3>${CHIPS.map(([n, k], i) => (k === kind ? `<span class="s-pill is-${k}" data-morph="chip-${i}" data-morph-delay="${(i % 5) * 40}">${n}</span>` : "")).join("")}</div>`;
Deck.slide({
  id: "morph-groups",
  section: "morph",
  title: "Morph: groups",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">…grouped by who decided</h2>
    <div class="demo-cols">${col("ok", "Decided by a person")}${col("delegated", "Passed under delegation")}${col("wait", "Waiting")}</div>
  `,
  notes: "Press ← to put them back in running order.",
});
})();
