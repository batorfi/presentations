// Slide 4 — living system map: SWEs, parallel ADLC pipelines with human gates, worker/judge agents, local/hybrid/cloud LLMs.
// Generated look: one seamless 24 s CSS loop, no steps. Spec: Notion "04 – From ideas through specs to MR".
Deck.slide({
  id: "ideas-to-mr",
  section: "why",
  title: "From ideas through specs to MR",
  className: "p1-fac",
  html: `
      <svg class="p1f-svg" viewBox="0 0 1680 848" role="img" aria-label="AI software factory: SWEs orchestrate parallel ADLC pipelines with human gates, worker and judge agents, backed by local, hybrid and cloud LLMs">
      <defs></defs>
      <rect x="0" y="0" width="1680" height="64" rx="16" class="p1f-strip"/>
      <text x="24" y="42" class="p1f-t p1f-b">Shared context</text>
      <rect x="220" y="12" width="104" height="40" rx="20" class="p1f-chip"/><text x="272.0" y="40" text-anchor="middle" class="p1f-t">Team</text>
      <rect x="336" y="12" width="132" height="40" rx="20" class="p1f-chip"/><text x="402.0" y="40" text-anchor="middle" class="p1f-t">Feature</text>
      <rect x="480" y="12" width="148" height="40" rx="20" class="p1f-chip"/><text x="554.0" y="40" text-anchor="middle" class="p1f-t">Personal</text>
      <path d="M950 32 l14 -14 l14 14 l-14 14z" class="p1f-gate p1f-leg"/><text x="988" y="41" class="p1f-t">Human gate</text>
      <circle cx="1160" cy="32" r="14" class="p1f-w"/><text x="1184" y="41" class="p1f-t">Worker agent</text>
      <circle cx="1388" cy="32" r="14" class="p1f-j"/><text x="1412" y="41" class="p1f-t">Judge agent</text>
      <text x="345" y="100" text-anchor="middle" class="p1f-t p1f-hd">Idea</text>
      <text x="550" y="100" text-anchor="middle" class="p1f-t p1f-hd">Specification</text>
      <text x="755" y="100" text-anchor="middle" class="p1f-t p1f-hd">Plan &amp; tasks</text>
      <text x="960" y="100" text-anchor="middle" class="p1f-t p1f-hd">Implementation</text>
      <text x="1165" y="100" text-anchor="middle" class="p1f-t p1f-hd">Review</text>
      <text x="1370" y="100" text-anchor="middle" class="p1f-t p1f-hd">Verification</text>
      <text x="1575" y="100" text-anchor="middle" class="p1f-t p1f-hd">Merge request</text>
      <path d="M24 64 V484" class="p1f-spine"/>
      <path d="M24 166 H90" class="p1f-spine"/>
      <path d="M24 325 H90" class="p1f-spine"/>
      <path d="M24 484 H90" class="p1f-spine"/>
      <g transform="translate(0,166)" style="--d:0s" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,272)" style="--d:-6s" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,378)" style="--d:-12s" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <g transform="translate(0,484)" style="--d:-18s" class="p1f-lane">
      <rect x="250" y="-48" width="1430" height="96" rx="20" class="p1f-lanebg"/>
      <path d="M345 0 H1575" class="p1f-track"/>
      <path d="M447.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g0"/>
      <circle cx="447.5" cy="0" r="20" class="p1f-gring p1f-gr0"/>
      <path d="M652.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g1"/>
      <circle cx="652.5" cy="0" r="20" class="p1f-gring p1f-gr1"/>
      <path d="M857.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g2"/>
      <circle cx="857.5" cy="0" r="20" class="p1f-gring p1f-gr2"/>
      <path d="M1062.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g3"/>
      <circle cx="1062.5" cy="0" r="20" class="p1f-gring p1f-gr3"/>
      <path d="M1267.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g4"/>
      <circle cx="1267.5" cy="0" r="20" class="p1f-gring p1f-gr4"/>
      <path d="M1472.5 -18 l18 18 l-18 18 l-18 -18z" class="p1f-gate p1f-g5"/>
      <circle cx="1472.5" cy="0" r="20" class="p1f-gring p1f-gr5"/>
      <circle cx="345" cy="0" r="9" class="p1f-pk"/>
      </g>
      <path d="M550 532 V580 H350 V716" class="p1f-bus"/>
      <path d="M755 532 V592 H480 V716" class="p1f-bus"/>
      <path d="M960 532 V604 H610 V716" class="p1f-bus"/>
      <path d="M1165 532 V580 H1060 V716" class="p1f-bus"/>
      <path d="M1370 532 V592 H1448 V716" class="p1f-bus"/>
      <g transform="translate(0,166)" style="--d:0s" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" style="offset-path:path('M550 0 V414 H350 V550')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" style="offset-path:path('M755 0 V426 H480 V550')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" style="offset-path:path('M960 0 V438 H610 V550')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" style="offset-path:path('M1165 0 V414 H1060 V550')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" style="offset-path:path('M1370 0 V426 H1448 V550')"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" style="transform-origin:1575px 0px"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,272)" style="--d:-6s" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" style="offset-path:path('M550 0 V308 H350 V444')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" style="offset-path:path('M755 0 V320 H480 V444')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" style="offset-path:path('M960 0 V332 H610 V444')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" style="offset-path:path('M1165 0 V308 H1060 V444')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" style="offset-path:path('M1370 0 V320 H1448 V444')"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" style="transform-origin:1575px 0px"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,378)" style="--d:-12s" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" style="offset-path:path('M550 0 V202 H350 V338')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" style="offset-path:path('M755 0 V214 H480 V338')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" style="offset-path:path('M960 0 V226 H610 V338')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" style="offset-path:path('M1165 0 V202 H1060 V338')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" style="offset-path:path('M1370 0 V214 H1448 V338')"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" style="transform-origin:1575px 0px"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <g transform="translate(0,484)" style="--d:-18s" class="p1f-lane">
      <circle r="6" class="p1f-dot p1f-dw p1f-d1" style="offset-path:path('M550 0 V96 H350 V232')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d2" style="offset-path:path('M755 0 V108 H480 V232')"/>
      <circle r="6" class="p1f-dot p1f-dw p1f-d3" style="offset-path:path('M960 0 V120 H610 V232')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d4" style="offset-path:path('M1165 0 V96 H1060 V232')"/>
      <circle r="6" class="p1f-dot p1f-dj p1f-d5" style="offset-path:path('M1370 0 V108 H1448 V232')"/>
      <circle cx="345" cy="0" r="30" class="p1f-halo p1f-hx p1f-h0"/><circle cx="345" cy="0" r="22" class="p1f-idea"/><path d="M345 -12 l3.5 8.5 l8.5 3.5 l-8.5 3.5 l-3.5 8.5 l-3.5 -8.5 l-8.5 -3.5 l8.5 -3.5z" class="p1f-star"/>
      <circle cx="550" cy="0" r="50" class="p1f-halo p1f-hj p1f-h1"/><g transform="translate(523,0) scale(0.85)"><circle r="20" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g><g transform="translate(577,0) scale(0.85)"><circle r="20" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="755" cy="0" r="36" class="p1f-halo p1f-hw p1f-h2"/><g transform="translate(755,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="960" cy="0" r="36" class="p1f-halo p1f-hw p1f-h3"/><g transform="translate(960,0) scale(1)"><circle r="24" class="p1f-w"/><rect x="-8" y="-8" width="16" height="16" rx="3" class="p1f-wg"/><path d="M-3 -13v5M3 -13v5M-3 8v5M3 8v5" class="p1f-wl"/></g>
      <circle cx="1165" cy="0" r="36" class="p1f-halo p1f-hj p1f-h4"/><g transform="translate(1165,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <circle cx="1370" cy="0" r="36" class="p1f-halo p1f-hj p1f-h5"/><g transform="translate(1370,0) scale(1)"><circle r="24" class="p1f-j"/><path d="M-9 1 L-3 7 L9 -7" class="p1f-jg"/></g>
      <rect x="1533" y="-28" width="84" height="56" rx="14" class="p1f-halo p1f-hm p1f-h6" style="transform-origin:1575px 0px"/><rect x="1540" y="-23" width="70" height="46" rx="11" class="p1f-mr"/><text x="1575" y="9" text-anchor="middle" class="p1f-t p1f-b p1f-mrt">MR</text>
      </g>
      <path d="M150 166 H250" class="p1f-link"/>
      <circle cx="120" cy="166" r="38" class="p1f-avring" style="--d:0s"/>
      <circle cx="120" cy="166" r="30" class="p1f-av"/><circle cx="120" cy="158" r="9" class="p1f-avg"/><path d="M104 184 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="234" text-anchor="middle" class="p1f-t p1f-b">SWE 1</text>
      <path d="M200 272 H250" class="p1f-link"/>
      <path d="M200 378 H250" class="p1f-link"/>
      <path d="M150 325 H200 M200 272 V378" class="p1f-link"/>
      <circle cx="120" cy="325" r="38" class="p1f-avring" style="--d:-6s"/>
      <circle cx="120" cy="325" r="38" class="p1f-avring" style="--d:-12s"/>
      <circle cx="120" cy="325" r="30" class="p1f-av"/><circle cx="120" cy="317" r="9" class="p1f-avg"/><path d="M104 343 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="393" text-anchor="middle" class="p1f-t p1f-b">SWE 2</text>
      <path d="M150 484 H250" class="p1f-link"/>
      <circle cx="120" cy="484" r="38" class="p1f-avring" style="--d:-18s"/>
      <circle cx="120" cy="484" r="30" class="p1f-av"/><circle cx="120" cy="476" r="9" class="p1f-avg"/><path d="M104 502 a16 14 0 0 1 32 0" class="p1f-avg2"/>
      <text x="120" y="552" text-anchor="middle" class="p1f-t p1f-b">SWE 3</text>
      <circle r="5" class="p1f-kdot" style="offset-path:path('M24 64 V166 H90');animation-delay:0.0s"/>
      <circle r="5" class="p1f-kdot" style="offset-path:path('M24 64 V325 H90');animation-delay:-2.6s"/>
      <circle r="5" class="p1f-kdot" style="offset-path:path('M24 64 V484 H90');animation-delay:-5.2s"/>
      <g class="p1f-blk p1f-blkL"><rect x="250" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="480.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Local / on-premise LLMs</text>
      <circle cx="420.0" cy="810" r="7" class="p1f-led" style="animation-delay:-0.0s"/>
      <circle cx="450.0" cy="810" r="7" class="p1f-led" style="animation-delay:-1.3s"/>
      <circle cx="480.0" cy="810" r="7" class="p1f-led" style="animation-delay:-2.6s"/>
      <circle cx="510.0" cy="810" r="7" class="p1f-led" style="animation-delay:-3.9000000000000004s"/>
      <circle cx="540.0" cy="810" r="7" class="p1f-led" style="animation-delay:-5.2s"/>
      </g>
      <g class="p1f-blk p1f-blkH"><rect x="734" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="964.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Hybrid LLMs</text>
      <circle cx="904.0" cy="810" r="7" class="p1f-led" style="animation-delay:-0.7s"/>
      <circle cx="934.0" cy="810" r="7" class="p1f-led" style="animation-delay:-2.0s"/>
      <circle cx="964.0" cy="810" r="7" class="p1f-led" style="animation-delay:-3.3s"/>
      <circle cx="994.0" cy="810" r="7" class="p1f-led" style="animation-delay:-4.6000000000000005s"/>
      <circle cx="1024.0" cy="810" r="7" class="p1f-led" style="animation-delay:-5.9s"/>
      </g>
      <g class="p1f-blk p1f-blkC"><rect x="1218" y="716" width="460" height="132" rx="20" class="p1f-blkbg"/><text x="1448.0" y="772" text-anchor="middle" class="p1f-t p1f-b">Cloud LLMs</text>
      <circle cx="1388.0" cy="810" r="7" class="p1f-led" style="animation-delay:-1.4s"/>
      <circle cx="1418.0" cy="810" r="7" class="p1f-led" style="animation-delay:-2.7s"/>
      <circle cx="1448.0" cy="810" r="7" class="p1f-led" style="animation-delay:-4.0s"/>
      <circle cx="1478.0" cy="810" r="7" class="p1f-led" style="animation-delay:-5.300000000000001s"/>
      <circle cx="1508.0" cy="810" r="7" class="p1f-led" style="animation-delay:-6.6s"/>
      </g>
      </svg>
  `,
  notes: "Living picture of an AI software factory. SWEs orchestrate, decide and review; each can drive several ADLC pipelines. Every stage boundary is a human gate: work stops until a person decides. Worker agents build, judge agents review and verify, on different models. Models run local, hybrid or cloud. Team, feature and personal knowledge flow in as context. High-level only; the stages are detailed later in the series.",
});
