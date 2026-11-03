/* Izzy's Numbers - drifting spirit lights in the background, and sparkle bursts for right answers. */
(function (IZ) {
  'use strict';
  const fx = (IZ.fx = {});
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const COLS = ['rgba(143,233,255,.85)', 'rgba(255,214,140,.85)', 'rgba(255,170,220,.8)', 'rgba(196,170,255,.85)'];

  function sprite(color) {
    const s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.18, color);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, s, s);
    return c;
  }
  const sprites = COLS.map(sprite);

  function fit(cv) {
    cv.width = Math.round(innerWidth * DPR);
    cv.height = Math.round(innerHeight * DPR);
    const g = cv.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    return g;
  }

  // ---------- fireflies ----------
  let fc, fg, flies = [];
  function makeFly(anywhere) {
    return {
      x: Math.random() * innerWidth,
      y: anywhere ? Math.random() * innerHeight : innerHeight + 20,
      s: 10 + Math.random() * 22,
      vy: -(0.12 + Math.random() * 0.35),
      ph: Math.random() * 6.28,
      w: 0.4 + Math.random() * 0.9,
      img: sprites[Math.random() < 0.6 ? 0 : Math.floor(Math.random() * sprites.length)],
    };
  }
  function flyLoop(t) {
    requestAnimationFrame(flyLoop);
    if (document.hidden) return;
    fg.clearRect(0, 0, innerWidth, innerHeight);
    const k = t / 1000;
    for (const f of flies) {
      f.y += f.vy;
      f.x += Math.sin(k * f.w + f.ph) * 0.35;
      if (f.y < -30) Object.assign(f, makeFly(false));
      fg.globalAlpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(k * 1.6 * f.w + f.ph));
      fg.drawImage(f.img, f.x - f.s / 2, f.y - f.s / 2, f.s, f.s);
    }
  }

  // ---------- bursts ----------
  let bc, bg, parts = [], running = false;
  function burstLoop() {
    bg.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => (p.life -= 0.016) > 0);
    for (const p of parts) {
      p.vx *= 0.96; p.vy = p.vy * 0.96 - 0.03;
      p.x += p.vx; p.y += p.vy;
      bg.globalAlpha = Math.min(1, p.life * 1.6);
      const s = p.s * (0.6 + p.life * 0.5);
      bg.drawImage(p.img, p.x - s / 2, p.y - s / 2, s, s);
    }
    if (parts.length) requestAnimationFrame(burstLoop);
    else { running = false; bg.clearRect(0, 0, innerWidth, innerHeight); }
  }
  fx.burst = (x, y, n = 34) => {
    if (calm) n = Math.round(n / 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 6;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, s: 14 + Math.random() * 26, life: 0.7 + Math.random() * 0.7, img: sprites[i % sprites.length] });
    }
    if (!running) { running = true; requestAnimationFrame(burstLoop); }
  };
  fx.burstEl = (el, n) => {
    const r = el.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, n);
  };

  fx.init = () => {
    fc = document.getElementById('flies');
    bc = document.getElementById('fx');
    fg = fit(fc); bg = fit(bc);
    const count = calm ? 10 : Math.round(Math.min(46, (innerWidth * innerHeight) / 22000));
    flies = Array.from({ length: count }, () => makeFly(true));
    addEventListener('resize', () => { fg = fit(fc); bg = fit(bc); });
    if (!calm) requestAnimationFrame(flyLoop);
    else { flyLoop(0); }
  };
})((window.IZ = window.IZ || {}));
