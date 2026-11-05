// Options work like on any other background: intensity, speed, seed and colours.
Deck.slide({
  id: "options",
  section: "use",
  title: "Make it yours",
  navTitle: "Options",
  titlebar: false,
  className: "tb-title-slide",
  background: { theme: "edge-network", intensity: 1.5, speed: 0.7, seed: 5, colors: ["#B4521E", "#3B6FB6"] },
  html: `
    <p class="s-kicker" data-anim="fade">Options</p>
    <h1 class="s-hero" data-anim="up" data-delay="120">Make it yours</h1>
    <p class="s-lead" data-anim="up" data-delay="260">This slide: <code>edge-network</code> with <code>intensity 1.5</code>, <code>speed 0.7</code>, another <code>seed</code> and two custom colours.</p>
  `,
});
