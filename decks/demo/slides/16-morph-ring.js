(() => {
const GATES = ["Concept", "Architecture", "Specification", "Plan", "Review", "Verify"];
const ringDots = () => GATES.map((g, i) => {
  const a = (-90 + i * 60) * Math.PI / 180;
  const x = 280 + 220 * Math.cos(a) - 48, y = 280 + 220 * Math.sin(a) - 48;
  return `<div class="demo-dot ${i < 3 ? "is-done" : i === 3 ? "is-now" : ""}" style="left:${x}px;top:${y}px" data-morph="dot-${i}" data-morph-delay="${i * 70}">${i + 1}</div>`;
}).join("");
Deck.slide({
  id: "morph-ring",
  section: "morph",
  title: "Morph: a ring",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph · data-morph-delay</p>
    <h2 class="s-title">…and the same six on a ring</h2>
    <div class="demo-ring-split">
      <div class="demo-ring">${ringDots()}<div class="demo-ring-mid"><b>Gate 4</b><span>Plan</span></div></div>
      <div class="s-stack" data-anim="fade" data-delay="500">
        <p class="s-lead">Same elements, different arrangement. The line, the ring or a grid is just layout; the morph keeps their identity.</p>
        <p class="s-body">Press ← to send them back in a line.</p>
      </div>
    </div>
  `,
  notes: "Dots travel in a staggered cascade; their order stays recognisable.",
});
})();
