Deck.slide({
  id: "panzoom-svg",
  section: "panzoom",
  title: "Pan & zoom: a big SVG",
  html: `
    <div class="s-panzoom" data-height="fill" data-max-zoom="3"
         data-views="Edge=80,300,1200,900; Ingest=1410,300,1200,900; Core=2740,300,1200,900; Data=80,1320,1200,900; Agents=1410,1320,1200,900; Ops=2740,1320,1200,900">
      <img src="assets/platform-map.svg" alt="Platform map: six zones of services and the links between them">
    </div>
    <p class="s-caption">A 4000 × 2250 SVG in a 1720 px window. Drag to pan, wheel to zoom, double-click to dive in. Click the map (or press <b>E</b>) for the keyboard: arrows pan, + − zoom, 0 fit, 1–6 jump to a zone, Esc done.</p>
  `,
  notes: "Views are rectangles in picture pixels. The minimap shows while zoomed in.",
});
