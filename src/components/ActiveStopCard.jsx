import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock } from 'lucide-react'
import PhotoCheckIn from './PhotoCheckIn'

const STATUS = {
  active: { text: 'Nu actief', className: 'bg-candy text-white shadow-candy', dot: true },
  upcoming: { text: 'Komt eraan', className: 'bg-white/10 text-ink/70', dot: false },
  past: { text: 'Geweest', className: 'bg-white/10 text-ink/55', dot: false },
}

// Pulserend rondje bij de actieve kroeg.
function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <motion.span
        className="absolute inset-0 rounded-full bg-white"
        animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative h-2 w-2 rounded-full bg-white" />
    </span>
  )
}

// Glassmorphism hero-kaart voor de geselecteerde/actieve kroeg.
export default function ActiveStopCard({ stop, index, total }) {
  const status = STATUS[stop.status] ?? STATUS.upcoming

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={stop.id}
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -22, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-md px-5"
      >
        <div className="rounded-[28px] border border-white/20 bg-white/[0.09] p-7 text-center shadow-glass backdrop-blur-xl">
          {/* Kop: index + status */}
          <div className="mb-5 flex items-center justify-between">
            <span className="font-light text-[12px] uppercase tracking-[0.18em] text-ink/60">
              Stop {index + 1} / {total}
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-[11px] uppercase tracking-wider ${status.className}`}
            >
              {status.dot && <PulsingDot />}
              {status.text}
            </span>
          </div>

          {/* Naam */}
          <h2 className="font-wide text-[34px] leading-[1.05] tracking-tight text-ink">
            {stop.name}
          </h2>

          {/* Adres + tijd */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <p className="flex items-center gap-2 font-light text-[15px] text-ink/70">
              <MapPin size={15} className="text-candy" />
              {stop.address}
            </p>
            <p className="flex items-center gap-2 font-light text-[15px] text-ink/70">
              <Clock size={15} className="text-candy" />
              {stop.startTime} – {stop.endTime}
            </p>
          </div>

          {/* Check-in */}
          <div className="mt-7">
            <PhotoCheckIn stop={stop} />
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
