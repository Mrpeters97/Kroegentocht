import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, RefreshCw, Download, Share2 } from 'lucide-react'
import { useRoute } from '../hooks/useRoute'
import { burstConfetti, isPartyDay } from '../lib/celebrate'
import { fileToResizedDataUrl, savePolaroid } from '../lib/image'
import { buildPolaroidDataUrl } from '../lib/polaroid'

// Foto-check-in met échte camera. We gebruiken een verborgen
// <input type="file" capture> — op iPhone (Safari) én Android (Chrome)
// opent dit direct de camera en regelt de browser zelf de
// toestemmingsvraag. Geen getUserMedia/permissions-gedoe nodig.
export default function PhotoCheckIn({ stop }) {
  const { checkInPhoto, mockMinutes } = useRoute()
  const inputRef = useRef(null)
  const [capturing, setCapturing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [polaroid, setPolaroid] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const captured = Boolean(stop.photoCaptured)

  // Bouw de polaroid-preview zodra er een foto is (en herbouw bij wijziging).
  // Deze preview is meteen óók wat je downloadt.
  useEffect(() => {
    let alive = true
    if (!captured) {
      setPolaroid(null)
      return
    }
    buildPolaroidDataUrl({ photo: stop.photoCaptured })
      .then((url) => alive && setPolaroid(url))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [captured, stop.photoCaptured, stop.name])

  // Open een preview van de polaroid; bouw 'm desnoods alsnog. Vanuit de
  // preview kan de gebruiker 'm bewaren in z'n Foto's (deel-menu) of de
  // afbeelding ingedrukt houden om 'm direct op te slaan.
  const openPreview = async () => {
    if (!captured || downloading) return
    setDownloading(true)
    try {
      const url =
        polaroid ||
        (await buildPolaroidDataUrl({ photo: stop.photoCaptured }))
      if (!polaroid) setPolaroid(url)
      setShowPreview(true)
    } catch {
      /* niets te tonen */
    } finally {
      setDownloading(false)
    }
  }

  // Bewaar via het native deel-menu (→ "Bewaar afbeelding" / camerarol).
  const handleSave = () => {
    if (polaroid) savePolaroid(polaroid, `polaroid-${stop.id}.png`)
  }

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
            className="rounded-2xl border border-white/20 bg-white/[0.09] p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              {/* Kleine foto-preview */}
              <img
                src={stop.photoCaptured}
                alt={`Foto bij ${stop.name}`}
                className="h-14 w-14 rounded-xl object-cover"
              />
              <p className="flex flex-1 items-center gap-1.5 font-medium text-[14px] text-candy">
                <Check size={15} /> Skitterend
              </p>
              <button
                onClick={openCamera}
                className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-medium text-[12px] text-ink/70 active:scale-95"
              >
                <RefreshCw size={13} /> Opnieuw
              </button>
            </div>

            <button
              onClick={openPreview}
              disabled={downloading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-candy py-2.5 font-medium text-[14px] text-white shadow-candy active:scale-95 disabled:opacity-70"
            >
              <Download size={16} />
              {downloading ? 'Polaroid maken…' : 'Download als polaroid'}
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

      {/* Preview-overlay via een portal naar <body>, zodat hij niet binnen
          een ge-transformeerde ouder (de kaart) gevangen zit maar écht het
          hele scherm bedekt en gecentreerd wordt. Achtergrond wordt gedimd. */}
      {createPortal(
        <AnimatePresence>
          {showPreview && polaroid && (
            <motion.div
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-5 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
            >
              <motion.img
                src={polaroid}
                alt="Polaroid-preview"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.92, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="max-h-[72vh] w-auto rounded-2xl shadow-2xl"
              />
              <p className="mt-4 max-w-xs text-center font-light text-[12px] text-white/70">
                Houd de afbeelding ingedrukt om 'm te bewaren, of tik hieronder.
              </p>
              <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-full bg-candy px-5 py-2.5 font-medium text-[14px] text-white shadow-candy active:scale-95"
                >
                  <Share2 size={16} /> Bewaar in Foto's
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2.5 font-medium text-[14px] text-white/80 active:scale-95"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
