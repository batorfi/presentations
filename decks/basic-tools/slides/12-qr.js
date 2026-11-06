Deck.slide({
  id: "qr",
  section: "tools",
  title: "QR code",
  html: `
    <h2 class="s-title">Hand the audience a link</h2>
    <div style="display:grid;grid-template-columns:1fr auto;gap:96px;align-items:center;margin-top:36px">
      <div class="s-stack">
        <p class="s-body">One element, no library and no network: the code is computed in the browser and drawn as SVG.</p>
        <p class="s-body" data-step="1">Three module shapes, four error-correction levels, and a label or caption of your choice.</p>
        <p class="s-body" data-step="2">Always dark on light, so phones read it in dark theme and on a dim projector too.</p>
      </div>
      <div class="s-qr" data-anim="zoom" data-qr="https://batorfi.github.io/presentations/" data-label="Scan to open the deck framework" data-size="460" data-style="rounded"></div>
    </div>
  `,
  steps: 2,
  notes: "Example link only. Use data-qr for your own: a feedback form, the repo, a Wi-Fi code (WIFI:T:WPA;S:name;P:pass;;) or a mailto: link.",
});
