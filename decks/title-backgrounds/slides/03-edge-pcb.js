// Title-slide background demo: edge-pcb (lives in the right quarter of the slide only).
Deck.slide({
  id: "edge-pcb",
  section: "themes",
  title: "Traces on a board",
  navTitle: "PCB",
  titlebar: false,
  className: "tb-title-slide",
  background: "edge-pcb",
  html: `
    <p class="s-kicker" data-anim="fade">Title background · PCB</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Traces on a board</h1>
    <p class="s-lead" data-anim="up" data-delay="260">Right-angle traces with ring pads, and pulses of light running along them.</p>
    <p class="s-small s-muted" data-anim="fade" data-delay="420"><code>background: "edge-pcb"</code></p>
  `,
  notes: "Calm and technical; the traces stay on a fixed grid. Press B to switch the animation between animated, still and off.",
});
