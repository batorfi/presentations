Deck.slide({
  id: "images",
  section: "media",
  title: "PNG and JPEG images",
  html: `
    <h2 class="s-title">Images sit in the deck's assets folder</h2>
    <div class="demo-media">
      <figure class="s-figure" data-anim="left">
        <img src="assets/sample-diagram.png" alt="Flat diagram in teal tones">
        <figcaption>PNG with transparency · <code>&lt;img src="assets/…png"&gt;</code></figcaption>
      </figure>
      <figure class="s-figure" data-anim="right" data-delay="150">
        <img class="cover" src="assets/sample-photo.jpg" alt="Soft landscape gradient">
        <figcaption>JPEG, cropped to fill with <code>class="cover"</code></figcaption>
      </figure>
    </div>
  `,
});
