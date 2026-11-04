Deck.slide({
  id: "whole-treemap", section: "structure", title: "Whole & parts · treemap", className: "pt-s",
  
  html: `
    <div class="pt-stage"><div class="pt-tree"><div class="pt-tm inv" style="grid-column:1 / 7;grid-row:1 / 5;--t:82%;--i:0" data-anim="zoom" data-delay="0"><h3>Build</h3><p>Implementation</p><b>40%</b></div><div class="pt-tm inv" style="grid-column:7 / 13;grid-row:1 / 4;--t:56%;--i:1" data-anim="zoom" data-delay="110"><h3>Verify</h3><p>Tests, checks, review</p><b>28%</b></div><div class="pt-tm" style="grid-column:7 / 10;grid-row:4 / 7;--t:38%;--i:2" data-anim="zoom" data-delay="220"><h3>Plan</h3><p>Specs and slicing</p><b>14%</b></div><div class="pt-tm" style="grid-column:10 / 13;grid-row:4 / 7;--t:26%;--i:3" data-anim="zoom" data-delay="330"><h3>Ship</h3><p>Release and ops</p><b>10%</b></div><div class="pt-tm" style="grid-column:1 / 4;grid-row:5 / 7;--t:18%;--i:4" data-anim="zoom" data-delay="440"><h3>Docs</h3><p>Guides</p><b>5%</b></div><div class="pt-tm" style="grid-column:4 / 7;grid-row:5 / 7;--t:10%;--i:5" data-anim="zoom" data-delay="550"><h3>Learn</h3><p>Retros</p><b>3%</b></div></div></div>
    <p class="pt-use" data-anim="fade" data-delay="700"><b>Use when</b>area carries the message: which parts dominate, and how small the rest are. Sample values only.</p>
`,
  notes: "Treemap built from a CSS grid; area approximates share. A soft sheen passes over each block.",
});
