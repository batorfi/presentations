Deck.slide({
  id: "logo",
  section: "branding",
  title: "A logo in the header",
  html: `
    <p class="s-kicker">Deck.configure({ logo })</p>
    <h2 class="s-title">Your logo sits at the left of the title bar</h2>
    <div class="demo-logo-split">
      <div class="s-stack">
        <p class="s-lead">Point <code>logo.src</code> at an SVG or PNG in the deck's assets folder. It is shown on every slide that has a title bar.</p>
        <div class="s-card">
<pre class="demo-code-block">Deck.configure({
  logo: { src: "assets/newco-logo.svg",
          alt: "NewCo", height: 40 },
  // or mark the spot until you have one:
  // logo: { placeholder: true },
});</pre>
        </div>
        <p class="s-caption"><code>height</code> sets the logo height (default 44 px), <code>maxWidth</code> caps its width. The bar is dark in both themes, so use a logo that works on a dark background.</p>
      </div>
      <div class="s-stack demo-logo-samples">
        <div class="demo-logo-card"><img src="assets/newco-logo.svg" alt="NewCo logo, SVG"><span>SVG</span></div>
        <div class="demo-logo-card"><img src="assets/newco-logo.png" alt="NewCo logo, PNG"><span>PNG</span></div>
        <div class="demo-logo-card"><div class="deck-tb-logo is-placeholder" style="--logo-h:44px"><span>LOGO</span></div><span>placeholder</span></div>
      </div>
    </div>
  `,
  notes: "Sample 'NewCo' logo; replace assets/newco-logo.svg with your own.",
});
