import confetti from 'canvas-confetti'

// De feestdag: vrijdag 19 juni 2026.
export const PARTY_DATE = { year: 2026, month: 5, day: 19 } // month is 0-based

export function isPartyDay(now = new Date()) {
  return (
    now.getFullYear() === PARTY_DATE.year &&
    now.getMonth() === PARTY_DATE.month &&
    now.getDate() === PARTY_DATE.day
  )
}

// Bevredigende, vloeiende confetti-explosie. Twee zij-bronnen die naar
// het midden schieten, met een paar na-pufjes voor een rijk effect.
export function burstConfetti() {
  const colors = ['#FF6FA5', '#FFC2D6', '#A9D6FF', '#C9B8FF', '#FFFFFF']
  const defaults = { spread: 70, ticks: 200, gravity: 0.9, scalar: 1.05, colors }

  confetti({ ...defaults, particleCount: 90, origin: { x: 0.2, y: 0.7 }, angle: 60 })
  confetti({ ...defaults, particleCount: 90, origin: { x: 0.8, y: 0.7 }, angle: 120 })

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 60, spread: 110, origin: { x: 0.5, y: 0.5 }, startVelocity: 38 })
  }, 180)

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 50, spread: 130, origin: { x: 0.5, y: 0.4 }, scalar: 0.9 })
  }, 360)
}
