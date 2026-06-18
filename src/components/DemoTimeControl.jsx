import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, SlidersHorizontal } from 'lucide-react'
import { useRoute } from '../hooks/useRoute'

// Demo-only: scrub door de avond om de actieve-stop-logica te zien.
// Zet mockMinutes op null om over te schakelen naar echte systeemtijd.
export default function DemoTimeControl() {
  const { mockMinutes, setMockMinutes } = useRoute()
  const [open, setOpen] = useState(false)

  const live = mockMinutes === null
  const minutes = live ? 0 : mockMinutes

  // 19:00 + minutes → label
  const label = (() => {
    const total = 19 * 60 + minutes
    const h = Math.floor(total / 60) % 24
    const m = total % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })()

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] shadow-glass backdrop-blur-xl active:scale-95"
        aria-label="Demo-tijd"
      >
        <SlidersHorizontal size={18} className="text-ink/70" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-40 w-64 rounded-2xl border border-white/12 bg-surface/95 p-4 shadow-glass backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-[13px] text-ink/80">
                <Clock size={14} className="text-candy" /> Demo-tijd
              </span>
              <button onClick={() => setOpen(false)}>
                <X size={16} className="text-ink/40" />
              </button>
            </div>

            <div className="mb-3 text-center font-wide text-[30px] text-candy">
              {live ? 'LIVE' : label}
            </div>

            <input
              type="range"
              min={0}
              max={500}
              step={5}
              value={minutes}
              onChange={(e) => setMockMinutes(Number(e.target.value))}
              className="w-full accent-[#FF6FA5]"
              disabled={live}
            />

            <button
              onClick={() => setMockMinutes(live ? 0 : null)}
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/[0.06] py-2 font-medium text-[12px] text-ink/70 active:scale-95"
            >
              {live ? 'Demo-modus aan' : 'Naar echte tijd'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
