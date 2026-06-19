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

// ── Persistente foto-opslag (overleeft refresh) ─────────────────
// We bewaren alleen een { stopId: fotoDataURL } map, geen volledige
// stop-objecten. Zo blijft het robuust als de route (ids/tijden) wijzigt.
const PHOTOS_KEY = 'verjaardag.photos.v1'

function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(PHOTOS_KEY)) || {}
  } catch {
    return {}
  }
}

function savePhotos(map) {
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(map))
  } catch {
    // localStorage vol of niet beschikbaar — stilletjes negeren.
  }
}
function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]),
  )
}

export function RouteProvider({ children }) {
  // Herstel eerder gemaakte foto's uit localStorage bij het opstarten.
  const [stops, setStops] = useState(() => {
    const saved = loadPhotos()
    return STOPS.map((s) => ({ ...s, photoCaptured: saved[s.id] || s.photoCaptured }))
  })

  // ── Tijd-bron ────────────────────────────────────────────────
  // mockMinutes = null  → echte systeemtijd (productie, standaard)
  // mockMinutes = getal → gesimuleerde tijd in minuten sinds 20:00
  //                       (handig om de tocht te demonstreren)
  const [mockMinutes, setMockMinutes] = useState(null)
  const [tick, setTick] = useState(0)

  // Tikker zodat de UI mee-ademt met de tijd (elke 15s bij echte tijd).
  useEffect(() => {
    if (mockMinutes !== null) return
    const t = setInterval(() => setTick((n) => n + 1), 15000)
    return () => clearInterval(t)
  }, [mockMinutes])

  const projectedNow = useMemo(() => {
    if (mockMinutes === null) return projectNow(new Date())
    // Mock: 20:00 + mockMinutes
    return new Date(toDate('20:00').getTime() + mockMinutes * 60000)
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
  // Sla een foto op bij een stop. Geef je een echte foto mee (data-URL
  // uit de camera), dan gebruiken we die; anders een kleurrijke
  // placeholder (handig in demo-modus zonder camera).
  const checkInPhoto = useCallback((stopId, photo) => {
    setStops((prev) => {
      const next = prev.map((s) =>
        s.id === stopId
          ? { ...s, photoCaptured: photo || makePlaceholderPhoto(s) }
          : s,
      )
      // Bewaar de actuele foto-map zodat alles een refresh overleeft.
      const map = {}
      next.forEach((s) => {
        if (s.photoCaptured) map[s.id] = s.photoCaptured
      })
      savePhotos(map)
      return next
    })
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
