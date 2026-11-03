// PATTERN: text on the left, a picture/diagram on the right (s-split = 5fr / 7fr).
// TODO: replace the placeholder with <img src="assets/…" alt="…"> or an inline <svg class="s-svg">.
Deck.slide({
  id: "split",
  section: "core",
  title: "Text and a picture",
  html: `
    <div class="s-split s-grow">
      <div class="s-stack">
        <p class="s-kicker" data-anim="fade">Topic</p>
        <h2 class="s-h2" data-anim="up">The point of this picture</h2>
        <p class="s-body" data-anim="up" data-delay="120">Two or three sentences at most. The picture carries the rest.</p>
      </div>
      <figure class="s-figure" data-anim="right" data-delay="150">
        <div class="s-placeholder"><b>Picture goes here</b><span>assets/…  ·  alt text required</span></div>
        <figcaption class="s-caption">Source or caption</figcaption>
      </figure>
    </div>
  `,
  notes: "Describe the picture in one sentence, then the takeaway.",
});
