Deck.slide({
  id: "morph-stage",
  section: "morph",
  title: "Morph: the photo takes the stage",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">…and one of them takes the stage</h2>
    <div class="demo-mo-stage">
      <figure class="s-figure demo-mo-hero" data-morph="m-photo">
        <img class="cover" src="assets/sample-photo.jpg" alt="Soft landscape gradient">
        <figcaption>JPEG</figcaption>
      </figure>
      <div class="demo-mo-aside">
        <figure class="s-figure" data-morph="m-diagram">
          <img src="assets/sample-diagram.png" alt="Flat diagram in teal tones">
          <figcaption>PNG</figcaption>
        </figure>
        <figure class="s-figure" data-morph="m-graphic" data-morph-fit="uniform">
          <img src="assets/sample-graphic.svg" alt="Nested arches">
          <figcaption>SVG</figcaption>
        </figure>
      </div>
    </div>
  `,
  notes: "Press ← to see it all fold back into the row of thumbnails.",
});
