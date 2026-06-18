import { motion } from 'framer-motion'
import FloatingHead from './FloatingHead'

// FoilBalloonLogo — "Fake 3D" folieballon-cijfers, puur CSS.
// Geen canvas/WebGL, geen externe afbeeldingen voor de cijfers:
//   - metallic pastel-gradient via background-clip: text
//   - een donkerder, verschoven & geblurde kopie eronder = volume/extrusie
//   - gelaagde drop-shadows (filter) voor zachte folie-glans + grondschaduw
//   - een glans-overlay (wit→transparant) over de bovenhelft
// De '29' zweeft zachtjes; de avatar dobbert asynchroon mee.

// Metallic rosé-folie verloop met een lichte reflectieband halverwege.
const FOIL =
  'linear-gradient(160deg, #FFFFFF 0%, #FFE3F0 16%, #FF9FC9 40%, #F86FA8 52%, #FFA9CE 64%, #F25E9C 82%, #D23E7E 100%)'
// Donkere kopie voor de extrusie eronder.
const FOIL_DEEP =
  'linear-gradient(160deg, #E36AA0 0%, #C73C7B 60%, #9E2A60 100%)'
// Glans bovenlangs.
const GLOSS =
  'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 26%, rgba(255,255,255,0) 46%)'

const digitStyle = {
  fontSize: 'clamp(76px, 26vw, 116px)',
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: '-0.02em',
}

export default function FoilBalloonLogo() {
  return (
    <div className="relative inline-flex items-end justify-center">
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 4, 0, -4, 0], rotate: [-3, 3, -2, 2, -3], scale: [1, 1.03, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative font-wide"
        style={digitStyle}
      >
        {/* Extrusie-laag: donker, verschoven en geblurd → volume */}
        <span
          aria-hidden
          className="absolute inset-0 select-none bg-clip-text text-transparent"
          style={{
            backgroundImage: FOIL_DEEP,
            WebkitBackgroundClip: 'text',
            transform: 'translateY(6px)',
            filter: 'blur(3px)',
            opacity: 0.6,
          }}
        >
          29
        </span>

        {/* Hoofd-laag: metallic folie + zachte glans-schaduwen */}
        <span
          className="relative bg-clip-text text-transparent"
          style={{
            backgroundImage: FOIL,
            WebkitBackgroundClip: 'text',
            filter:
              'drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 2px 1px rgba(255,255,255,0.5)) drop-shadow(0 16px 16px rgba(210,62,126,0.35)) drop-shadow(0 4px 3px rgba(193,75,135,0.45))',
          }}
        >
          29
        </span>

        {/* Glans-overlay over de bovenhelft */}
        <span
          aria-hidden
          className="absolute inset-0 select-none bg-clip-text text-transparent"
          style={{
            backgroundImage: GLOSS,
            WebkitBackgroundClip: 'text',
          }}
        >
          29
        </span>
      </motion.div>

      {/* Zwevende avatar, asynchroon t.o.v. de ballon */}
      <motion.div
        animate={{ y: [0, -14, 0], x: [0, -5, 0, 5, 0], rotate: [-8, 8, -6, 6, -8] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-2 -right-5 z-10"
      >
        <FloatingHead size={56} src="/images/image_29a5ca.jpg" />
      </motion.div>
    </div>
  )
}
