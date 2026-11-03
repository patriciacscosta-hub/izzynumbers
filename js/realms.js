/* Izzy's Numbers - question makers, one "realm" per Year 1 National Curriculum strand.
   Each gen(i) gets the question number (0-7) so questions get a little harder as you go. */
(function (IZ) {
  'use strict';
  const A = IZ.art;
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const IT = [
    { k: 'orb', many: 'glow orbs' }, { k: 'crystal', many: 'crystals' }, { k: 'egg', many: 'dragon eggs' },
    { k: 'mushroom', many: 'mushrooms' }, { k: 'star', many: 'stars' }, { k: 'shoe', many: 'unicorn horseshoes' },
  ];
  const howMany = (i) => (i < 3 ? 3 : 4);

  // Number choices: the answer plus "near misses" children typically make, shown smallest first.
  function nums(ans, n, min, max, offs) {
    const set = new Set([ans]);
    for (const o of offs || shuffle([-1, 1, -2, 2, 3, -3])) {
      if (set.size >= n) break;
      const v = ans + o;
      if (v >= min && v <= max) set.add(v);
    }
    for (let g = 0; set.size < n && g < 200; g++) set.add(R(min, max));
    return [...set].sort((a, b) => a - b).map((v) => ({ label: String(v), value: v }));
  }
  const eq = (t) => t.map((x) => (x === '?' ? '<span class="q">?</span>' : `<span>${x}</span>`)).join('');
  const eqSay = (t) => t.map((x, k) => ({ '+': 'add', '−': 'take away', '=': k === 1 ? 'is the same as' : 'equals', '?': 'what' }[x] || String(x))).join(' ');
  const stones = (vals, gap) => `<div class="track">${vals.map((v, k) => `<div class="stone${k === gap ? ' q' : ''}">${k === gap ? '?' : v}</div>`).join('')}</div>`;

  const realms = [
    {
      id: 'count', name: 'Glow-Orb Glade', sub: 'Counting to 20', pic: () => A.item('orb'),
      gen(i) {
        const n = i < 3 ? R(1, 10) : i < 6 ? R(6, 15) : R(11, 20);
        const it = pick(IT);
        return {
          prompt: `How many ${it.many}?`, say: `How many ${it.many} can you count? You can tap them to help you.`,
          visual: A.objects(it.k, n, { tap: true }), choices: nums(n, howMany(i), 1, 20), answer: n,
        };
      },
    },
    {
      id: 'words', name: 'Whispering Words', sub: 'Number words to twenty', glyph: 'five',
      gen(i) {
        const n = R(i < 3 ? 1 : 0, i < 3 ? 10 : 20);
        const vals = [n];
        for (const o of [10, -10, 1, -1, 2, -2]) { const v = n + o; if (v >= 0 && v <= 20 && vals.length < howMany(i)) vals.push(v); }
        if (Math.random() < 0.5) {
          return { prompt: 'Which word matches this number?', say: 'Which word matches this number?', big: `<span>${n}</span>`, choices: shuffle(vals).map((v) => ({ label: WORDS[v], value: v })), answer: n, words: true };
        }
        return { prompt: 'Which number is this word?', say: 'Read the word. Which number is it?', visual: `<div class="word-big">${WORDS[n]}</div>`, choices: vals.sort((a, b) => a - b).map((v) => ({ label: String(v), value: v })), answer: n };
      },
    },
    {
      id: 'more', name: 'Stepping Stones', sub: 'One more and one less', glyph: '±1',
      gen(i) {
        const max = i < 3 ? 20 : i < 6 ? 50 : 100;
        const more = Math.random() < 0.5;
        let n = R(more ? 0 : 1, more ? max - 1 : max);
        if (i >= 4 && Math.random() < 0.5) { const t = R(1, max / 10); n = more ? t * 10 - 1 : t * 10; } // cross a tens boundary
        const ans = more ? n + 1 : n - 1;
        const set = [ans, n, more ? n - 1 : n + 1, more ? ans + 1 : ans - 1, more ? ans + 10 : ans - 10].filter((v, k, a) => v >= 0 && v <= 100 && a.indexOf(v) === k);
        const word = more ? 'more' : 'less';
        const visual = `<div class="track">${more
          ? `<div class="stone hi">${n}</div>${A.arrow('one more')}<div class="stone q">?</div>`
          : `<div class="stone q">?</div>${A.arrow('one less').replace('class="arrow"', 'class="arrow back"')}<div class="stone hi">${n}</div>`}</div>`;
        return {
          prompt: `What is one ${word} than ${n}?`, say: `What is one ${word} than ${n}?`, visual,
          choices: set.slice(0, howMany(i)).sort((a, b) => a - b).map((v) => ({ label: String(v), value: v })), answer: ans,
        };
      },
    },
    {
      id: 'path', name: 'Number River', sub: 'Counting to 100, forwards and back', glyph: '100',
      gen(i) {
        const max = i < 2 ? 20 : i < 5 ? 50 : 100;
        const back = i >= 3 && Math.random() < 0.5;
        let start;
        if (i >= 3 && Math.random() < 0.6) { const t = R(1, Math.floor((max - 3) / 10)); start = back ? t * 10 + R(1, 3) : t * 10 - R(1, 3); }
        else start = back ? R(4, max) : R(0, max - 4);
        const seq = [0, 1, 2, 3, 4].map((k) => start + (back ? -k : k));
        const gap = R(1, 4), ans = seq[gap];
        return {
          prompt: back ? 'Counting backwards. Which number is missing?' : 'Which number is missing?',
          say: (back ? 'Counting backwards. ' : '') + seq.map((v, k) => (k === gap ? 'what' : v)).join(', ') + '?',
          visual: stones(seq, gap), choices: nums(ans, howMany(i), 0, 100, shuffle([1, -1, 10, -10, 2])), answer: ans,
        };
      },
    },
    {
      id: 'compare', name: 'Balance Rocks', sub: 'More, fewer, most and least', glyph: 'more?',
      gen(i) {
        if (i < 3 || (i < 5 && Math.random() < 0.4)) {
          const it = pick(IT), fewer = i >= 1 && Math.random() < 0.5, same = i >= 2 && Math.random() < 0.25;
          const a = R(1, 10);
          let b = same ? a : R(1, 10);
          while (!same && b === a) b = R(1, 10);
          const ans = a === b ? 'S' : (fewer ? a < b : a > b) ? 'L' : 'R';
          const ch = [{ html: A.objects(it.k, a), value: 'L' }, { html: A.objects(it.k, b), value: 'R' }];
          if (i >= 2) ch.push({ label: 'The same', value: 'S', cls: 'same' });
          const q = `Which group has ${fewer ? 'fewer' : 'more'} ${it.many}?` + (i >= 2 ? ' Or are they the same?' : '');
          return { prompt: q, say: q, choices: ch, answer: ans, pics: true };
        }
        if (i < 6) {
          const max = i < 4 ? 20 : 50, less = Math.random() < 0.5;
          const a = R(0, max);
          let b = R(0, max);
          while (b === a) b = R(0, max);
          const q = `Which number is ${less ? 'less' : 'more'}?`;
          return { prompt: q, say: q, choices: [a, b].map((v) => ({ label: String(v), value: v })), answer: less ? Math.min(a, b) : Math.max(a, b) };
        }
        const set = new Set();
        while (set.size < 3) set.add(R(0, 100));
        const vals = [...set], small = Math.random() < 0.5;
        const q = `Which number is the ${small ? 'smallest' : 'biggest'}?`;
        return { prompt: q, say: q, choices: vals.map((v) => ({ label: String(v), value: v })), answer: small ? Math.min(...vals) : Math.max(...vals) };
      },
    },
    {
      id: 'bonds', name: 'Crystal Caves', sub: 'Number bonds to 10 and 20', pic: () => A.item('crystal'),
      gen(i) {
        const total = i < 5 ? 10 : 20, a = R(1, total - 1), ans = total - a, first = Math.random() < 0.5;
        const t = first ? [a, '+', '?', '=', total] : ['?', '+', a, '=', total];
        return {
          prompt: `Make ${total}!`, say: first ? `${a} and what make ${total}?` : `What and ${a} make ${total}?`,
          big: eq(t), visual: i < 7 ? A.tenFrame('crystal', a, total) : '', choices: nums(ans, howMany(i), 0, total), answer: ans,
        };
      },
    },
    {
      id: 'add', name: 'Moonlit Lake', sub: 'Adding within 20', glyph: '+',
      gen(i) {
        let a, b;
        if (i < 3) { a = R(1, 5); b = R(1, 5); }
        else if (i < 6) { a = R(2, 9); b = R(2, Math.min(9, 20 - a)); if (i === 5 && Math.random() < 0.3) b = 0; }
        else if (Math.random() < 0.5) { a = R(10, 17); b = R(1, 20 - a); }
        else { a = R(4, 9); b = R(11 - a, 9); }
        if (b && Math.random() < 0.5) [a, b] = [b, a];
        const it = pick(IT), s = a + b;
        return {
          prompt: 'Add them together', say: `What is ${a} add ${b}?`, big: eq([a, '+', b, '=', '?']),
          visual: i < 6 ? `<div class="sum-pics">${A.objects(it.k, a)}<div class="op">+</div>${A.objects(it.k, b)}</div>` : '',
          choices: nums(s, howMany(i), 0, 20), answer: s,
        };
      },
    },
    {
      id: 'take', name: 'Ember Hollow', sub: 'Taking away within 20', glyph: '−',
      gen(i) {
        let a, b;
        if (i < 3) { a = R(3, 10); b = R(1, Math.min(5, a - 1)); }
        else if (i < 6) { a = R(6, 15); b = R(1, a - 1); if (i === 5 && Math.random() < 0.3) b = Math.random() < 0.5 ? 0 : a; }
        else { a = R(11, 20); b = R(1, a); }
        const it = pick(IT), d = a - b;
        return {
          prompt: i < 6 ? 'Some floated away. How many are left?' : 'Take away', say: `What is ${a} take away ${b}?`,
          big: eq([a, '−', b, '=', '?']), visual: i < 6 ? A.objects(it.k, a, { fade: b }) : '',
          choices: nums(d, howMany(i), 0, 20), answer: d,
        };
      },
    },
    {
      id: 'missing', name: 'Mystery Stones', sub: 'Missing number problems', glyph: '?',
      gen(i) {
        const c = R(2, i < 3 ? 10 : 20), a = R(1, c - 1), b = c - a;
        const forms = i < 3 ? ['a+?', '?+b'] : i < 6 ? ['a+?', '?+b', 'c-?', '?-b'] : ['c=a+?', 'a=?-b', 'c-?', '?-b', '?+b'];
        const F = {
          'a+?': [[a, '+', '?', '=', c], b], '?+b': [['?', '+', b, '=', c], a], 'c-?': [[c, '−', '?', '=', a], b],
          '?-b': [['?', '−', b, '=', a], c], 'c=a+?': [[c, '=', a, '+', '?'], b], 'a=?-b': [[a, '=', '?', '−', b], c],
        }[pick(forms)];
        return { prompt: 'Which number is hiding under the stone?', say: eqSay(F[0]) + '?', big: eq(F[0]), choices: nums(F[1], howMany(i), 0, 20), answer: F[1] };
      },
    },
    {
      id: 'skip', name: 'Skipping Falls', sub: 'Counting in 2s, 5s and 10s', glyph: '2 4 6',
      gen(i, friends) {
        const type = ['groups', 'groups', 'seq', 'seq', 'groups', 'double', 'share', 'seq'][i];
        const step = pick(i < 2 ? [2, 10] : [2, 5, 10]);
        const it = pick(IT);
        const near = (ans, c) => [...new Set([ans, ...c.filter((v) => v > 0 && v !== ans)])].slice(0, howMany(i)).sort((x, y) => x - y).map((v) => ({ label: String(v), value: v }));
        if (type === 'groups') {
          const k = R(2, step === 10 ? 4 : step === 5 ? 4 : 6), ans = k * step;
          return {
            prompt: `Count in ${step}s. How many altogether?`, say: `Count in ${step}s. How many ${it.many} are there altogether?`,
            visual: `<div class="groups">${Array.from({ length: k }, () => `<div class="nest">${A.objects(it.k, step, { cls: 'tiny' })}</div>`).join('')}</div>`,
            choices: near(ans, shuffle([ans - step, ans + step, ans + 2 * step, ans + 1])), answer: ans,
          };
        }
        if (type === 'seq') {
          const max = step === 2 ? 30 : step === 5 ? 60 : 100;
          const start = step * R(0, max / step - 4);
          const seq = [0, 1, 2, 3, 4].map((k) => start + k * step);
          const gap = R(1, 4), ans = seq[gap];
          return {
            prompt: `Count in ${step}s. Which number is missing?`, say: `Count in ${step}s. ` + seq.map((v, k) => (k === gap ? 'what' : v)).join(', ') + '?',
            visual: stones(seq, gap), choices: near(ans, shuffle([ans - step, ans + step, ans + 1, ans - 1])), answer: ans,
          };
        }
        if (type === 'double') {
          const n = R(1, 10);
          return {
            prompt: `What is double ${n}?`, say: `Double ${n} means ${n} and ${n} more. What is double ${n}?`,
            visual: `<div class="sum-pics">${A.objects(it.k, n)}<div class="op mirror"></div>${A.objects(it.k, n)}</div>`,
            choices: nums(2 * n, howMany(i), 0, 20), answer: 2 * n,
          };
        }
        const each = R(2, 6), total = each * 2;
        return {
          prompt: `Share ${total} equally between ${friends}. How many each?`,
          say: `Share ${total} ${it.many} equally between ${friends}. How many does each one get?`,
          visual: A.objects(it.k, total), choices: nums(each, howMany(i), 0, 12), answer: each,
        };
      },
    },
    {
      id: 'frac', name: 'Half-Moon Hill', sub: 'Halves and quarters', pic: () => '<svg viewBox="0 0 120 120" class="frac"><path d="M60,10 A50,50 0 0 1 60,110 Z" fill="url(#g-frac)" stroke="#efeaff" stroke-width="4"/><path d="M60,10 A50,50 0 0 0 60,110 Z" fill="#2a2070" stroke="#efeaff" stroke-width="4"/></svg>',
      gen(i) {
        const type = ['half', 'quarter', 'half', 'halfOf', 'halfOf', 'quarter', 'quarterOf', 'halfOf'][i];
        if (type === 'half' || type === 'quarter') {
          const parts = type === 'half' ? 2 : 4, sh = shuffle(['circle', 'square', 'rect']);
          const ch = shuffle([
            { html: A.frac(sh[0], parts, true), value: 'yes' },
            { html: A.frac(sh[1], parts, false), value: 'unequal' },
            { html: A.frac(sh[2], parts === 2 ? 4 : 2, true), value: 'other' },
          ]);
          const word = parts === 2 ? 'one half' : 'one quarter';
          return {
            prompt: `Which shape has ${word} shaded?`,
            say: `Which shape has ${word} shaded? ${parts === 2 ? 'A half is one of two equal parts.' : 'A quarter is one of four equal parts.'}`,
            choices: ch, answer: 'yes', pics: true,
          };
        }
        const it = pick(IT);
        if (type === 'halfOf') {
          const n = 2 * R(1, i < 4 ? 5 : 10);
          return { prompt: `What is half of ${n}?`, say: `Share ${n} ${it.many} into two equal groups. What is half of ${n}?`, visual: A.objects(it.k, n), choices: nums(n / 2, howMany(i), 0, 20), answer: n / 2 };
        }
        const n = pick([4, 8, 12]);
        return { prompt: `What is a quarter of ${n}?`, say: `Share ${n} ${it.many} into four equal groups. What is a quarter of ${n}?`, visual: A.objects(it.k, n), choices: nums(n / 4, howMany(i), 0, 12), answer: n / 4 };
      },
    },
    {
      id: 'shapes', name: 'Shape Grove', sub: '2D and 3D shapes', pic: () => A.shape('cube'),
      gen(i) {
        const three = i >= 4 && Math.random() < 0.6;
        const pool = three ? ['cube', 'cuboid', 'sphere', 'pyramid', 'cylinder', 'cone'] : ['circle', 'triangle', 'square', 'rectangle'];
        const clash = { square: 'rectangle', rectangle: 'square', cube: 'cuboid', cuboid: 'cube' }; // a square IS a rectangle, so never ask both
        const target = pick(pool);
        const others = shuffle(pool.filter((s) => s !== target && s !== clash[target])).slice(0, howMany(i) - 1);
        const all = shuffle([target, ...others]);
        if (i >= 2 && Math.random() < 0.5) {
          return { prompt: 'What is this shape called?', say: 'What is this shape called?', visual: `<div class="pic-lg">${A.shape(target)}</div>`, choices: all.map((s) => ({ label: s, value: s })), answer: target, words: true };
        }
        return { prompt: `Tap the ${target}.`, say: `Can you find the ${target}?`, choices: all.map((s) => ({ html: A.shape(s), value: s })), answer: target, pics: true };
      },
    },
    {
      id: 'time', name: 'Clock Tower', sub: "O'clock, half past and days", pic: () => A.clock(3, 0),
      gen(i) {
        if (i >= 6) {
          const months = i === 7 && Math.random() < 0.5, list = months ? MONTHS : DAYS;
          const d = R(0, list.length - 1), after = Math.random() < 0.6;
          const ans = list[(d + (after ? 1 : list.length - 1)) % list.length];
          const others = shuffle(list.filter((x) => x !== ans && x !== list[d])).slice(0, 2);
          const q = `Which ${months ? 'month' : 'day'} comes ${after ? 'after' : 'before'} ${list[d]}?`;
          return { prompt: q, say: q, visual: `<div class="word-big sm">${list[d]}</div>`, choices: shuffle([ans, ...others]).map((x) => ({ label: x, value: x })), answer: ans, words: true };
        }
        const half = i >= 2 && Math.random() < 0.5, h = R(1, 12);
        const lab = (hh, hf) => (hf ? `half past ${hh}` : `${hh} o'clock`);
        const nh = (h % 12) + 1, ph = ((h + 10) % 12) + 1;
        const opts = [[h, half], [h, !half], [nh, half], [ph, !half]].slice(0, howMany(i));
        const ans = lab(h, half);
        if (i >= 4) {
          return { prompt: `Which clock shows ${ans}?`, say: `Which clock shows ${ans}?`, choices: shuffle(opts).map(([hh, hf]) => ({ html: A.clock(hh, hf ? 30 : 0), value: lab(hh, hf) })), answer: ans, pics: true };
        }
        return { prompt: 'What time does the clock show?', say: 'What time does the clock show?', visual: `<div class="pic-lg">${A.clock(h, half ? 30 : 0)}</div>`, choices: shuffle(opts).map(([hh, hf]) => ({ label: lab(hh, hf), value: lab(hh, hf) })), answer: ans, words: true };
      },
    },
    {
      id: 'money', name: "Dragon's Hoard", sub: 'Coins and money', pic: () => A.coin(10),
      gen(i) {
        const say = (v) => (v === 100 ? 'one pound' : v === 200 ? 'two pounds' : v === 1 ? 'one penny' : `${v}p`);
        if (i < 3) {
          const pool = i < 1 ? [1, 2, 5, 10] : [1, 2, 5, 10, 20, 50, 100, 200];
          const v = pick(pool), all = shuffle([v, ...shuffle(pool.filter((x) => x !== v)).slice(0, 2)]);
          return { prompt: `Which coin is ${A.coinName(v)}?`, say: `Which coin is ${say(v)}?`, choices: all.map((x) => ({ html: A.coin(x), value: x })), answer: v, pics: true };
        }
        if (i === 6) {
          const [a, b] = shuffle(pick([[5, 2], [5, 1], [20, 10], [50, 20], [100, 50], [10, 2], [200, 100]]));
          return { prompt: 'Which coin is worth more?', say: 'Which coin is worth more? Be careful, bigger coins are not always worth more!', choices: [a, b].map((x) => ({ html: A.coin(x), value: x })), answer: Math.max(a, b), pics: true };
        }
        const n = i < 4 ? 2 : 3;
        let coins;
        do { coins = Array.from({ length: n }, () => pick([1, 2, 5, 10])); } while (coins.reduce((s, c) => s + c, 0) > 20);
        coins.sort((x, y) => y - x);
        const total = coins.reduce((s, c) => s + c, 0);
        return {
          prompt: 'How much money is here?', say: 'How much money is here? Add up the coins.',
          visual: `<div class="coins">${coins.map(A.coin).join('')}</div>`,
          choices: nums(total, howMany(i), 1, 30).map((c) => ({ label: c.value + 'p', value: c.value })), answer: total,
        };
      },
    },
  ];

  IZ.realms = realms;
})((window.IZ = window.IZ || {}));
