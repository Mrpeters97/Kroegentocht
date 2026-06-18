import { motion } from 'framer-motion'
import { Download, PartyPopper } from 'lucide-react'
import { useRoute } from '../hooks/useRoute'

// Lichte, "willekeurige" rotatie per polaroid (deterministisch op index).
const rotations = [-5, 3, -2, 6, -4, 2, -6, 4, -3]

export default function PolaroidWall() {
  const { stops, capturedPhotos } = useRoute()

  const handleDownload = () => {
    // In theorie: bundel de foto's en bied ze als download aan.
    // Hier downloaden we de losse placeholders als demonstratie.
    capturedPhotos.forEach((s, i) => {
      const a = document.createElement('a')
      a.href = s.photoCaptured
      a.download = `verjaardagstocht-${i + 1}-${s.id}.svg`
      a.click()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-full flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2"
    >
      {/* Kop */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 text-center"
      >
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-candy shadow-candy">
          <PartyPopper size={22} className="text-white" />
        </div>
        <h2 className="font-wide text-[28px] uppercase tracking-wide text-ink">
          Wall of Fame
        </h2>
        <p className="mt-1 font-light text-[14px] text-ink/50">
          {capturedPhotos.length} herinnering{capturedPhotos.length === 1 ? '' : 'en'} vastgelegd
        </p>
      </motion.div>

      {/* Grid */}
      {capturedPhotos.length === 0 ? (
        <p className="mt-10 text-center font-light text-[14px] text-ink/40">
          Geen foto's gemaakt tijdens de tocht 🥲
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {capturedPhotos.map((stop, i) => (
            <motion.figure
              key={stop.id}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: rotations[i % rotations.length] }}
              transition={{
                delay: 0.2 + i * 0.08,
                type: 'spring',
                stiffness: 220,
                damping: 18,
              }}
              whileTap={{ scale: 1.04, rotate: 0, zIndex: 10 }}
              className="rounded-[3px] bg-white p-2.5 pb-7 shadow-polaroid"
            >
              <img
                src={stop.photoCaptured}
                alt={`Foto bij ${stop.name}`}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="mt-2 px-0.5 text-center font-light text-[12px] text-black/70">
                {stop.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      )}

      {/* Download */}
      {capturedPhotos.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + capturedPhotos.length * 0.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="mt-8 flex items-center justify-center gap-2.5 rounded-2xl bg-candy py-4 font-medium text-[16px] text-white shadow-candy"
        >
          <Download size={20} />
          Download herinneringen
        </motion.button>
      )}

      {/* Totaal aantal stops voor context */}
      <p className="mt-5 text-center font-light text-[12px] text-ink/40">
        {stops.length} locaties · Leeuwarden
      </p>
    </motion.div>
  )
}
