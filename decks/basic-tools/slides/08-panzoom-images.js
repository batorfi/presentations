Deck.slide({
  id: "panzoom-images",
  section: "panzoom",
  title: "Pan & zoom: PNG and JPG, any window",
  html: `
    <div style="display:grid;grid-template-columns:1.65fr 1fr;gap:40px">
      <div class="s-stack" style="gap:12px">
        <p class="s-kicker">PNG · data-height="660px"</p>
        <div class="s-panzoom" data-height="660px" data-max-zoom="2" data-views="Top row=100,360,2300,800; Bottom row=2400,1500,2300,800">
          <img src="assets/metrics-wall.png" alt="Wall of 60 delivery metric tiles">
        </div>
      </div>
      <div class="s-stack" style="gap:12px">
        <p class="s-kicker">JPG · narrower window, own views</p>
        <div class="s-panzoom" data-height="660px" data-minimap-size="170" data-views="Harbour=500,500,900,600; Ridge=2100,1100,900,600; East=3900,2100,900,600">
          <img src="assets/terrain.jpg" alt="Terrain map with five labelled sites">
        </div>
      </div>
    </div>
    <p class="s-caption">Each window sets its own size with <code>data-width</code> / <code>data-height</code> (or <code>data-aspect</code>, or <code>fill</code>), its own fit, zoom limit and preset views.</p>
  `,
  notes: "Two independent viewports on one slide. Press E while hovering one to explore it with the keyboard.",
});
