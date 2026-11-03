Deck.slide({
  id: "options",
  section: "options",
  title: "Options and a plain slide",
  background: { theme: "constellation", intensity: 1.6, speed: 0.6, seed: 4, colors: ["#B4521E", "#3B6FB6"] },
  html: `
    <p class="s-kicker" data-anim="fade">Options</p>
    <h1 class="s-title" data-anim="up">Make it yours</h1>
    <p class="s-lead" data-anim="up" data-delay="120">This slide: constellation with <code>intensity 1.6</code>, <code>speed 0.6</code>, another <code>seed</code> and two custom colours.</p>
    <div class="demo-bgcards">
      <div class="s-card" data-anim="up" data-delay="240"><h3>intensity</h3><p>0.3 whisper … 2 clearly present</p></div>
      <div class="s-card" data-anim="up" data-delay="320"><h3>speed, seed</h3><p>Pace of motion; another layout, same every time.</p></div>
      <div class="s-card" data-anim="up" data-delay="400"><h3>colors</h3><p>One to three CSS colours.</p></div>
    </div>
  `,
});
