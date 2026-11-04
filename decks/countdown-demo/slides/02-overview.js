Deck.slide({
  id: "overview", section: "visuals", title: "The ten visuals",
  html: `
    <p class="s-lead" data-anim="fade">Click one to preview it full screen — or step through the slides.</p>
    <div class="cd-chips"><button class="cd-chip" data-v="hourglass" data-anim="up" data-delay="120"><span>01</span>Hourglass</button><button class="cd-chip" data-v="tide" data-anim="up" data-delay="160"><span>02</span>Tide</button><button class="cd-chip" data-v="mosaic" data-anim="up" data-delay="200"><span>03</span>Minute mosaic</button><button class="cd-chip" data-v="fuse" data-anim="up" data-delay="240"><span>04</span>Fuse</button><button class="cd-chip" data-v="summit" data-anim="up" data-delay="280"><span>05</span>Summit</button><button class="cd-chip" data-v="pendulum" data-anim="up" data-delay="320"><span>06</span>Pendulum wave</button><button class="cd-chip" data-v="puzzle" data-anim="up" data-delay="360"><span>07</span>Sliding puzzle</button><button class="cd-chip" data-v="assembly" data-anim="up" data-delay="400"><span>08</span>Assembly</button><button class="cd-chip" data-v="dominoes" data-anim="up" data-delay="440"><span>09</span>Dominoes</button><button class="cd-chip" data-v="sunrise" data-anim="up" data-delay="480"><span>10</span>Sunrise</button></div>
  `,
  setup(ctx) { window.cdPreviewBind(ctx); },
});
