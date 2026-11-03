/* Izzy's Numbers - all artwork is hand-built SVG (no emoji, no image files). */
(function (IZ) {
  'use strict';
  const A = (IZ.art = {});

  // ---------- shared gradients & filters (referenced by every illustration) ----------
  A.defs = `
<svg id="art-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="g-uni-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd4ff"/></linearGradient>
  <linearGradient id="g-uni-leg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8cffb"/><stop offset="1" stop-color="#b3a6ee"/></linearGradient>
  <linearGradient id="g-uni-mane" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8f4ff"/><stop offset=".5" stop-color="#b59bff"/><stop offset="1" stop-color="#ff9fd6"/></linearGradient>
  <linearGradient id="g-horn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffcf8a"/><stop offset="1" stop-color="#fffbea"/></linearGradient>
  <linearGradient id="g-dra-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c60e2"/><stop offset="1" stop-color="#323a96"/></linearGradient>
  <linearGradient id="g-dra-snout" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e64da"/><stop offset="1" stop-color="#3d3b9c"/></linearGradient>
  <linearGradient id="g-dra-belly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6bf"/><stop offset="1" stop-color="#ffa86a"/></linearGradient>
  <linearGradient id="g-dra-wing" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7b63e0"/><stop offset="1" stop-color="#c8b6ff"/></linearGradient>
  <radialGradient id="g-eye" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#fff3c8"/><stop offset=".45" stop-color="#ffb347"/><stop offset="1" stop-color="#ff6a2b"/></radialGradient>
  <radialGradient id="g-ember" cx=".5" cy=".65" r=".6"><stop offset="0" stop-color="#fff7d6"/><stop offset=".5" stop-color="#ffb347"/><stop offset="1" stop-color="#ff5e3a"/></radialGradient>
  <radialGradient id="g-orb"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#d4f8ff"/><stop offset=".62" stop-color="#7fdcff" stop-opacity=".45"/><stop offset="1" stop-color="#7fdcff" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d2fbff"/><stop offset=".5" stop-color="#8f86ff"/><stop offset="1" stop-color="#c46cff"/></linearGradient>
  <linearGradient id="g-egg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bba6ff"/><stop offset="1" stop-color="#5537b0"/></linearGradient>
  <linearGradient id="g-mush" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6f6ff"/><stop offset=".6" stop-color="#55b4ff"/><stop offset="1" stop-color="#7759f0"/></linearGradient>
  <linearGradient id="g-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset=".5" stop-color="#ffd76e"/><stop offset="1" stop-color="#ffa04a"/></linearGradient>
  <linearGradient id="g-shoe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfc8ff"/><stop offset="1" stop-color="#8f86e0"/></linearGradient>
  <linearGradient id="g-cu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd2a6"/><stop offset=".5" stop-color="#d27a43"/><stop offset="1" stop-color="#94461f"/></linearGradient>
  <linearGradient id="g-ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d9dcea"/><stop offset="1" stop-color="#9298b2"/></linearGradient>
  <linearGradient id="g-au" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".5" stop-color="#e8b947"/><stop offset="1" stop-color="#a87a16"/></linearGradient>
  <radialGradient id="g-face" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ddd3fb"/></radialGradient>
  <linearGradient id="g-frac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2fcff"/><stop offset="1" stop-color="#6fd3ff"/></linearGradient>
  <radialGradient id="g-sphere" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a1040" stop-opacity=".45"/></radialGradient>
  <filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs></svg>`;

  // ---------- seeded random for the background so it is the same every time ----------
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f1 = (n) => n.toFixed(1);

  // A slender, layered pine silhouette.
  function pine(x, base, h, w) {
    const tiers = 6 + Math.floor(rnd() * 3);
    const top = base - h;
    const crown = h * 0.86;
    const trunk = Math.max(2, w * 0.07);
    const R = [], L = [];
    for (let k = 0; k < tiers; k++) {
      const t0 = top + crown * (k / tiers);
      const t1 = top + crown * ((k + 1) / tiers);
      const dt = t1 - t0;
      const hw = w * (0.16 + 0.84 * ((k + 1) / tiers));
      const inner = hw * 0.4 + trunk;
      R.push([x + hw * (0.85 + rnd() * 0.3), t1 + dt * 0.18]);
      L.push([x - hw * (0.85 + rnd() * 0.3), t1 + dt * 0.18]);
      if (k < tiers - 1) { R.push([x + inner, t1 - dt * 0.1]); L.push([x - inner, t1 - dt * 0.1]); }
    }
    const bottom = top + crown;
    let d = `M${f1(x)},${f1(top)}`;
    for (const p of R) d += `L${f1(p[0])},${f1(p[1])}`;
    d += `L${f1(x + trunk)},${f1(bottom)}L${f1(x + trunk)},${base}L${f1(x - trunk)},${base}L${f1(x - trunk)},${f1(bottom)}`;
    for (let k = L.length - 1; k >= 0; k--) d += `L${f1(L[k][0])},${f1(L[k][1])}`;
    return d + 'Z';
  }
  function trees(n, x0, x1, base, hmin, hmax, wr) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * (i + rnd() * 0.8)) / n;
      const h = hmin + rnd() * (hmax - hmin);
      d += pine(x, base + rnd() * 18, h, h * wr * (0.8 + rnd() * 0.4));
    }
    return d;
  }

  // ---------- the misty, glowing forest behind everything ----------
  A.scene = function () {
    seed = 4242;
    const W = 1600, H = 1000, hz = 650;
    let stars = '';
    for (let i = 0; i < 70; i++) stars += `<circle cx="${f1(rnd() * W)}" cy="${f1(rnd() * 430)}" r="${f1(0.8 + rnd() * 1.8)}" opacity="${f1(0.25 + rnd() * 0.6)}"/>`;
    const far = trees(48, -40, 1640, hz, 80, 190, 0.3);
    const mid = trees(26, -40, 1640, hz + 30, 170, 330, 0.3);
    const nearL = trees(5, -90, 250, hz + 120, 420, 680, 0.27);
    const nearR = trees(5, 1350, 1690, hz + 120, 420, 680, 0.27);
    let glints = '';
    for (let i = 0; i < 26; i++) {
      const x = rnd() < 0.5 ? rnd() * 330 : 1270 + rnd() * 330;
      const y = 820 + rnd() * 170;
      glints += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + rnd() * 3.5)}"/>`;
    }
    let shimmer = '';
    for (let i = 0; i < 16; i++) {
      const y = hz + 50 + rnd() * 260, x = 300 + rnd() * 1000, w = 60 + rnd() * 220;
      shimmer += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="2" rx="1"/>`;
    }
    return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#120a30"/><stop offset=".3" stop-color="#2a1c63"/><stop offset=".5" stop-color="#5a3ea6"/>
      <stop offset=".62" stop-color="#b886cf"/><stop offset=".67" stop-color="#e9b6c8"/><stop offset="1" stop-color="#3a2a7a"/>
    </linearGradient>
    <radialGradient id="bg-sun"><stop offset="0" stop-color="#ffe6c6" stop-opacity=".95"/><stop offset=".22" stop-color="#ffb89c" stop-opacity=".55"/><stop offset=".6" stop-color="#c77dd0" stop-opacity=".18"/><stop offset="1" stop-color="#7a4fc0" stop-opacity="0"/></radialGradient>
    <radialGradient id="bg-treeglow"><stop offset="0" stop-color="#ffd9b8" stop-opacity=".8"/><stop offset="1" stop-color="#ffb4a0" stop-opacity="0"/></radialGradient>
    <linearGradient id="bg-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6acc"/><stop offset=".22" stop-color="#3d2e88"/><stop offset="1" stop-color="#120c33"/></linearGradient>
    <linearGradient id="bg-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bg-mtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3b4f2"/><stop offset=".45" stop-color="#8468c8"/><stop offset="1" stop-color="#6a56b8"/></linearGradient>
    <filter id="bg-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="bg-haze"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg-sky)"/>
  <g fill="#fff">${stars}</g>
  <ellipse cx="820" cy="590" rx="640" ry="400" fill="url(#bg-sun)"/>
  <g fill="url(#bg-ray)">
    <polygon points="560,-40 640,-40 900,${hz} 760,${hz}"/>
    <polygon points="700,-40 760,-40 1010,${hz} 920,${hz}"/>
    <polygon points="860,-40 900,-40 1120,${hz} 1060,${hz}"/>
  </g>
  <path d="M860,${hz} C960,560 1060,430 1160,360 C1200,332 1240,330 1280,356 C1380,420 1490,540 1660,${hz} Z" fill="url(#bg-mtn)" opacity=".55" filter="url(#bg-haze)"/>
  <g opacity=".55" filter="url(#bg-haze)" fill="#8a6cc8">
    <path d="M452,${hz} C458,520 466,400 470,330 L490,330 C494,400 502,520 508,${hz} Z"/>
    <circle cx="480" cy="300" r="70"/><circle cx="420" cy="320" r="52"/><circle cx="540" cy="318" r="56"/>
    <circle cx="455" cy="262" r="50"/><circle cx="512" cy="258" r="48"/><circle cx="380" cy="350" r="34"/><circle cx="584" cy="350" r="36"/>
  </g>
  <circle cx="480" cy="300" r="90" fill="url(#bg-treeglow)" opacity=".7"/>
  <path d="${far}" fill="#6b55b5" opacity=".78" filter="url(#bg-haze)"/>
  <ellipse cx="800" cy="${hz}" rx="950" ry="70" fill="#dccbff" opacity=".42" filter="url(#bg-soft)"/>
  <path d="${mid}" fill="#3f3189"/>
  <rect x="0" y="${hz + 30}" width="${W}" height="${H - hz - 30}" fill="url(#bg-lake)"/>
  <g transform="translate(0 ${2 * (hz + 30)}) scale(1 -1)" opacity=".3"><path d="${mid}" fill="#2a1f6e"/></g>
  <ellipse cx="820" cy="${hz + 60}" rx="420" ry="40" fill="#ffd2c0" opacity=".22" filter="url(#bg-soft)"/>
  <g fill="#e6dcff" opacity=".22">${shimmer}</g>
  <ellipse cx="800" cy="${hz + 40}" rx="900" ry="50" fill="#cbb8ff" opacity=".3" filter="url(#bg-soft)"/>
  <path d="${nearL}${nearR}" fill="#1a1240"/>
  <path d="M-20,${H} L-20,820 C80,800 200,812 300,840 C360,860 400,900 430,${H} Z M1620,${H} L1620,820 C1520,800 1400,812 1300,840 C1240,860 1200,900 1170,${H} Z" fill="#140d36"/>
  <g fill="#9ff0ff" opacity=".75">${glints}</g>
</svg>`;
  };

  // Put a character drawing at a spot inside a bigger picture (optionally facing the other way).
  const place = (svg, x, y, w, flip) => {
    const h = (w * 220) / 240;
    const inner = svg.replace('<svg ', `<svg x="0" y="0" width="${w}" height="${f1(h)}" `);
    return `<g transform="translate(${flip ? x + w : x} ${y}) scale(${flip ? -1 : 1} 1)">${inner}</g>`;
  };

  // ---------- the world map: Unicorn Meadows on the left, Dragon Peaks on the right ----------
  A.world = (pts) => {
    seed = 777;
    const W = 2000, H = 800;
    let stars = '';
    for (let i = 0; i < 90; i++) stars += `<circle cx="${f1(rnd() * W)}" cy="${f1(rnd() * 260)}" r="${f1(0.8 + rnd() * 1.8)}" opacity="${f1(0.3 + rnd() * 0.6)}"/>`;
    let flowers = '';
    for (let i = 0; i < 70; i++) {
      const x = rnd() * 1000, y = 500 + rnd() * 290;
      flowers += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + rnd() * 3)}" fill="${rnd() < 0.5 ? '#9ff0ff' : '#ffb3e0'}" opacity="${f1(0.5 + rnd() * 0.5)}"/>`;
    }
    let embers = '';
    for (let i = 0; i < 40; i++) embers += `<circle cx="${f1(1050 + rnd() * 950)}" cy="${f1(540 + rnd() * 250)}" r="${f1(1.5 + rnd() * 3)}" fill="#ffc27a" opacity="${f1(0.4 + rnd() * 0.5)}"/>`;
    const crystals = [[1080, 640, 0.9], [1230, 690, 0.7], [1470, 700, 1], [1600, 650, 0.6], [1960, 640, 0.8], [1360, 470, 0.6]]
      .map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#f-glow)">${ITEMS.crystal}</g>`).join('');
    // A smooth glowing trail through every place on the map.
    let trail = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      trail += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]},${p2[1]}`;
    }
    const pinesL = trees(16, -20, 1000, 500, 70, 150, 0.32);
    const pinesFront = trees(6, -40, 420, 820, 160, 260, 0.3);
    return `
<svg class="world" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="w-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140b38"/><stop offset=".45" stop-color="#3a2a86"/><stop offset=".75" stop-color="#8e68c6"/></linearGradient>
    <linearGradient id="w-warm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9a6a" stop-opacity="0"/><stop offset=".55" stop-color="#ff9a6a" stop-opacity=".28"/><stop offset="1" stop-color="#ff7a50" stop-opacity=".4"/></linearGradient>
    <radialGradient id="w-glow"><stop offset="0" stop-color="#ffe0c4" stop-opacity=".8"/><stop offset=".5" stop-color="#ff9fbf" stop-opacity=".25"/><stop offset="1" stop-color="#ff9fbf" stop-opacity="0"/></radialGradient>
    <radialGradient id="w-lava"><stop offset="0" stop-color="#fff2c0"/><stop offset=".4" stop-color="#ffab4a" stop-opacity=".8"/><stop offset="1" stop-color="#ff5e3a" stop-opacity="0"/></radialGradient>
    <linearGradient id="w-meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a57c0"/><stop offset="1" stop-color="#2c2172"/></linearGradient>
    <linearGradient id="w-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a8a"/><stop offset="1" stop-color="#22143f"/></linearGradient>
    <filter id="w-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#w-sky)"/>
  <rect width="${W}" height="${H}" fill="url(#w-warm)"/>
  <g fill="#fff">${stars}</g>
  <ellipse cx="980" cy="340" rx="520" ry="260" fill="url(#w-glow)"/>

  <!-- Unicorn Meadows -->
  <path d="M0,430 C200,350 400,390 600,340 C800,300 900,370 1060,350 L1060,800 L0,800 Z" fill="#5d4bb0" opacity=".75"/>
  <path d="${pinesL}" fill="#47379a" opacity=".9"/>
  <path d="M0,520 C150,470 300,500 480,460 C650,420 800,480 1010,450 L1010,800 L0,800 Z" fill="url(#w-meadow)"/>
  <path d="M120,380 A260,260 0 0 1 640,380" fill="none" stroke="#ffb3e0" stroke-width="10" opacity=".35"/>
  <path d="M135,380 A245,245 0 0 1 625,380" fill="none" stroke="#b59bff" stroke-width="10" opacity=".35"/>
  <path d="M150,380 A230,230 0 0 1 610,380" fill="none" stroke="#9ff0ff" stroke-width="10" opacity=".35"/>
  ${flowers}

  <!-- Dragon Peaks -->
  <path d="M1000,540 L1120,320 L1180,360 L1300,180 L1420,370 L1500,270 L1640,130 L1780,340 L1860,240 L2000,390 L2000,800 L1000,800 Z" fill="url(#w-rock)"/>
  <path d="M1120,320 L1180,360 L1300,180 L1420,370 L1500,270 L1640,130 L1780,340 L1860,240 L2000,390" fill="none" stroke="#ffb07a" stroke-width="4" opacity=".55" stroke-linejoin="round"/>
  <ellipse cx="1640" cy="134" rx="70" ry="34" fill="url(#w-lava)"/>
  <g fill="#7a5aa8" opacity=".5"><circle cx="1650" cy="90" r="22"/><circle cx="1675" cy="60" r="28"/><circle cx="1710" cy="30" r="32"/></g>
  <path d="M1640,140 C1630,220 1660,280 1620,360 C1600,410 1630,460 1610,520" fill="none" stroke="#ff9a4a" stroke-width="9" stroke-linecap="round" opacity=".75" filter="url(#f-glow)"/>
  <path d="M1300,190 C1310,260 1280,320 1300,400" fill="none" stroke="#ff9a4a" stroke-width="6" stroke-linecap="round" opacity=".6" filter="url(#f-glow)"/>
  <path d="M1000,580 C1200,540 1400,580 1600,540 C1800,510 1900,560 2000,540 L2000,800 L1000,800 Z" fill="#2a1a4e"/>
  ${embers}${crystals}

  <!-- the river between the two lands, flowing into the moonlit lake -->
  <path d="M1010,330 C990,400 1030,450 1000,520 C980,550 960,570 940,590" fill="none" stroke="#8fe9ff" stroke-width="34" stroke-linecap="round" opacity=".45"/>
  <path d="M1010,330 C990,400 1030,450 1000,520 C980,550 960,570 940,590" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".35"/>
  <ellipse cx="940" cy="600" rx="150" ry="48" fill="#8fe9ff" opacity=".35" filter="url(#w-soft)"/>
  <ellipse cx="940" cy="600" rx="120" ry="34" fill="#a8f0ff" opacity=".4"/>
  <path d="${pinesFront}" fill="#1a1240"/>

  <!-- the trail -->
  <path d="${trail}" fill="none" stroke="#ffe7b0" stroke-width="22" stroke-linecap="round" opacity=".16"/>
  <path d="${trail}" fill="none" stroke="#ffe7b0" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 18" opacity=".9"/>

  <!-- unicorns and dragons who live here -->
  ${place(A.unicorn(), 20, 240, 170)}
  ${place(A.unicorn(), 560, 160, 140, true)}
  ${place(A.unicorn(), 215, 660, 120)}
  ${place(A.dragon(), 1150, 60, 150)}
  ${place(A.dragon(), 1470, 30, 120, true)}
  ${place(A.dragon(), 1640, 630, 150, true)}

  <g font-family="ui-rounded, system-ui, sans-serif" font-weight="800" text-anchor="middle">
    <text x="380" y="120" font-size="54" fill="#fff" stroke="#2a1b5e" stroke-width="8" paint-order="stroke">Unicorn Meadows</text>
    <text x="1975" y="205" font-size="50" text-anchor="end" fill="#ffe6c8" stroke="#2a1b5e" stroke-width="8" paint-order="stroke">Dragon Peaks</text>
  </g>
</svg>`;
  };

  // ---------- Luma the unicorn ----------
  A.unicorn = () => `
<svg class="char unicorn" viewBox="0 0 240 220" aria-hidden="true">
  <g class="u-tail">
    <path d="M66,112 C34,100 16,126 24,156 C28,170 22,184 10,192 C38,198 58,180 56,158 C55,142 62,130 74,124 Z" fill="url(#g-uni-mane)"/>
    <path d="M62,116 C44,118 34,138 40,160" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
  </g>
  <rect x="78" y="138" width="15" height="60" rx="7.5" fill="url(#g-uni-leg)"/>
  <rect x="136" y="138" width="15" height="60" rx="7.5" fill="url(#g-uni-leg)"/>
  <rect x="78" y="188" width="15" height="11" rx="5" fill="#9d86ee"/>
  <rect x="136" y="188" width="15" height="11" rx="5" fill="#9d86ee"/>
  <ellipse cx="112" cy="128" rx="58" ry="36" fill="url(#g-uni-body)"/>
  <ellipse cx="98" cy="112" rx="32" ry="9" fill="#fff" opacity=".7"/>
  <rect x="94" y="142" width="16" height="62" rx="8" fill="url(#g-uni-body)"/>
  <rect x="152" y="142" width="16" height="62" rx="8" fill="url(#g-uni-body)"/>
  <rect x="94" y="193" width="16" height="11" rx="5" fill="#b59bff"/>
  <rect x="152" y="193" width="16" height="11" rx="5" fill="#b59bff"/>
  <path d="M138,112 C144,88 154,70 166,56 L198,70 C188,90 180,112 172,140 C158,136 146,128 138,112 Z" fill="url(#g-uni-body)"/>
  <g class="u-head">
    <path d="M170,44 L172,20 L184,40 Z" fill="#fff"/>
    <path d="M173,40 L174,27 L180,39 Z" fill="#ffc6e8"/>
    <ellipse cx="184" cy="60" rx="28" ry="22" fill="#fff"/>
    <ellipse cx="206" cy="76" rx="18" ry="14" fill="#f4f0ff"/>
    <path d="M186,41 L205,4 L197,45 Z" fill="url(#g-horn)" filter="url(#f-glow)"/>
    <path d="M190,33 L199,30 M193,25 L201,22 M196,16 L203,13" stroke="#e8b96b" stroke-width="1.8" stroke-linecap="round"/>
    <g class="blink"><ellipse cx="192" cy="59" rx="5.5" ry="7" fill="#2a1b5e"/><circle cx="194" cy="56" r="2.2" fill="#fff"/></g>
    <path d="M197,53 l5,-3 M198,57 l6,-1" stroke="#2a1b5e" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="200" cy="70" rx="6" ry="4" fill="#ffb3d9" opacity=".65"/>
    <ellipse cx="215" cy="75" rx="2" ry="2.8" fill="#9a86d8"/>
    <path d="M205,84 q6,4 12,-1" fill="none" stroke="#9a86d8" stroke-width="2" stroke-linecap="round"/>
  </g>
  <path class="u-mane" d="M172,40 C152,38 140,58 146,76 C132,82 130,100 138,112 C128,118 130,132 142,140 C150,122 158,102 166,86 C172,72 178,56 188,44 Z" fill="url(#g-uni-mane)"/>
  <path d="M180,38 C168,42 166,54 173,60 C177,51 183,45 190,43 Z" fill="url(#g-uni-mane)"/>
  <g class="sparkle" fill="#fff">
    <path d="M216,18 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2Z"/>
    <path d="M224,44 l1.2,3.6 3.6,1.2 -3.6,1.2 -1.2,3.6 -1.2,-3.6 -3.6,-1.2 3.6,-1.2Z"/>
  </g>
</svg>`;

  // ---------- Ember the dragon ----------
  A.dragon = () => `
<svg class="char dragon" viewBox="0 0 240 220" aria-hidden="true">
  <g class="d-tail">
    <path d="M76,166 C46,180 20,164 20,136 C20,122 28,110 40,104" fill="none" stroke="#2f3488" stroke-width="18" stroke-linecap="round"/>
    <path d="M38,108 C26,96 32,78 48,70 C46,80 56,86 54,98 C53,104 46,110 38,108 Z" fill="url(#g-ember)" filter="url(#f-glow)"/>
  </g>
  <path class="d-wing-back" d="M104,104 C100,76 88,58 70,48 C76,62 76,70 74,78 C82,78 88,84 88,92 Z" fill="#4b3aa8"/>
  <ellipse cx="88" cy="186" rx="17" ry="10" fill="#1f2566"/>
  <ellipse cx="108" cy="142" rx="50" ry="45" fill="url(#g-dra-body)"/>
  <g fill="#9ff0ff" filter="url(#f-glow)">
    <path d="M58,134 L45,123 L63,120 Z"/><path d="M67,116 L57,100 L77,106 Z"/><path d="M83,103 L79,86 L95,98 Z"/>
  </g>
  <g class="d-wing">
    <path d="M96,106 C88,72 66,46 34,36 C44,52 46,62 44,72 C54,70 62,74 64,84 C72,82 80,88 80,98 Z" fill="url(#g-dra-wing)" stroke="#d8ccff" stroke-width="2" stroke-linejoin="round"/>
    <path d="M96,106 C80,80 60,58 34,36 M94,104 C76,88 60,76 44,72 M94,104 C84,94 74,86 64,84" fill="none" stroke="#efe9ff" stroke-opacity=".7" stroke-width="2"/>
  </g>
  <ellipse cx="126" cy="152" rx="28" ry="31" fill="url(#g-dra-belly)"/>
  <path d="M105,138 q21,8 42,0 M102,152 q24,9 48,0 M106,166 q20,8 40,0" fill="none" stroke="#e98a4f" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="136" cy="188" rx="19" ry="11" fill="#2b3388"/>
  <g fill="#f4e6ff"><circle cx="148" cy="194" r="3"/><circle cx="141" cy="196" r="3"/><circle cx="154" cy="190" r="3"/></g>
  <path d="M150,128 q16,6 12,22" fill="none" stroke="#3f46a8" stroke-width="11" stroke-linecap="round"/>
  <g class="d-head">
    <path d="M136,52 C128,34 116,26 102,24 C112,36 116,46 120,60 Z" fill="#efe2ff"/>
    <path d="M158,46 C160,30 154,18 144,10 C148,24 146,36 144,50 Z" fill="#efe2ff"/>
    <path d="M124,72 L104,62 L118,92 Z" fill="#8d7cf0"/>
    <circle cx="154" cy="80" r="36" fill="url(#g-dra-body)"/>
    <ellipse cx="186" cy="94" rx="25" ry="18" fill="url(#g-dra-snout)"/>
    <ellipse cx="201" cy="87" rx="2.6" ry="2" fill="#141845"/>
    <ellipse cx="191" cy="85" rx="2.2" ry="1.8" fill="#141845"/>
    <path d="M176,104 q12,7 24,0" fill="none" stroke="#141845" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M183,106 l3,5 3,-4 Z" fill="#fff"/>
    <ellipse cx="176" cy="94" rx="6" ry="3.5" fill="#ff9fc6" opacity=".45"/>
    <g fill="#9ff0ff" opacity=".85"><circle cx="134" cy="68" r="2.4"/><circle cx="130" cy="79" r="2"/><circle cx="138" cy="88" r="2.2"/></g>
    <g class="blink"><circle cx="163" cy="71" r="12.5" fill="url(#g-eye)" filter="url(#f-glow)"/><ellipse cx="165" cy="72" rx="3.6" ry="7" fill="#2a0f1a"/><circle cx="159" cy="65" r="3.2" fill="#fff"/></g>
  </g>
</svg>`;

  // ---------- counting objects (60 x 60) ----------
  const ITEMS = {
    orb: `<circle cx="30" cy="30" r="28" fill="url(#g-orb)"/><circle cx="30" cy="30" r="10" fill="#f4feff"/><circle cx="26.5" cy="26.5" r="3.5" fill="#fff"/>`,
    crystal: `<polygon points="30,4 45,20 38,56 22,56 15,20" fill="url(#g-crystal)" stroke="#e8fbff" stroke-width="1.5" stroke-linejoin="round"/><polygon points="30,4 15,20 30,27" fill="#fff" opacity=".4"/><path d="M15,20 L30,27 L45,20 M30,27 L30,56" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" fill="none"/>`,
    egg: `<path d="M30,5 C44,5 51,28 51,40 C51,52 42,58 30,58 C18,58 9,52 9,40 C9,28 16,5 30,5 Z" fill="url(#g-egg)" stroke="#d9ccff" stroke-width="1.5"/><g fill="#ffd27a"><circle cx="23" cy="27" r="3.4"/><circle cx="37" cy="38" r="4.2"/><circle cx="27" cy="47" r="2.6"/><circle cx="38" cy="21" r="2.2"/></g><ellipse cx="21" cy="20" rx="3.5" ry="7" fill="#fff" opacity=".45" transform="rotate(20 21 20)"/>`,
    mushroom: `<path d="M24,34 C24,46 22,52 19,57 L41,57 C38,52 36,46 36,34 Z" fill="#efe6ff"/><path d="M5,37 C5,18 18,7 30,7 C42,7 55,18 55,37 C46,32 14,32 5,37 Z" fill="url(#g-mush)" stroke="#d6fbff" stroke-width="1.5" stroke-linejoin="round"/><g fill="#fff"><circle cx="20" cy="20" r="3.4"/><circle cx="34" cy="15" r="2.6"/><circle cx="42" cy="26" r="3"/><circle cx="27" cy="28" r="2"/></g>`,
    star: `<path d="M30,4 L37.5,21.5 L56,23 L42,35.5 L46.5,54 L30,44 L13.5,54 L18,35.5 L4,23 L22.5,21.5 Z" fill="url(#g-star)" stroke="#fff6d8" stroke-width="2" stroke-linejoin="round"/><path d="M30,12 L33,22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
    shoe: `<path d="M13,8 L13,32 C13,47 21,55 30,55 C39,55 47,47 47,32 L47,8 L37,8 L37,32 C37,39 34,44 30,44 C26,44 23,39 23,32 L23,8 Z" fill="url(#g-shoe)" stroke="#fff" stroke-opacity=".8" stroke-width="1.5" stroke-linejoin="round"/><g fill="#5a4bb0"><circle cx="18" cy="16" r="1.8"/><circle cx="18" cy="28" r="1.8"/><circle cx="42" cy="16" r="1.8"/><circle cx="42" cy="28" r="1.8"/><circle cx="23" cy="43" r="1.8"/><circle cx="37" cy="43" r="1.8"/></g>`,
  };
  A.item = (k) => `<svg viewBox="0 0 60 60" aria-hidden="true">${ITEMS[k] || ITEMS.orb}</svg>`;

  // n objects laid out in fives and tens, the way children see them in class.
  A.objects = (k, n, o = {}) => {
    if (n === 0) return '<div class="objs zero"><span>0</span></div>';
    let h = `<div class="objs${n > 10 ? ' many' : n > 5 ? ' mid' : ''}${o.cls ? ' ' + o.cls : ''}">`;
    for (let t = 0; t < n; t += 10) {
      h += '<div class="ten">';
      for (let g = t; g < Math.min(n, t + 10); g += 5) {
        h += '<div class="five">';
        for (let i = g; i < Math.min(n, g + 5); i++) {
          const gone = o.fade && i >= n - o.fade;
          h += `<span class="obj${o.tap ? ' tap' : ''}${gone ? ' gone' : ''}" style="--d:${i * 35}ms">${A.item(k)}</span>`;
        }
        h += '</div>';
      }
      h += '</div>';
    }
    return h + '</div>';
  };

  // A ten frame (or two) with some slots filled.
  A.tenFrame = (k, filled, total) => {
    let h = '<div class="frames">';
    for (let f = 0; f < total; f += 10) {
      h += '<div class="tenframe">';
      for (let i = f; i < f + 10; i++) h += `<div class="slot">${i < filled ? `<span class="obj" style="--d:${i * 35}ms">${A.item(k)}</span>` : ''}</div>`;
      h += '</div>';
    }
    return h + '</div>';
  };

  // ---------- UK coins (relative sizes match the real coins) ----------
  const COINS = {
    1: { r: 33, m: 'cu', t: '1p' }, 2: { r: 43, m: 'cu', t: '2p' }, 5: { r: 30, m: 'ag', t: '5p' }, 10: { r: 40, m: 'ag', t: '10p' },
    20: { r: 35, m: 'ag', s: 7, t: '20p' }, 50: { r: 45, m: 'ag', s: 7, t: '50p' }, 100: { r: 39, m: 'au', s: 12, t: '£1', inner: 'ag' }, 200: { r: 47, m: 'au', t: '£2', inner: 'ag' },
  };
  const poly = (sides, r, cx = 50, cy = 50) => {
    let p = [];
    for (let i = 0; i < sides; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides; p.push(`${f1(cx + r * Math.cos(a))},${f1(cy + r * Math.sin(a))}`); }
    return p.join(' ');
  };
  const shapeAt = (c, r, fill, extra) => c.s ? `<polygon points="${poly(c.s, r)}" fill="${fill}" ${extra || ''} stroke-linejoin="round"/>` : `<circle cx="50" cy="50" r="${r}" fill="${fill}" ${extra || ''}/>`;
  A.coin = (v) => {
    const c = COINS[v];
    const ink = c.m === 'cu' ? '#5a2a10' : c.m === 'au' ? '#5a3d00' : '#3b3f58';
    let s = `<svg class="coin" viewBox="0 0 100 100" aria-hidden="true">`;
    s += shapeAt(c, c.r, `url(#g-${c.m})`, 'stroke="rgba(0,0,0,.25)" stroke-width="1.5"');
    if (c.inner) s += shapeAt(c, c.r * 0.66, 'url(#g-ag)');
    s += shapeAt(c, c.r * 0.84, 'none', `stroke="${ink}" stroke-opacity=".35" stroke-width="1.5"`);
    s += `<text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-size="${f1(c.r * (c.t.length > 2 ? 0.62 : 0.78))}" font-weight="800" fill="${ink}" font-family="ui-rounded, system-ui, sans-serif">${c.t}</text>`;
    return s + '</svg>';
  };
  A.coinName = (v) => COINS[v].t;

  // ---------- clock ----------
  A.clock = (h, m) => {
    let s = `<svg class="clock" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="95" fill="#1d1550" stroke="#9fe8ff" stroke-width="5" filter="url(#f-glow)"/><circle cx="100" cy="100" r="86" fill="url(#g-face)"/>`;
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 * Math.PI) / 180, big = i % 5 === 0, r1 = big ? 76 : 80;
      s += `<line x1="${f1(100 + r1 * Math.sin(a))}" y1="${f1(100 - r1 * Math.cos(a))}" x2="${f1(100 + 84 * Math.sin(a))}" y2="${f1(100 - 84 * Math.cos(a))}" stroke="#7a6ab8" stroke-width="${big ? 2.5 : 1}"/>`;
    }
    for (let k = 1; k <= 12; k++) {
      const a = (k * 30 * Math.PI) / 180;
      s += `<text x="${f1(100 + 62 * Math.sin(a))}" y="${f1(100 - 62 * Math.cos(a))}" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="800" fill="#2a1b5e" font-family="ui-rounded, system-ui, sans-serif">${k}</text>`;
    }
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    s += `<line x1="100" y1="100" x2="100" y2="58" stroke="#3a2a7a" stroke-width="9" stroke-linecap="round" transform="rotate(${ha} 100 100)"/>`;
    s += `<line x1="100" y1="100" x2="100" y2="30" stroke="#ff8a5c" stroke-width="5.5" stroke-linecap="round" transform="rotate(${ma} 100 100)"/>`;
    return s + `<circle cx="100" cy="100" r="7" fill="#2a1b5e"/><circle cx="100" cy="100" r="3" fill="#ffd27a"/></svg>`;
  };

  // ---------- fractions: a shape cut into parts with one shaded ----------
  const rectD = (x, y, w, h) => `M${f1(x)},${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
  A.frac = (shape, parts, equal) => {
    const regions = [];
    if (shape === 'circle') {
      const angs = equal ? Array(parts).fill(360 / parts) : parts === 2 ? [125, 235] : [45, 115, 80, 120];
      let a0 = -90 + (equal && Math.random() < 0.5 ? 360 / parts / 2 : 0);
      const pt = (a) => `${f1(60 + 50 * Math.cos((a * Math.PI) / 180))},${f1(60 + 50 * Math.sin((a * Math.PI) / 180))}`;
      for (const da of angs) { const a1 = a0 + da; regions.push(`M60,60L${pt(a0)}A50,50 0 ${da > 180 ? 1 : 0} 1 ${pt(a1)}Z`); a0 = a1; }
    } else {
      const [x, y, w, h] = shape === 'square' ? [15, 15, 90, 90] : [6, 30, 108, 60];
      const strips = (fr) => { let cx = x; for (const p of fr) { regions.push(rectD(cx, y, w * p, h)); cx += w * p; } };
      if (!equal) strips(parts === 2 ? [0.3, 0.7] : [0.12, 0.2, 0.3, 0.38]);
      else if (parts === 2) {
        const mode = pickOne(shape === 'square' ? ['v', 'h', 'd'] : ['v', 'h']);
        if (mode === 'v') strips([0.5, 0.5]);
        else if (mode === 'h') { regions.push(rectD(x, y, w, h / 2)); regions.push(rectD(x, y + h / 2, w, h / 2)); }
        else { regions.push(`M${x},${y}L${x + w},${y}L${x + w},${y + h}Z`); regions.push(`M${x},${y}L${x},${y + h}L${x + w},${y + h}Z`); }
      } else {
        const mode = pickOne(shape === 'square' ? ['grid', 'strips', 'x'] : ['grid', 'strips']);
        if (mode === 'strips') strips([0.25, 0.25, 0.25, 0.25]);
        else if (mode === 'grid') { for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) regions.push(rectD(x + (i * w) / 2, y + (j * h) / 2, w / 2, h / 2)); }
        else { const c = `${x + w / 2},${y + h / 2}`; regions.push(`M${c}L${x},${y}L${x + w},${y}Z`, `M${c}L${x + w},${y}L${x + w},${y + h}Z`, `M${c}L${x + w},${y + h}L${x},${y + h}Z`, `M${c}L${x},${y + h}L${x},${y}Z`); }
      }
    }
    const shaded = equal ? Math.floor(Math.random() * regions.length) : 0;
    return `<svg class="frac" viewBox="0 0 120 120" aria-hidden="true">${regions.map((d, k) => `<path d="${d}" fill="${k === shaded ? 'url(#g-frac)' : '#2a2070'}" stroke="#efeaff" stroke-width="3" stroke-linejoin="round"/>`).join('')}</svg>`;
  };
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ---------- 2D and 3D shapes ----------
  const HUES = [['#a8f4ff', '#62c8f0', '#3a8fc4'], ['#d4c2ff', '#a18aff', '#6f56d8'], ['#ffc4e4', '#ff8fc8', '#d85a9e'], ['#ffe3a0', '#ffc45c', '#d9902c'], ['#b8ffdc', '#6fe0ae', '#38a87a']];
  A.shape = (name) => {
    const [lt, md, dk] = pickOne(HUES);
    const rot = Math.round((Math.random() - 0.5) * 40);
    const st = 'stroke="#fff" stroke-width="3" stroke-linejoin="round"';
    let b = '';
    switch (name) {
      case 'circle': b = `<circle cx="60" cy="60" r="42" fill="${md}" ${st}/>`; break;
      case 'triangle': {
        const t = pickOne(['60,16 104,96 16,96', '22,20 22,98 100,98', '60,12 90,100 30,100', '18,94 102,94 40,24']);
        b = `<g transform="rotate(${rot} 60 60)"><polygon points="${t}" fill="${md}" ${st}/></g>`; break;
      }
      case 'square': b = `<g transform="rotate(${rot} 60 60)"><rect x="24" y="24" width="72" height="72" rx="3" fill="${md}" ${st}/></g>`; break;
      case 'rectangle': b = Math.random() < 0.5
        ? `<g transform="rotate(${Math.round(rot / 3)} 60 60)"><rect x="8" y="36" width="104" height="48" rx="3" fill="${md}" ${st}/></g>`
        : `<g transform="rotate(${Math.round(rot / 3)} 60 60)"><rect x="36" y="8" width="48" height="104" rx="3" fill="${md}" ${st}/></g>`; break;
      case 'cube': b = `<polygon points="20,45 75,45 75,100 20,100" fill="${md}" ${st}/><polygon points="20,45 45,22 100,22 75,45" fill="${lt}" ${st}/><polygon points="75,45 100,22 100,77 75,100" fill="${dk}" ${st}/>`; break;
      case 'cuboid': b = `<polygon points="6,58 86,58 86,98 6,98" fill="${md}" ${st}/><polygon points="6,58 32,36 112,36 86,58" fill="${lt}" ${st}/><polygon points="86,58 112,36 112,76 86,98" fill="${dk}" ${st}/>`; break;
      case 'sphere': b = `<circle cx="60" cy="60" r="44" fill="${md}"/><circle cx="60" cy="60" r="44" fill="url(#g-sphere)"/><ellipse cx="60" cy="60" rx="44" ry="12" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 5"/><circle cx="60" cy="60" r="44" fill="none" ${st}/>`; break;
      case 'pyramid': b = `<polygon points="60,10 16,90 76,106" fill="${md}" ${st}/><polygon points="60,10 76,106 106,84" fill="${dk}" ${st}/>`; break;
      case 'cylinder': b = `<path d="M28,30 L28,94 A32,11 0 0 0 92,94 L92,30 Z" fill="${md}" ${st}/><ellipse cx="60" cy="30" rx="32" ry="11" fill="${lt}" ${st}/>`; break;
      case 'cone': b = `<path d="M24,96 L60,10 L96,96 A36,11 0 0 1 24,96 Z" fill="${md}" ${st}/><path d="M24,96 A36,11 0 0 1 96,96" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="5 4"/>`; break;
    }
    return `<svg class="shape" viewBox="0 0 120 120" aria-hidden="true">${b}</svg>`;
  };

  // ---------- little UI icons ----------
  const ic = (p) => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const sk = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  A.icon = {
    home: ic(`<path d="M3.5 11 L12 3.8 L20.5 11 M6 9.6 V20 H10 V14.5 H14 V20 H18 V9.6" ${sk}/>`),
    map: ic(`<path d="M3.5 6.5 L9 4 L15 6.5 L20.5 4 V17.5 L15 20 L9 17.5 L3.5 20 Z M9 4 V17.5 M15 6.5 V20" ${sk}/>`),
    speak: ic(`<path d="M4 9.5 H7.5 L12.5 5.5 V18.5 L7.5 14.5 H4 Z" fill="currentColor"/><path d="M15.5 9 C17 10.6 17 13.4 15.5 15 M18 6.5 C21.2 9.6 21.2 14.4 18 17.5" ${sk}/>`),
    note: ic(`<path d="M9 17.5 V6 L19 4 V15.5" ${sk}/><circle cx="6.6" cy="17.6" r="2.6" fill="currentColor"/><circle cx="16.6" cy="15.6" r="2.6" fill="currentColor"/>`),
    off: ic(`<path d="M4 4 L20 20" ${sk}/>`),
  };
  A.star = (on) => `<svg viewBox="0 0 60 60" class="star${on ? ' on' : ''}" aria-hidden="true"><path d="M30,4 L37.5,21.5 L56,23 L42,35.5 L46.5,54 L30,44 L13.5,54 L18,35.5 L4,23 L22.5,21.5 Z" fill="${on ? 'url(#g-star)' : 'rgba(255,255,255,.08)'}" stroke="${on ? '#fff6d8' : 'rgba(220,220,255,.45)'}" stroke-width="3" stroke-linejoin="round"/></svg>`;
  A.arrow = (label) => `<div class="arrow"><svg viewBox="0 0 60 30" aria-hidden="true"><path d="M4 15 H50 M40 5 L52 15 L40 25" fill="none" stroke="#ffd27a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><small>${label}</small></div>`;
})((window.IZ = window.IZ || {}));
