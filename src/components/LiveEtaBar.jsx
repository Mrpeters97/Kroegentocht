import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, MapPin, Clock, Footprints, PartyPopper } from 'lucide-react'
import { useRoute } from '../hooks/useRoute'

// Sticky "Join Route" balk: laat altijd zien waar de groep nu is en
// wat de ETA naar de volgende locatie is. Frosted-glass op pastel.
export default function LiveEtaBar() {
  const { groupPosition } = useRoute()
  const { mode, stop, etaMinutes } = groupPosition

  const config = {
    before: {
      icon: Clock,
      label: 'Tocht begint zo',
      detail: `Verzamelen bij ${stop.name}`,
      eta: `over ${etaMinutes} min`,
    },
    at: {
      icon: MapPin,
      label: 'De groep is nu bij',
      detail: stop.name,
      eta: 'Live',
    },
    enroute: {
      icon: Footprints,
      label: 'Onderweg naar',
      detail: stop.name,
      eta: `ETA ${etaMinutes} min`,
    },
    finished: {
      icon: PartyPopper,
      label: 'De tocht zit erop',
      detail: 'Bekijk de Wall of Fame',
      eta: 'Klaar',
    },
  }[mode]

  const Icon = config.icon
  const pulsing = mode === 'at'

  return (
    <div className="sticky top-0 z-30 px-4 pt-1">
      <motion.div
        layout
        className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/20 bg-white/[0.09] px-4 py-3 shadow-glass backdrop-blur-xl"
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-candy/20">
          {pulsing && (
            <motion.span
              className="absolute inset-0 rounded-full bg-candy/40"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <Icon size={17} className="relative text-candy" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-light text-[11px] uppercase tracking-widest text-ink/60">
            {config.label}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={config.detail}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate font-medium text-[15px] text-ink"
            >
              {config.detail}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-candy px-3 py-1.5 shadow-candy">
          <Navigation size={13} className="text-white" />
          <span className="font-medium text-[13px] text-white">{config.eta}</span>
        </div>
      </motion.div>
    </div>
  )
}
