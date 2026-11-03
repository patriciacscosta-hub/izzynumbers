/* Izzy's Numbers - screens, game flow and saved progress. */
(function (IZ) {
  'use strict';
  const A = IZ.art, S = IZ.sound, FX = IZ.fx, REALMS = IZ.realms;
  const ROUNDS = 8;
  const KEY = 'izzy-numbers-v1';
  const $ = (s) => document.querySelector(s);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  const FRIENDS = { unicorn: { name: 'Luma', art: A.unicorn }, dragon: { name: 'Ember', art: A.dragon } };
  const PRAISE = ['Brilliant!', 'You did it!', 'Super counting!', 'Amazing!', 'Well done!', 'Fantastic!', 'Wow, clever you!', 'Sparkling!'];
  const NEARLY = ['Nearly! Have another go.', 'Ooh, not quite. Try again!', 'Good try! Look again.'];

  // ---------- saved progress ----------
  const st = Object.assign({ companion: 'unicorn', stars: {}, sound: true, voice: true }, load());
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private mode etc. */ } }

  // ---------- screens ----------
  const screens = ['title', 'map', 'play', 'win'];
  function show(name) {
    for (const s of screens) $('#' + s).classList.toggle('on', s === name);
    if (name !== 'play') S.hush();
  }

  function friend() { return FRIENDS[st.companion]; }
  function other() { return FRIENDS[st.companion === 'unicorn' ? 'dragon' : 'unicorn']; }

  // ---------- title ----------
  function renderTitle() {
    $('#pick-unicorn').innerHTML = A.unicorn();
    $('#pick-dragon').innerHTML = A.dragon();
    document.querySelectorAll('.pal').forEach((b) => b.classList.toggle('sel', b.dataset.c === st.companion));
    renderToggles();
  }
  function renderToggles() {
    const t = (el, on, icon, label) => { el.innerHTML = `${icon}${on ? '' : `<span class="slash">${A.icon.off}</span>`}<span>${label}</span>`; el.setAttribute('aria-pressed', on); el.classList.toggle('off', !on); };
    t($('#t-sound'), st.sound, A.icon.note, 'Sounds');
    t($('#t-voice'), st.voice, A.icon.speak, 'Read aloud');
    S.enabled = st.sound; S.voice = st.voice;
  }

  // ---------- world map ----------
  // Where each place sits on the 2000 x 800 world picture. The first seven are in Unicorn Meadows.
  const SPOTS = {
    count: [120, 545], words: [280, 430], more: [430, 555], path: [570, 400], compare: [720, 545], bonds: [830, 320], add: [960, 525],
    take: [1110, 360], missing: [1250, 545], skip: [1390, 360], frac: [1530, 555], shapes: [1650, 330], time: [1800, 530], money: [1910, 300],
  };
  const MAX_STARS = REALMS.length * 3;
  const totalStars = () => REALMS.reduce((a, r) => a + (st.stars[r.id] || 0), 0);

  function renderMap() {
    const total = totalStars();
    $('#total').innerHTML = `${A.star(true)}<span>${total}</span>`;
    $('#journey').innerHTML = journey(total);

    const next = REALMS.find((r) => !st.stars[r.id]) || REALMS.find((r) => st.stars[r.id] < 3);
    const world = $('#world');
    world.innerHTML = A.world(REALMS.map((r) => SPOTS[r.id])) + REALMS.map((r, k) => {
      const s = st.stars[r.id] || 0, [x, y] = SPOTS[r.id];
      return `<button class="node${k >= 7 ? ' warm' : ''}${s ? ' done' : ''}${r === next ? ' next' : ''}" data-id="${r.id}"
          style="left:${x / 20}%;top:${y / 8}%;--d:${k * 50}ms" aria-label="${r.name}: ${r.sub}. ${s} stars.">
        ${r === next ? `<div class="here">${friend().art()}</div>` : ''}
        <div class="node-disc">${r.pic ? r.pic() : `<span class="glyph">${r.glyph}</span>`}</div>
        <div class="node-name">${r.name}</div>
        <div class="stars">${[1, 2, 3].map((n) => A.star(n <= s)).join('')}</div></button>`;
    }).join('');
    sizeWorld();
    // Scroll so the companion's next place is in view.
    if (next) {
      const wrap = $('#world-wrap');
      wrap.scrollLeft = Math.max(0, (SPOTS[next.id][0] / 2000) * world.offsetWidth - wrap.clientWidth / 2);
    }
  }
  // The big journey bar: every star moves your unicorn or dragon closer to the Star Gate.
  function journey(total) {
    const pct = Math.round((total / MAX_STARS) * 100);
    return `<div class="jr-label">${total >= MAX_STARS ? `${friend().name} reached the Star Gate!` : `Help ${friend().name} reach the Star Gate`}</div>
      <div class="jr-track"><div class="jr-fill" style="width:${pct}%"></div>
        <div class="jr-runner" style="left:${pct}%">${friend().art()}</div>
        <div class="jr-gate">${A.star(total >= MAX_STARS)}</div></div>`;
  }
  function sizeWorld() {
    const world = $('#world');
    world.style.width = `${Math.round($('#world-wrap').clientHeight * 2.5)}px`;
  }

  // ---------- play ----------
  let cur = null;
  function startRealm(id) {
    const realm = REALMS.find((r) => r.id === id);
    cur = { realm, i: 0, mistakes: 0 };
    $('#buddy').innerHTML = friend().art();
    // The question track: your friend runs along it towards the star, one step per right answer.
    $('#progress').innerHTML = `<div class="run-track"><div class="run-fill"></div>
      ${Array.from({ length: ROUNDS }, (_, k) => `<span class="pip" style="left:${(k / ROUNDS) * 100}%"></span>`).join('')}
      <div class="runner">${friend().art()}</div><div class="run-goal">${A.star(true)}</div></div>`;
    show('play');
    bubble(`Let's explore ${realm.name}!`);
    nextQuestion();
  }

  function renderProgress() {
    const pct = (cur.i / ROUNDS) * 100;
    $('#progress .run-fill').style.width = `${pct}%`;
    $('#progress .runner').style.left = `${pct}%`;
    $('#progress').querySelectorAll('.pip').forEach((p, k) => { p.classList.toggle('done', k < cur.i); p.classList.toggle('now', k === cur.i); });
  }

  function nextQuestion() {
    const q = cur.realm.gen(cur.i, `${friend().name} and ${other().name}`);
    Object.assign(cur, { q, tries: 0, missed: false, locked: false });
    renderProgress();
    $('#prompt').textContent = q.prompt;
    const big = $('#big'), vis = $('#visual');
    big.innerHTML = q.big || ''; big.hidden = !q.big;
    vis.innerHTML = q.visual || ''; vis.hidden = !q.visual;
    const panel = $('#panel');
    panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter');

    // Picture answers with nothing else to show get most of the screen.
    $('#play').classList.toggle('pics', !!q.pics && !q.visual);
    const box = $('#choices');
    box.className = 'choices' + (q.pics ? ' pics' : '') + (q.words ? ' words' : '') + ` n${q.choices.length}`;
    box.innerHTML = '';
    q.choices.forEach((c, k) => {
      const b = document.createElement('button');
      b.className = 'choice' + (c.cls ? ' ' + c.cls : '');
      b.style.setProperty('--d', `${k * 70}ms`);
      b.innerHTML = c.html || `<span>${c.label}</span>`;
      if (!c.label) b.setAttribute('aria-label', `Choice ${k + 1}`);
      b.addEventListener('click', () => choose(b, c));
      box.appendChild(b);
    });
    setTimeout(() => cur && cur.q === q && S.say(q.say || q.prompt), 450);
  }

  function choose(btn, c) {
    if (!cur || cur.locked || btn.disabled) return;
    if (c.value === cur.q.answer) {
      cur.locked = true;
      btn.classList.add('right');
      S.correct();
      FX.burstEl(btn);
      mood('happy');
      const p = pick(PRAISE);
      bubble(p); S.say(p);
      cur.i++;
      renderProgress();
      setTimeout(() => (cur.i >= ROUNDS ? finish() : nextQuestion()), 1500);
      return;
    }
    btn.classList.add('wrong');
    btn.disabled = true;
    S.wrong();
    mood('think');
    cur.tries++;
    if (!cur.missed) { cur.missed = true; cur.mistakes++; }
    if (cur.tries >= 2) {
      // After two tries, gently show the answer so nobody gets stuck.
      const k = cur.q.choices.findIndex((x) => x.value === cur.q.answer);
      $('#choices').children[k].classList.add('reveal');
      const m = 'Here it is! Tap the glowing one.';
      bubble(m); S.say(m);
    } else {
      const m = pick(NEARLY);
      bubble(m); S.say(m);
    }
  }

  function finish() {
    const stars = cur.mistakes <= 1 ? 3 : cur.mistakes <= 3 ? 2 : 1;
    const id = cur.realm.id;
    const before = totalStars();
    st.stars[id] = Math.max(st.stars[id] || 0, stars);
    save();
    const after = totalStars();
    // Show the journey bar where it was, then walk your friend forward to the new spot.
    $('#win-journey').innerHTML = journey(before);
    setTimeout(() => {
      const p = `${Math.round((after / MAX_STARS) * 100)}%`;
      $('#win-journey .jr-fill').style.width = p;
      $('#win-journey .jr-runner').style.left = p;
    }, 1200);
    $('#win-title').textContent = stars === 3 ? 'Wonderful, Izzy!' : stars === 2 ? 'Great job, Izzy!' : 'You did it, Izzy!';
    $('#win-a').innerHTML = A.unicorn();
    $('#win-b').innerHTML = A.dragon();
    $('#win-stars').innerHTML = [1, 2, 3].map((n) => `<span style="--d:${n * 260}ms">${A.star(n <= stars)}</span>`).join('');
    show('win');
    S.win();
    const say = `You found ${stars} ${stars === 1 ? 'star' : 'stars'} in ${cur.realm.name}! Luma and Ember are so proud of you.`;
    setTimeout(() => S.say(say), 900);
    [0, 350, 700].forEach((t) => setTimeout(() => FX.burst(innerWidth * (0.3 + Math.random() * 0.4), innerHeight * (0.3 + Math.random() * 0.2), 40), t));
  }

  // ---------- companion reactions ----------
  let bubbleTimer;
  function bubble(text) {
    const b = $('#bubble');
    b.textContent = text;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => b.classList.remove('show'), 3200);
  }
  let moodTimer;
  function mood(m) {
    const w = $('#buddy-wrap');
    w.classList.remove('happy', 'think'); void w.offsetWidth; w.classList.add(m);
    clearTimeout(moodTimer);
    moodTimer = setTimeout(() => w.classList.remove(m), 1000);
  }

  // ---------- wiring ----------
  function init() {
    document.body.insertAdjacentHTML('afterbegin', A.defs);
    $('#bg').innerHTML = A.scene();
    FX.init();
    $('#map-home').innerHTML = A.icon.home;
    $('#play-map').innerHTML = A.icon.map;
    $('#play-say').innerHTML = A.icon.speak;
    renderTitle();

    // iPad needs a tap before it will play any sound.
    const unlock = () => { S.unlock(); removeEventListener('pointerdown', unlock); };
    addEventListener('pointerdown', unlock);

    document.querySelectorAll('.pal').forEach((b) => b.addEventListener('click', () => {
      st.companion = b.dataset.c; save(); renderTitle(); S.tap();
      FX.burstEl(b, 20);
      S.say(b.dataset.c === 'unicorn' ? 'Hello! I am Luma the unicorn.' : 'Hello! I am Ember the dragon.');
    }));
    $('#go-btn').addEventListener('click', () => { S.tap(); renderMap(); show('map'); S.say('Where shall we explore?'); });
    $('#t-sound').addEventListener('click', () => { st.sound = !st.sound; save(); renderToggles(); S.tap(); });
    $('#t-voice').addEventListener('click', () => { st.voice = !st.voice; save(); renderToggles(); if (!st.voice) S.hush(); });
    $('#map-home').addEventListener('click', () => { S.tap(); renderTitle(); show('title'); });
    $('#world').addEventListener('click', (e) => { const r = e.target.closest('.node'); if (r) { S.tap(); startRealm(r.dataset.id); } });
    document.querySelectorAll('.land').forEach((b) => b.addEventListener('click', () => {
      const wrap = $('#world-wrap');
      wrap.scrollTo({ left: b.dataset.land === 'start' ? 0 : wrap.scrollWidth, behavior: 'smooth' });
      S.tap();
      S.say(b.dataset.land === 'start' ? 'Unicorn Meadows' : 'Dragon Peaks');
    }));
    addEventListener('resize', () => { if ($('#map').classList.contains('on')) renderMap(); });
    $('#play-map').addEventListener('click', () => { S.tap(); cur = null; renderMap(); show('map'); });
    $('#play-say').addEventListener('click', () => cur && S.say(cur.q.say || cur.q.prompt));
    $('#win-again').addEventListener('click', () => { S.tap(); startRealm(cur.realm.id); });
    $('#win-map').addEventListener('click', () => { S.tap(); cur = null; renderMap(); show('map'); });

    // Tapping objects lights them up, to help with one-to-one counting.
    $('#visual').addEventListener('click', (e) => {
      const o = e.target.closest('.obj.tap');
      if (!o) return;
      o.classList.toggle('counted');
      if (o.classList.contains('counted')) S.count($('#visual').querySelectorAll('.obj.counted').length);
    });

    // Stop iPad pinch-zoom and double-tap zoom from interrupting play.
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => e.preventDefault());

    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  init();
  // Handy for grown-ups testing from the console: IZ.game.jump('money', 6)
  IZ.game = { jump(id, i) { startRealm(id); cur.i = i; nextQuestion(); } };
})((window.IZ = window.IZ || {}));
