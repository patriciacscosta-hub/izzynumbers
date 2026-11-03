/* Izzy's Numbers - chimes made with Web Audio, and a British voice to read questions aloud. */
(function (IZ) {
  'use strict';
  const S = (IZ.sound = { enabled: true, voice: true });
  let ctx = null, master = null;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(f, at, dur, vol, type) {
    const c = ac();
    if (!c || !S.enabled) return;
    const t0 = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  // A soft glassy bell: fundamental plus two quiet overtones.
  function bell(f, at, dur, vol) {
    tone(f, at, dur, vol);
    tone(f * 2.01, at, dur * 0.6, vol * 0.25);
    tone(f * 3, at, dur * 0.3, vol * 0.08, 'triangle');
  }

  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98, 1760];
  S.tap = () => bell(880, 0, 0.15, 0.06);
  S.count = (n) => bell(PENTA[(n - 1) % PENTA.length], 0, 0.6, 0.13);
  S.correct = () => [659.25, 783.99, 987.77, 1318.5].forEach((f, i) => bell(f, i * 0.075, 0.9, 0.16));
  S.wrong = () => { tone(311, 0, 0.35, 0.1, 'triangle'); tone(262, 0.14, 0.45, 0.08, 'triangle'); };
  S.win = () => [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => bell(f, i * 0.12, 1.2, 0.15));

  // iPad only allows sound and speech after a tap, so the first tap calls this.
  S.unlock = () => {
    ac();
    if ('speechSynthesis' in window) {
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
    }
  };

  let voices = [];
  const loadVoices = () => { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } };
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function voice() {
    const gb = voices.filter((v) => /en[-_]GB/i.test(v.lang));
    for (const name of ['Serena', 'Kate', 'Stephanie', 'Martha', 'Google UK English Female', 'Daniel']) {
      const v = gb.find((x) => x.name.includes(name));
      if (v) return v;
    }
    return gb[0] || voices.find((v) => /^en/i.test(v.lang)) || null;
  }

  S.say = (text) => {
    if (!S.voice || !text || !('speechSynthesis' in window)) return;
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      u.rate = 0.88;
      u.pitch = 1.12;
      const v = voice();
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* speech is a nice-to-have */ }
  };
  S.hush = () => { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
})((window.IZ = window.IZ || {}));
