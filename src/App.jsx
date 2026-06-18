import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RouteProvider, useRoute } from './hooks/useRoute'
import TopBar from './components/TopBar'
import LiveEtaBar from './components/LiveEtaBar'
import ActiveStopCard from './components/ActiveStopCard'
import Timeline from './components/Timeline'
import PolaroidWall from './components/PolaroidWall'
import DemoTimeControl from './components/DemoTimeControl'
import FloatingBackground from './components/FloatingBackground'

function RouteScreen() {
  const { stops, groupPosition, isFinished } = useRoute()
  const [selectedId, setSelectedId] = useState(stops[0]?.id)
  // Volg automatisch de groep, tenzij de gebruiker zelf navigeert.
  const [following, setFollowing] = useState(true)

  useEffect(() => {
    if (following && groupPosition?.stop) {
      setSelectedId(groupPosition.stop.id)
    }
  }, [following, groupPosition])

  const handleSelect = (id) => {
    setFollowing(false)
    setSelectedId(id)
  }

  const selectedIndex = stops.findIndex((s) => s.id === selectedId)
  const selectedStop = stops[selectedIndex] ?? stops[0]

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-base text-ink">
      <FloatingBackground />

      {/* Alle content boven de zwevende achtergrond */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
      <TopBar />
      {/* Tijdelijk verborgen op verzoek — component blijft bestaan */}
      {/* <LiveEtaBar /> */}

      {/* Finale neemt het scherm over; anders normale tocht-weergave */}
      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.main
            key="wall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto pt-3"
          >
            <PolaroidWall />
          </motion.main>
        ) : (
          <motion.main
            key="route"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <div className="flex flex-1 items-center pt-4">
              <ActiveStopCard stop={selectedStop} index={selectedIndex} total={stops.length} />
            </div>

            {!following && (
              <button
                onClick={() => setFollowing(true)}
                className="mx-auto mb-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-medium text-[11px] text-ink/70 backdrop-blur-md active:scale-95"
              >
                ↺ Volg de groep
              </button>
            )}

            <Timeline stops={stops} selectedId={selectedId} onSelect={handleSelect} />
          </motion.main>
        )}
      </AnimatePresence>

      <DemoTimeControl />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <RouteProvider>
      <RouteScreen />
    </RouteProvider>
  )
}
