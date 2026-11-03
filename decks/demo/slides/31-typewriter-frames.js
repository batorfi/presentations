Deck.slide({
  id: "typewriter-frames",
  section: "typewriter",
  title: "Typewriter: panels and alignment",
  html: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:center">
      <div class="s-typewriter" data-size="m" data-style="panel" data-cps="26" data-text-align="left">
        <p>A panel frames a short principle so it reads as one unit.</p>
        <cite>data-style="panel"</cite>
      </div>
      <div class="s-typewriter" data-size="m" data-style="rail" data-cps="26" data-delay="500">
        <p>A dark band makes the message the loudest thing on the slide.</p>
        <cite>data-style="rail"</cite>
      </div>
      <div class="s-typewriter" data-size="l" data-cps="20" data-align="center" data-text-align="center" data-width="100%" style="grid-column:1/-1" data-delay="400" data-cursor-end="hide">
        <p>Centred, <strong>focused</strong>, finished.</p>
      </div>
    </div>
  `,
  notes: "data-align centres the panel, data-text-align centres the text inside it.",
});
