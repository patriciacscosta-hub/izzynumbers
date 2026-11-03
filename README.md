# Izzy's Numbers

A glowing Year 1 maths adventure for iPad. Choose **Luma the Unicorn** or **Ember the Dragon**, then explore a world map across **Unicorn Meadows** and **Dragon Peaks**. Every place on the map practises one part of the Year 1 maths curriculum for England.

All the artwork is hand-drawn SVG: no emoji and no image files. The look is a misty violet forest with soft spirit lights.

## Playing on an iPad

1. Open the game's web address in Safari.
2. Tap **Share → Add to Home Screen**. It then opens full screen like an app, and keeps working offline once it has been opened.
3. Turn the iPad's silent switch off to hear chimes and the read-aloud voice.

To play on a computer, open `index.html` through any local web server.

## How it plays

- **World map**: 14 places joined by a glowing trail. Your chosen friend stands at the next place to explore. The **Unicorn Meadows** and **Dragon Peaks** buttons jump to each side of the map.
- **Journey bar**: every star you earn moves your unicorn or dragon closer to the **Star Gate**. There are 42 stars in total, 3 per place.
- **Questions**: each place has 8 questions that get a little harder as you go. Your friend runs along the track at the top towards the star with every right answer.
- **Kind feedback**: a wrong answer gives a gentle "try again". After two tries, the right answer glows so nobody gets stuck.
- **Stars**: 3 stars for 0–1 mistakes, 2 stars for 2–3 mistakes, 1 star otherwise. The best score for each place is saved on the iPad.
- **Read aloud**: every question is spoken in a British English voice, so early readers can play alone. The speaker button repeats the question.
- **Counting help**: in counting questions you can tap objects to light them up one by one.

## National Curriculum coverage (Year 1)

| Place | Land | Curriculum area | What it practises |
|---|---|---|---|
| Glow-Orb Glade | Unicorn Meadows | Number & place value | Count objects to 20 (shown in fives and tens) |
| Whispering Words | Unicorn Meadows | Number & place value | Read and write numbers 0–20 in numerals and words |
| Stepping Stones | Unicorn Meadows | Number & place value | One more and one less, up to 100, crossing tens |
| Number River | Unicorn Meadows | Number & place value | Count to 100 forwards and backwards; missing numbers in sequences |
| Balance Rocks | Unicorn Meadows | Number & place value | More, fewer, the same; greater, less, most and least |
| Crystal Caves | Unicorn Meadows | Addition & subtraction | Number bonds to 10 and 20, using ten frames |
| Moonlit Lake | Unicorn Meadows | Addition & subtraction | Add one-digit and two-digit numbers to 20, including zero |
| Ember Hollow | Dragon Peaks | Addition & subtraction | Subtract within 20, including zero |
| Mystery Stones | Dragon Peaks | Addition & subtraction | Missing number problems such as 7 = ? − 9 |
| Skipping Falls | Dragon Peaks | Multiplication & division | Count in 2s, 5s and 10s; doubling; sharing equally |
| Half-Moon Hill | Dragon Peaks | Fractions | Recognise a half and a quarter of a shape and of a quantity |
| Shape Grove | Dragon Peaks | Geometry | Name 2D shapes (circle, triangle, square, rectangle) and 3D shapes (cube, cuboid, sphere, pyramid, cylinder, cone) |
| Clock Tower | Dragon Peaks | Measurement | Tell the time to the hour and half past; days of the week and months in order |
| Dragon's Hoard | Dragon Peaks | Measurement | Recognise UK coins (1p to £2) and add up small amounts |

## Files

- `index.html`: the screens
- `css/style.css`: the look, sized for iPad in both orientations
- `js/art.js`: every illustration (unicorn, dragon, forest, world map, coins, clock, shapes, counters)
- `js/realms.js`: the question makers, one per place on the map
- `js/game.js`: the map, the journey, play flow and saved stars
- `js/sound.js`: chimes and the read-aloud voice
- `js/fx.js`: floating lights and sparkle bursts
- `sw.js`, `manifest.webmanifest`: offline play and Add to Home Screen

For grown-ups testing: `IZ.game.jump('money', 6)` in the browser console opens a place at a given question number.
