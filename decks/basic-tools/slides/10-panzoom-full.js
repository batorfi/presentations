Deck.slide({
  id: "panzoom-full",
  section: "panzoom",
  title: "Pan & zoom: the whole slide area",
  html: `
    <div class="s-panzoom" data-bleed data-fit="cover" data-max-zoom="3" data-minimap-size="280"
         data-views="Harbour=500,500,900,600; Ridge camp=2100,1100,900,600; North pass=3500,400,900,600; Lowland depot=1100,2000,900,600; East relay=3900,2100,900,600">
      <img src="assets/terrain.jpg" alt="Terrain map with five labelled sites">
    </div>
  `,
  notes: "data-bleed makes the viewport fill the slide area under the title bar, edge to edge. Click it or press E for keyboard control; 1-5 jump to the sites.",
});
