Deck.slide({
  id: "panzoom-inline",
  section: "panzoom",
  title: "Pan & zoom: inline SVG and cover fit",
  html: `
    <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:40px;align-items:start">
      <div class="s-stack" style="gap:12px">
        <p class="s-kicker">Inline &lt;svg&gt; · data-aspect="16/10"</p>
        <div class="s-panzoom" data-aspect="16/10" data-max-zoom="6" data-minimap-size="200" data-views="Core=1300,700,400,400; Outer ring=100,100,900,600">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 1800" aria-label="Concentric rings of services with fine print">
<rect width="3000" height="1800" fill="#12201E"/>
<circle cx="1500" cy="900" r="220" fill="none" stroke="#2B4742" stroke-width="3"/>
<circle cx="1720" cy="900" r="34" fill="#0F7B6C"/>
<text x="1720" y="960" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-100</text>
<text x="1720" y="980" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 34 ms · 9 replicas</text>
<circle cx="1610" cy="1091" r="34" fill="#3B6FB6"/>
<text x="1610" y="1151" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-101</text>
<text x="1610" y="1171" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 20 ms · 6 replicas</text>
<circle cx="1390" cy="1091" r="34" fill="#F2B24A"/>
<text x="1390" y="1151" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-102</text>
<text x="1390" y="1171" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 81 ms · 8 replicas</text>
<circle cx="1280" cy="900" r="34" fill="#D9534F"/>
<text x="1280" y="960" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-103</text>
<text x="1280" y="980" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 84 ms · 2 replicas</text>
<circle cx="1390" cy="709" r="34" fill="#7FE3D2"/>
<text x="1390" y="769" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-104</text>
<text x="1390" y="789" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 81 ms · 1 replicas</text>
<circle cx="1610" cy="709" r="34" fill="#0F7B6C"/>
<text x="1610" y="769" font-size="22" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-105</text>
<text x="1610" y="789" font-size="12" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 64 ms · 5 replicas</text>
<circle cx="1500" cy="900" r="430" fill="none" stroke="#2B4742" stroke-width="3"/>
<circle cx="1911" cy="1027" r="30" fill="#3B6FB6"/>
<text x="1911" y="1083" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-200</text>
<text x="1911" y="1103" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 74 ms · 4 replicas</text>
<circle cx="1792" cy="1215" r="30" fill="#F2B24A"/>
<text x="1792" y="1271" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-201</text>
<text x="1792" y="1291" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 28 ms · 8 replicas</text>
<circle cx="1595" cy="1319" r="30" fill="#D9534F"/>
<text x="1595" y="1375" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-202</text>
<text x="1595" y="1395" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 73 ms · 9 replicas</text>
<circle cx="1373" cy="1311" r="30" fill="#7FE3D2"/>
<text x="1373" y="1367" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-203</text>
<text x="1373" y="1387" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 64 ms · 7 replicas</text>
<circle cx="1185" cy="1192" r="30" fill="#0F7B6C"/>
<text x="1185" y="1248" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-204</text>
<text x="1185" y="1268" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 85 ms · 3 replicas</text>
<circle cx="1081" cy="995" r="30" fill="#3B6FB6"/>
<text x="1081" y="1051" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-205</text>
<text x="1081" y="1071" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 33 ms · 3 replicas</text>
<circle cx="1089" cy="773" r="30" fill="#F2B24A"/>
<text x="1089" y="829" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-206</text>
<text x="1089" y="849" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 70 ms · 7 replicas</text>
<circle cx="1208" cy="585" r="30" fill="#D9534F"/>
<text x="1208" y="641" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-207</text>
<text x="1208" y="661" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 5 ms · 2 replicas</text>
<circle cx="1405" cy="481" r="30" fill="#7FE3D2"/>
<text x="1405" y="537" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-208</text>
<text x="1405" y="557" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 24 ms · 1 replicas</text>
<circle cx="1627" cy="489" r="30" fill="#0F7B6C"/>
<text x="1627" y="545" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-209</text>
<text x="1627" y="565" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 42 ms · 1 replicas</text>
<circle cx="1815" cy="608" r="30" fill="#3B6FB6"/>
<text x="1815" y="664" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-210</text>
<text x="1815" y="684" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 38 ms · 8 replicas</text>
<circle cx="1919" cy="805" r="30" fill="#F2B24A"/>
<text x="1919" y="861" font-size="20" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-211</text>
<text x="1919" y="881" font-size="11" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 80 ms · 7 replicas</text>
<circle cx="1500" cy="900" r="640" fill="none" stroke="#2B4742" stroke-width="3"/>
<circle cx="2028" cy="1261" r="26" fill="#F2B24A"/>
<text x="2028" y="1313" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-300</text>
<text x="2028" y="1333" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 58 ms · 7 replicas</text>
<circle cx="1873" cy="1420" r="26" fill="#D9534F"/>
<text x="1873" y="1472" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-301</text>
<text x="1873" y="1492" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 77 ms · 8 replicas</text>
<circle cx="1672" cy="1516" r="26" fill="#7FE3D2"/>
<text x="1672" y="1568" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-302</text>
<text x="1672" y="1588" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 21 ms · 6 replicas</text>
<circle cx="1451" cy="1538" r="26" fill="#0F7B6C"/>
<text x="1451" y="1590" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-303</text>
<text x="1451" y="1610" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 16 ms · 1 replicas</text>
<circle cx="1236" cy="1483" r="26" fill="#3B6FB6"/>
<text x="1236" y="1535" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-304</text>
<text x="1236" y="1555" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 21 ms · 8 replicas</text>
<circle cx="1052" cy="1357" r="26" fill="#F2B24A"/>
<text x="1052" y="1409" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-305</text>
<text x="1052" y="1429" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 31 ms · 5 replicas</text>
<circle cx="923" cy="1177" r="26" fill="#D9534F"/>
<text x="923" y="1229" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-306</text>
<text x="923" y="1249" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 90 ms · 7 replicas</text>
<circle cx="863" cy="963" r="26" fill="#7FE3D2"/>
<text x="863" y="1015" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-307</text>
<text x="863" y="1035" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 84 ms · 5 replicas</text>
<circle cx="880" cy="741" r="26" fill="#0F7B6C"/>
<text x="880" y="793" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-308</text>
<text x="880" y="813" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 57 ms · 9 replicas</text>
<circle cx="972" cy="539" r="26" fill="#3B6FB6"/>
<text x="972" y="591" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-309</text>
<text x="972" y="611" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 53 ms · 6 replicas</text>
<circle cx="1127" cy="380" r="26" fill="#F2B24A"/>
<text x="1127" y="432" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-310</text>
<text x="1127" y="452" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 72 ms · 7 replicas</text>
<circle cx="1328" cy="284" r="26" fill="#D9534F"/>
<text x="1328" y="336" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-311</text>
<text x="1328" y="356" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 78 ms · 4 replicas</text>
<circle cx="1549" cy="262" r="26" fill="#7FE3D2"/>
<text x="1549" y="314" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-312</text>
<text x="1549" y="334" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 47 ms · 1 replicas</text>
<circle cx="1764" cy="317" r="26" fill="#0F7B6C"/>
<text x="1764" y="369" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-313</text>
<text x="1764" y="389" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 39 ms · 3 replicas</text>
<circle cx="1948" cy="443" r="26" fill="#3B6FB6"/>
<text x="1948" y="495" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-314</text>
<text x="1948" y="515" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 45 ms · 9 replicas</text>
<circle cx="2077" cy="623" r="26" fill="#F2B24A"/>
<text x="2077" y="675" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-315</text>
<text x="2077" y="695" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 77 ms · 2 replicas</text>
<circle cx="2137" cy="837" r="26" fill="#D9534F"/>
<text x="2137" y="889" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-316</text>
<text x="2137" y="909" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 87 ms · 4 replicas</text>
<circle cx="2120" cy="1059" r="26" fill="#7FE3D2"/>
<text x="2120" y="1111" font-size="18" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-317</text>
<text x="2120" y="1131" font-size="10" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 85 ms · 5 replicas</text>
<circle cx="1500" cy="900" r="850" fill="none" stroke="#2B4742" stroke-width="3"/>
<circle cx="2028" cy="1566" r="22" fill="#D9534F"/>
<text x="2028" y="1614" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-400</text>
<text x="2028" y="1634" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 40 ms · 2 replicas</text>
<circle cx="1854" cy="1673" r="22" fill="#7FE3D2"/>
<text x="1854" y="1721" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-401</text>
<text x="1854" y="1741" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 12 ms · 8 replicas</text>
<circle cx="1658" cy="1735" r="22" fill="#0F7B6C"/>
<text x="1658" y="1783" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-402</text>
<text x="1658" y="1803" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 85 ms · 8 replicas</text>
<circle cx="1454" cy="1749" r="22" fill="#3B6FB6"/>
<text x="1454" y="1797" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-403</text>
<text x="1454" y="1817" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 15 ms · 6 replicas</text>
<circle cx="1252" cy="1713" r="22" fill="#F2B24A"/>
<text x="1252" y="1761" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-404</text>
<text x="1252" y="1781" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 12 ms · 7 replicas</text>
<circle cx="1065" cy="1630" r="22" fill="#D9534F"/>
<text x="1065" y="1678" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-405</text>
<text x="1065" y="1698" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 23 ms · 1 replicas</text>
<circle cx="903" cy="1505" r="22" fill="#7FE3D2"/>
<text x="903" y="1553" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-406</text>
<text x="903" y="1573" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 41 ms · 7 replicas</text>
<circle cx="775" cy="1344" r="22" fill="#0F7B6C"/>
<text x="775" y="1392" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-407</text>
<text x="775" y="1412" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 57 ms · 2 replicas</text>
<circle cx="690" cy="1158" r="22" fill="#3B6FB6"/>
<text x="690" y="1206" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-408</text>
<text x="690" y="1226" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 9 ms · 1 replicas</text>
<circle cx="652" cy="957" r="22" fill="#F2B24A"/>
<text x="652" y="1005" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-409</text>
<text x="652" y="1025" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 52 ms · 6 replicas</text>
<circle cx="663" cy="752" r="22" fill="#D9534F"/>
<text x="663" y="800" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-410</text>
<text x="663" y="820" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 74 ms · 5 replicas</text>
<circle cx="723" cy="556" r="22" fill="#7FE3D2"/>
<text x="723" y="604" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-411</text>
<text x="723" y="624" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 68 ms · 4 replicas</text>
<circle cx="828" cy="380" r="22" fill="#0F7B6C"/>
<text x="828" y="428" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-412</text>
<text x="828" y="448" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 8 ms · 5 replicas</text>
<circle cx="972" cy="234" r="22" fill="#3B6FB6"/>
<text x="972" y="282" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-413</text>
<text x="972" y="302" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 4 ms · 2 replicas</text>
<circle cx="1146" cy="127" r="22" fill="#F2B24A"/>
<text x="1146" y="175" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-414</text>
<text x="1146" y="195" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 17 ms · 9 replicas</text>
<circle cx="1342" cy="65" r="22" fill="#D9534F"/>
<text x="1342" y="113" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-415</text>
<text x="1342" y="133" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 8 ms · 4 replicas</text>
<circle cx="1546" cy="51" r="22" fill="#7FE3D2"/>
<text x="1546" y="99" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-416</text>
<text x="1546" y="119" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 56 ms · 5 replicas</text>
<circle cx="1748" cy="87" r="22" fill="#0F7B6C"/>
<text x="1748" y="135" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-417</text>
<text x="1748" y="155" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 82 ms · 5 replicas</text>
<circle cx="1935" cy="170" r="22" fill="#3B6FB6"/>
<text x="1935" y="218" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-418</text>
<text x="1935" y="238" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 23 ms · 1 replicas</text>
<circle cx="2097" cy="295" r="22" fill="#F2B24A"/>
<text x="2097" y="343" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-419</text>
<text x="2097" y="363" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 47 ms · 6 replicas</text>
<circle cx="2225" cy="456" r="22" fill="#D9534F"/>
<text x="2225" y="504" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-420</text>
<text x="2225" y="524" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 50 ms · 3 replicas</text>
<circle cx="2310" cy="642" r="22" fill="#7FE3D2"/>
<text x="2310" y="690" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-421</text>
<text x="2310" y="710" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 52 ms · 7 replicas</text>
<circle cx="2348" cy="843" r="22" fill="#0F7B6C"/>
<text x="2348" y="891" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-422</text>
<text x="2348" y="911" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 62 ms · 9 replicas</text>
<circle cx="2337" cy="1048" r="22" fill="#3B6FB6"/>
<text x="2337" y="1096" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-423</text>
<text x="2337" y="1116" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 53 ms · 9 replicas</text>
<circle cx="2277" cy="1244" r="22" fill="#F2B24A"/>
<text x="2277" y="1292" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-424</text>
<text x="2277" y="1312" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 17 ms · 9 replicas</text>
<circle cx="2172" cy="1420" r="22" fill="#D9534F"/>
<text x="2172" y="1468" font-size="16" fill="#F4F1EA" text-anchor="middle" font-family="Inter, Arial, sans-serif">node-425</text>
<text x="2172" y="1488" font-size="9" fill="#9FB3AE" text-anchor="middle" font-family="Inter, Arial, sans-serif">latency 38 ms · 7 replicas</text>
<circle cx="1500" cy="900" r="90" fill="#F2B24A"/><text x="1500" y="914" font-size="40" font-weight="700" text-anchor="middle" fill="#12201E" font-family="Inter, Arial, sans-serif">Core</text>
<text x="60" y="90" font-size="56" font-weight="700" fill="#F4F1EA" font-family="Inter, Arial, sans-serif">Inline SVG</text><text x="60" y="130" font-size="26" fill="#9FB3AE" font-family="Inter, Arial, sans-serif">The small print is real text: zoom in, it stays sharp.</text></svg>
        </div>
      </div>
      <div class="s-stack" style="gap:12px">
        <p class="s-kicker">data-fit="cover" · data-aspect="1/1"</p>
        <div class="s-panzoom" data-aspect="1/1" data-fit="cover" data-minimap="off" data-badge="off">
          <img src="assets/terrain.jpg" alt="Terrain map, filling a square window">
        </div>
      </div>
    </div>
    <p class="s-caption">Left: vector artwork written straight into the slide stays crisp at any zoom. Right: the cover fit fills the whole window first; zoom out (wheel) to see all of it, with the badge and minimap switched off.</p>
  `,
  notes: "Inline SVG needs a viewBox (or data-content-width/height). Cover fit starts filled; min zoom is the contain fit.",
});
