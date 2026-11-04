Deck.slide({
  id: "evolution-curve", section: "flow", title: "Evolution · S-curve", className: "pt-s",
  
  html: `
    <div class="pt-stage" data-anim="fade"><svg class="s-svg" viewBox="0 0 1680 660" width="1680" height="660" role="img" >
  <defs><linearGradient id="pt-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--deck-accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--deck-accent)" stop-opacity="0"/></linearGradient></defs>
  <line class="pt-axis" x1="70" y1="560" x2="1640" y2="560"/><line class="pt-axis" x1="70" y1="40" x2="70" y2="560"/>
  <text class="pt-cap" x="70" y="26">Capability</text><text class="pt-cap" x="1640" y="540" text-anchor="end">Time →</text>
  <path class="pt-area" d="M110 540 C640 540 700 130 1100 130 C1350 130 1500 125 1590 110 L1590 560 L110 560 Z" data-anim="fade" data-delay="600"/>
  <path class="pt-curve" d="M110 540 C640 540 700 130 1100 130 C1350 130 1500 125 1590 110" data-anim="draw" data-duration="1400"/>
  <path class="pt-packet" d="M110 540 C640 540 700 130 1100 130 C1350 130 1500 125 1590 110" pathLength="100" style="animation-duration:7s;--i:0"/>
  <g data-anim="up" data-delay="900"><line class="pt-drop" x1="400" y1="489" x2="400" y2="560"/><circle cx="400" cy="489" r="15" fill="var(--deck-raised)" stroke="var(--deck-accent)" stroke-width="6"/><circle class="pt-ring" style="--i:0" cx="400" cy="489" r="15"/><text class="pt-h" x="400" y="602" text-anchor="middle">Emerge</text><text class="pt-sub" x="400" y="634" text-anchor="middle">A few early adopters</text></g><g data-anim="up" data-delay="1100"><line class="pt-drop" x1="693" y1="304" x2="693" y2="560"/><circle cx="693" cy="304" r="15" fill="var(--deck-raised)" stroke="var(--deck-accent)" stroke-width="6"/><circle class="pt-ring" style="--i:1" cx="693" cy="304" r="15"/><text class="pt-h" x="693" y="602" text-anchor="middle">Grow</text><text class="pt-sub" x="693" y="634" text-anchor="middle">Adoption accelerates</text></g><g data-anim="up" data-delay="1300"><line class="pt-drop" x1="1010" y1="137" x2="1010" y2="560"/><circle cx="1010" cy="137" r="15" fill="var(--deck-raised)" stroke="var(--deck-accent)" stroke-width="6"/><circle class="pt-ring" style="--i:2" cx="1010" cy="137" r="15"/><text class="pt-h" x="1010" y="602" text-anchor="middle">Mature</text><text class="pt-sub" x="1010" y="634" text-anchor="middle">Standard practice</text></g><g data-anim="up" data-delay="1500"><line class="pt-drop" x1="1528" y1="118" x2="1528" y2="560"/><circle cx="1528" cy="118" r="15" fill="var(--deck-raised)" stroke="var(--deck-accent)" stroke-width="6"/><circle class="pt-ring" style="--i:3" cx="1528" cy="118" r="15"/><text class="pt-h" x="1528" y="602" text-anchor="middle">Reinvent</text><text class="pt-sub" x="1528" y="634" text-anchor="middle">Next curve begins</text></g></svg></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>growth is slow, then fast, then flat — and you want to place today on the curve. The dot repeats the journey.</p>
`,
  notes: "S-curve with four phases. Place a marker for 'we are here' by adding a pulsing ring.",
});
