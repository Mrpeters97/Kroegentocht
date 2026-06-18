// ──────────────────────────────────────────────────────────────
// Tijd-helpers. Alle "HH:MM" tijden worden geprojecteerd op een
// vaste basisdatum, zodat we ze met de (gemockte) huidige tijd
// kunnen vergelijken. dayOffset schuift stops na middernacht door.
// ──────────────────────────────────────────────────────────────

const BASE = new Date(2026, 0, 1, 0, 0, 0, 0) // 1 jan 2026, 00:00 als anker

/** "HH:MM" (+ optionele dayOffset) → Date op de ankerdatum */
export function toDate(hhmm, dayOffset = 0) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(BASE)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(h, m, 0, 0)
  return d
}

/** Projecteer een willekeurig Date-tijdstip (alleen uur/minuut) op het anker. */
export function projectNow(now) {
  const d = new Date(BASE)
  let h = now.getHours()
  const m = now.getMinutes()
  // Uren tussen middernacht en ~05:00 horen bij "de volgende dag" van de tocht.
  let dayOffset = 0
  if (h < 5) dayOffset = 1
  d.setDate(d.getDate() + dayOffset)
  d.setHours(h, m, 0, 0)
  return d
}

/** Status van één stop t.o.v. een (geprojecteerd) nu-tijdstip. */
export function stopStatus(stop, projectedNow) {
  const start = toDate(stop.startTime, stop.dayOffset)
  const end = toDate(stop.endTime, stop.dayOffset)
  if (projectedNow < start) return 'upcoming'
  if (projectedNow > end) return 'past'
  return 'active'
}

/** Korte tijdsweergave, bv. "19:45". */
export function fmt(hhmm) {
  return hhmm
}

/** Minuten verschil (afgerond, minimaal 0) tussen nu en een doeltijd. */
export function minutesUntil(targetDate, projectedNow) {
  const diff = Math.round((targetDate - projectedNow) / 60000)
  return Math.max(0, diff)
}
