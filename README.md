# De Verjaardagstocht 🎉

Mobile-first webapp voor een verjaardags-kroegentocht door Leeuwarden.
React + Vite + Tailwind CSS + Framer Motion + Lucide.

## Draaien

```bash
npm install
npm run dev
```

Open de URL op je telefoon (of gebruik de devtools device-modus).

## Demo-tijd

Rechtsonder zit een ⚙️-knop met een **demo-tijdregelaar**. Sleep door
de avond (start 19:00) om te zien welke stop "actief" wordt, hoe de
Live ETA bar meebeweegt en hoe de Wall of Fame verschijnt aan het eind.
Zet hem op "Naar echte tijd" voor productiegedrag (echte systeemtijd).

## Structuur

```
src/
  data/stops.js        ← de route + tijden (pas hier de tijden aan)
  lib/time.js          ← tijd-helpers + actieve-stop-berekening
  hooks/useRoute.jsx   ← centrale state (Context): status, ETA, check-ins
  components/
    TopBar.jsx
    LiveEtaBar.jsx     ← sticky "join route" balk met live positie + ETA
    StopHero.jsx       ← detailweergave geselecteerde stop
    PhotoCheckIn.jsx   ← gesimuleerde camera-check-in
    Timeline.jsx       ← horizontale scroll-snap tijdlijn met bolletjes
    PolaroidWall.jsx   ← de finale: Wall of Fame
    DemoTimeControl.jsx
```

## Fonts

Zie `public/fonts/README.md`. Zonder de fontbestanden valt alles
netjes terug op `system-ui`.
