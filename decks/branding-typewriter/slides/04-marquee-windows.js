Deck.slide({
  id: "marquee-windows",
  section: "headline",
  title: "Scrolling headline: the window",
  html: `
    <p class="s-kicker">data-width · data-height · data-align · data-direction</p>
    <h2 class="s-title">Size the visible window to the slide</h2>
    <div class="s-stack" style="gap:28px;margin-top:8px">
      <div class="s-marquee is-rail" data-size="m" data-width="bleed" data-height="150px" data-wpm="120">Full-bleed band · data-width="bleed" · rail colours</div>
      <div class="s-marquee" data-size="l" data-width="55%" data-align="center" data-wpm="110" data-direction="ltr">Centered, 55% wide, moving right</div>
      <div class="s-marquee is-accent" data-size="s" data-width="760px" data-fade="none" data-wpm="140">Fixed 760 px window with hard edges, small text</div>
    </div>
  `,
  notes: "Width and height accept any CSS length, bleed spans the full stage.",
});
