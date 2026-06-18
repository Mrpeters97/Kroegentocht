import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Horizontale tijdlijn met pastel stippellijn + bolletjes.
//  - actief  : groter, pastel-gevuld, pulseert
//  - voltooid : checkmark (of de gemaakte foto)
//  - inactief : subtiel transparant-wit bolletje
// scroll-snap voor vloeiend swipen; tik om een stop te selecteren.
export default function Timeline({ stops, selectedId, onSelect }) {
  const scrollerRef = useRef(null)
  const itemRefs = useRef({})

  // Houd de geselecteerde stop gecentreerd in beeld.
  useEffect(() => {
    const el = itemRefs.current[selectedId]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedId])

  return (
    <div className="relative w-full pb-[calc(env(safe-area-inset-bottom)+18px)]">
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto px-[42vw] py-4"
      >
        {stops.map((stop, i) => {
          const isSelected = stop.id === selectedId
          const isActive = stop.status === 'active'
          const isPast = stop.status === 'past'
          const done = Boolean(stop.photoCaptured)

          return (
            <button
              key={stop.id}
              ref={(el) => (itemRefs.current[stop.id] = el)}
              onClick={() => onSelect(stop.id)}
              className="relative flex shrink-0 snap-center flex-col items-center"
              style={{ width: '76px' }}
            >
              {/* Verbindende pastel stippellijn (achter de bol) */}
              {i < stops.length - 1 && (
                <span
                  className="absolute top-[26px] left-1/2 h-px w-full"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, rgba(255,255,255,0.25) 0 4px, transparent 4px 9px)',
                    opacity: isPast ? 0.35 : 0.6,
                  }}
                />
              )}

              {/* Bol */}
              <motion.span
                className={`relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border ${
                  isActive
                    ? 'border-white/30 bg-candy text-white shadow-candy'
                    : done
                      ? 'border-candy/40 bg-candy/15 text-candy'
                      : isSelected
                        ? 'border-candy/60 bg-white/10 text-ink'
                        : 'border-white/15 bg-white/[0.05] text-ink/40'
                } backdrop-blur-sm`}
                animate={
                  isActive
                    ? { scale: [1, 1.12, 1] }
                    : { scale: isSelected ? 1.06 : 1 }
                }
                transition={
                  isActive
                    ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.25 }
                }
                style={{ opacity: isPast && !isSelected && !done ? 0.5 : 1 }}
              >
                {/* Pulserende ring bij actief */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-candy"
                    animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                {done ? (
                  stop.photoCaptured && typeof stop.photoCaptured === 'string' ? (
                    <span className="relative h-full w-full overflow-hidden rounded-full">
                      <img src={stop.photoCaptured} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check size={18} className="text-white" />
                      </span>
                    </span>
                  ) : (
                    <Check size={20} className="relative" />
                  )
                ) : (
                  // Inactief/actief zonder foto: schone gevulde stip (geen icoon)
                  <span
                    className={`relative block rounded-full ${
                      isActive ? 'h-3 w-3 bg-white' : 'h-2.5 w-2.5 bg-ink/30'
                    }`}
                  />
                )}
              </motion.span>

              {/* Tijd-label */}
              <span
                className={`mt-2 font-light text-[11px] ${
                  isActive ? 'font-medium text-candy' : 'text-ink/50'
                }`}
                style={{ opacity: isPast && !isSelected && !done ? 0.5 : 1 }}
              >
                {stop.startTime}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
