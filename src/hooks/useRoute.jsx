import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { STOPS } from '../data/stops'
import { toDate, projectNow, stopStatus, minutesUntil } from '../lib/time'

const RouteContext = createContext(null)

// Een placeholder "foto" — kleurrijke gradient + label, als data-URL.
// Simuleert het resultaat van een camera-actie.
function makePlaceholderPhoto(stop) {
  const hues = [18, 200, 320, 90, 260, 45, 150, 0, 280]
  const h = hues[Math.abs(hashCode(stop.id)) % hues.length]
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${h},70%,45%)"/>
          <stop offset="100%" stop-color="hsl(${(h + 40) % 360},75%,25%)"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <text x="50%" y="48%" fill="rgba(255,255,255,0.95)" font-size="34"
        font-family="system-ui, sans-serif" font-weight="700"
        text-anchor="middle">${escapeXml(stop.name)}</text>
      <text x="50%" y="58%" fill="rgba(255,255,255,0.8)" font-size="20"
        font-family="system-ui, sans-serif" text-anchor="middle">${stop.startTime}</text>
    </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return h
}
function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]),
  )
}

export function RouteProvider({ children }) {
  const [stops, setStops] = useState(() => STOPS.map((s) => ({ ...s })))

  // ── Tijd-bron ────────────────────────────────────────────────
  // mockMinutes = null  → echte systeemtijd (productie)
  // mockMinutes = getal → gesimuleerde tijd in minuten sinds 19:00
  //                       (handig om de tocht te demonstreren)
  const [mockMinutes, setMockMinutes] = useState(0)
  const [tick, setTick] = useState(0)

  // Tikker zodat de UI mee-ademt met de tijd (elke 15s bij echte tijd).
  useEffect(() => {
    if (mockMinutes !== null) return
    const t = setInterval(() => setTick((n) => n + 1), 15000)
    return () => clearInterval(t)
  }, [mockMinutes])

  const projectedNow = useMemo(() => {
    if (mockMinutes === null) return projectNow(new Date())
    // Mock: 19:00 + mockMinutes
    return new Date(toDate('19:00').getTime() + mockMinutes * 60000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockMinutes, tick])

  // ── Afgeleide status per stop ────────────────────────────────
  const decorated = useMemo(
    () => stops.map((s) => ({ ...s, status: stopStatus(s, projectedNow) })),
    [stops, projectedNow],
  )

  const activeIndex = decorated.findIndex((s) => s.status === 'active')

  // Positie van de groep: in een kroeg, of onderweg naar de volgende.
  const groupPosition = useMemo(() => {
    if (activeIndex !== -1) {
      const s = decorated[activeIndex]
      return {
        mode: 'at',
        stop: s,
        index: activeIndex,
        etaMinutes: 0,
      }
    }
    // Vóór de eerste stop?
    const first = decorated[0]
    if (projectedNow < toDate(first.startTime, first.dayOffset)) {
      return {
        mode: 'before',
        stop: first,
        index: 0,
        etaMinutes: minutesUntil(toDate(first.startTime, first.dayOffset), projectedNow),
      }
    }
    // Tussen twee stops in → onderweg naar de eerstvolgende upcoming.
    const nextIndex = decorated.findIndex((s) => s.status === 'upcoming')
    if (nextIndex !== -1) {
      const next = decorated[nextIndex]
      return {
        mode: 'enroute',
        stop: next,
        index: nextIndex,
        etaMinutes: minutesUntil(toDate(next.startTime, next.dayOffset), projectedNow),
      }
    }
    // Alles voorbij → tocht afgelopen.
    return { mode: 'finished', stop: decorated[decorated.length - 1], index: decorated.length - 1, etaMinutes: 0 }
  }, [decorated, activeIndex, projectedNow])

  const isFinished = groupPosition.mode === 'finished'

  // ── Acties ───────────────────────────────────────────────────
  const checkInPhoto = useCallback((stopId) => {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId ? { ...s, photoCaptured: makePlaceholderPhoto(s) } : s,
      ),
    )
  }, [])

  const capturedPhotos = useMemo(
    () => decorated.filter((s) => s.photoCaptured),
    [decorated],
  )

  const value = {
    stops: decorated,
    activeIndex,
    groupPosition,
    isFinished,
    capturedPhotos,
    checkInPhoto,
    // Demo-besturing
    mockMinutes,
    setMockMinutes,
  }

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
}

export function useRoute() {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useRoute moet binnen <RouteProvider> gebruikt worden')
  return ctx
}
