Deck.slide({
  id: "svg",
  section: "media",
  title: "SVG graphics",
  html: `
    <h2 class="s-title">SVG as a file, or inline and animated</h2>
    <div class="demo-media">
      <figure class="s-figure" data-anim="fade">
        <img src="assets/sample-graphic.svg" alt="Nested arches">
        <figcaption>External .svg with <code>&lt;img&gt;</code> — simplest, but not styleable</figcaption>
      </figure>
      <figure class="s-figure">
        <svg class="s-svg" viewBox="0 0 640 400" width="100%" height="560" role="img" aria-label="A flow drawn step by step">
          <g fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
            <path class="accent" d="M40 200 H600" data-step="1" data-anim="draw"/>
            <rect class="ink fill-raised" x="70" y="140" width="120" height="120" rx="20" data-step="2" data-anim="pop"/>
            <rect class="ink fill-raised" x="260" y="140" width="120" height="120" rx="20" data-step="2" data-anim="pop" data-delay="120"/>
            <rect class="ink fill-raised" x="450" y="140" width="120" height="120" rx="20" data-step="2" data-anim="pop" data-delay="240"/>
            <path class="accent" d="M100 200 l20 20 l40 -40 M290 200 l20 20 l40 -40" data-step="3" data-anim="draw"/>
          </g>
          <text x="320" y="330" text-anchor="middle" font-size="22" data-step="3" data-anim="fade">inline SVG uses theme colours and steps</text>
        </svg>
        <figcaption>Inline SVG: <code>data-anim="draw"</code> traces strokes; colours follow the theme</figcaption>
      </figure>
    </div>
  `,
});
