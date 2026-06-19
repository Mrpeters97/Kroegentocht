import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, RefreshCw } from 'lucide-react'
import { useRoute } from '../hooks/useRoute'
import { burstConfetti, isPartyDay } from '../lib/celebrate'
import { fileToResizedDataUrl } from '../lib/image'

// Foto-check-in met échte camera. We gebruiken een verborgen
// <input type="file" capture> — op iPhone (Safari) én Android (Chrome)
// opent dit direct de camera en regelt de browser zelf de
// toestemmingsvraag. Geen getUserMedia/permissions-gedoe nodig.
export default function PhotoCheckIn({ stop }) {
  const { checkInPhoto, mockMinutes } = useRoute()
  const inputRef = useRef(null)
  const [capturing, setCapturing] = useState(false)
  const captured = Boolean(stop.photoCaptured)

  // Open de camera (klik door naar de verborgen file-input).
  const openCamera = () => {
    if (capturing) return
    inputRef.current?.click()
  }

  // De gebruiker heeft een foto gemaakt/gekozen.
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    // Reset de input zodat dezelfde foto opnieuw kan triggeren.
    e.target.value = ''
    if (!file) return

    setCapturing(true)
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      checkInPhoto(stop.id, dataUrl)
      // Feest! Confetti op de feestdag (vr 19 juni) of in demo-modus.
      if (isPartyDay() || mockMinutes !== null) burstConfetti()
    } catch {
      // Foto kon niet verwerkt worden — laat de knop terugkeren.
    } finally {
      setCapturing(false)
    }
  }

  return (
    <div className="relative">
      {/* Verborgen camera-input: capture opent direct de camera op mobiel */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {/* Sluiter-flits */}
      <AnimatePresence>
        {capturing && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {captured ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/[0.09] p-3 backdrop-blur-md"
          >
            <img
              src={stop.photoCaptured}
              alt={`Foto bij ${stop.name}`}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-medium text-[14px] text-candy">
                <Check size={15} /> Ingecheckt
              </p>
              <p className="font-light text-[12px] text-ink/50">Foto opgeslagen</p>
            </div>
            <button
              onClick={openCamera}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-medium text-[12px] text-ink/70 active:scale-95"
            >
              <RefreshCw size={13} /> Opnieuw
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="capture"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={openCamera}
            disabled={capturing}
            className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-br from-candy to-[#E0A0BE] py-4 font-medium text-[16px] text-white shadow-candy disabled:opacity-80"
          >
            {/* Glans-veeg over de knop */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/30 blur-md"
              animate={{ x: ['-150%', '350%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
            />
            <Camera size={20} className="relative text-white" />
            <span className="relative">{capturing ? 'Lachen…' : 'Check in met foto'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
