import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock } from 'lucide-react'
import PhotoCheckIn from './PhotoCheckIn'

const STATUS = {
  active: { text: 'Nu actief', className: 'bg-candy text-white shadow-candy', dot: true },
  upcoming: { text: 'Komt eraan', className: 'bg-white/10 text-ink/70', dot: false },
  past: { text: 'Geweest', className: 'bg-white/10 text-ink/55', dot: false },
}

// Pulserend rondje bij de actieve kroeg.
// CSS-animatie i.p.v. framer-motion: draait op de compositor, knippert
// gegarandeerd oneindig door en hapert niet wanneer de hoofd-thread
// het druk heeft.
function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="pulse-ring absolute inset-0 rounded-full bg-white" />
      <span className="relative h-2 w-2 rounded-full bg-white" />
    </span>
  )
}

// De kaart glijdt weg aan de kant waarheen je swipet en de volgende
// komt van de andere kant binnen. We animeren alleen 'x' (transform),
// zónder opacity op de enter — zo blijft de backdrop-blur op iOS/Safari
// meteen zichtbaar i.p.v. pas ná de animatie "in te springen".
const cardVariants = {
  enter: (dir) => ({ x: dir >= 0 ? '110%' : '-110%' }),
  center: { x: 0 },
  exit: (dir) => ({ x: dir >= 0 ? '-110%' : '110%', opacity: 0 }),
}

// Glassmorphism hero-kaart voor de geselecteerde/actieve kroeg.
export default function ActiveStopCard({ stop, index, total, direction = 1, onSwipe }) {
  const status = STATUS[stop.status] ?? STATUS.upcoming

  // Swipe-detectie: genoeg horizontale verplaatsing óf snelheid telt.
  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info
    if (offset.x < -60 || velocity.x < -500) onSwipe?.(1)
    else if (offset.x > 60 || velocity.x > 500) onSwipe?.(-1)
  }

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.section
        key={stop.id}
        custom={direction}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: 'transform' }}
        className="mx-auto w-full max-w-md px-5"
        // Sleep horizontaal om naar de vorige/volgende stop te gaan.
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-[28px] border border-white/20 bg-white/[0.09] p-7 text-center shadow-glass backdrop-blur-md">
          {/* Inhoud fadet in; het glass-paneel eromheen is meteen volledig
              zichtbaar, dus de blur is direct aanwezig. */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.06 }}>
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

            {/* Adres + tijd (± want het is een geschatte aankomsttijd).
                Zodra er ingecheckt is met een foto verdwijnen deze regels,
                zodat de kaart inkrimpt en de tijdlijn onderaan blijft staan. */}
            {!stop.photoCaptured && (
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <p className="flex items-center gap-2 font-light text-[15px] text-ink/70">
                  <MapPin size={15} className="text-candy" />
                  {stop.address}
                </p>
                <p className="flex items-center gap-2 font-light text-[15px] text-ink/70">
                  <Clock size={15} className="text-candy" />± {stop.startTime}
                </p>
              </div>
            )}

            {/* Check-in */}
            <div className="mt-7">
              <PhotoCheckIn stop={stop} />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
