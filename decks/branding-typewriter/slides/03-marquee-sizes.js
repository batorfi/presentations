Deck.slide({
  id: "marquee-sizes",
  section: "headline",
  title: "Scrolling headline: four sizes",
  html: `
    <div class="s-stack" style="gap:12px">
      <div class="s-marquee is-accent" data-size="xl" data-wpm="110">Extra large · agents write code, engineers own the outcome</div>
      <div class="s-marquee" data-size="l" data-wpm="120">Large · specs first, then code, then proof</div>
      <div class="s-marquee" data-size="m" data-wpm="130">Medium · small steps, short feedback loops, human review at every gate</div>
      <div class="s-marquee" data-size="s" data-wpm="140">Small · data-size s, m, l, xl = 56, 88, 136, 208 px</div>
    </div>
  `,
  notes: "data-wpm sets the reading pace; the scroll speed is derived from the text so long headlines are not faster.",
});
