// Slide 1 — Title page. Spec: Notion "01 – Title page" (series name, title, presenter, role, duration; edge-branches background in the right quarter).
Deck.slide({
  id: "title",
  section: "opening",
  title: "Modern Software Engineering with Agentic Development Lifecycle Management",
  navTitle: "Title",
  titlebar: false,
  className: "p1-title-slide",
  background: "edge-branches",
  html: `
    <p class="s-kicker" data-anim="fade">ADLC webinar series · Part 1 of 3</p>
    <h1 class="s-title p1-title" data-anim="up" data-delay="150">Modern Software Engineering with <span class="p1-title-em">Agentic Development Lifecycle Management</span></h1>
    <div class="p1-title-meta" data-anim="up" data-delay="450">
      <div class="p1-presenter"><b>Zsolt Bátorfi</b><span>Senior AI architect</span></div>
      <div class="p1-pill">Part 1 · Foundations</div>
      <div class="p1-pill">60 minutes</div>
    </div>
    <div class="s-qr p1-title-qr" data-anim="zoom" data-delay="800" data-qr="https://batorfi.github.io/presentations/decks/adlc-part1/" data-label="Scan to follow along" data-caption="" data-size="180" data-layout="side"></div>
  `,
  notes: "Title page. Series: ADLC webinar series, Part 1 (Foundations). Presenter: Zsolt Bátorfi, senior AI architect. 60 minutes (50 talk + 10 Q&A). The QR code opens the live deck on GitHub Pages.",
});
