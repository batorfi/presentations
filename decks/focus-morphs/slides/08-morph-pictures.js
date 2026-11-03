Deck.slide({
  id: "morph-pictures",
  section: "morph",
  title: "Morph: pictures",
  transition: "fade",
  html: `
    <p class="s-kicker">data-morph</p>
    <h2 class="s-title">Pictures morph too</h2>
    <div class="demo-mo-thumbs">
      <figure class="s-figure" data-morph="m-photo">
        <img class="cover" src="assets/sample-photo.jpg" alt="Soft landscape gradient">
        <figcaption>JPEG</figcaption>
      </figure>
      <figure class="s-figure" data-morph="m-diagram">
        <img src="assets/sample-diagram.png" alt="Flat diagram in teal tones">
        <figcaption>PNG</figcaption>
      </figure>
      <figure class="s-figure" data-morph="m-graphic" data-morph-fit="uniform">
        <img src="assets/sample-graphic.svg" alt="Nested arches">
        <figcaption>SVG · <code>data-morph-fit="uniform"</code> keeps it undistorted</figcaption>
      </figure>
    </div>
  `,
  notes: "Photo, diagram and SVG are all ordinary elements; any of them can morph.",
});
