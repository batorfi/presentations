// Slide 28 — closing "Thanks for coming". A glowing work item runs the 12 gates, merges at the end, and the loop restarts (echoes the ADLC blueprint).
(() => {
  const pips = Array.from({ length: 12 }, () => `<i class="p1th-pip"></i>`).join("");
  Deck.slide({
    id: "thanks",
    section: "next",
    title: "Thanks for coming",
    navTitle: "Thanks",
    className: "p1th-s",
    html: `<div class="p1th"><h2>Thanks for coming</h2><div class="p1th-track" aria-hidden="true"><span class="p1th-line"></span>${pips}<i class="p1th-ring"></i><i class="p1th-dot"></i></div></div>`,
    notes: "Closing. Thanks for coming.",
  });
})();
