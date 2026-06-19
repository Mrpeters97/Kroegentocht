import { motion } from 'framer-motion'
import FoilBalloonLogo from './FoilBalloonLogo'

export default function TopBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center pt-[calc(env(safe-area-inset-top)+10px)] pb-2"
    >
      {/* De 29 + gezicht dansen, en overlappen straks net de bovenkant van de titel */}
      <div className="relative z-10">
        <FoilBalloonLogo />
      </div>

      {/* Grote, gestapelde caps-titel — schuift met negatieve marge onder de ballon */}
      <h1 className="title-fat relative z-0 -mt-5 text-center font-wide font-bold uppercase leading-[0.92] tracking-[0.02em] text-ink">
        <span className="block text-[42px]">Verjaardags</span>
        <span className="block text-[42px]">Kroegentocht</span>
      </h1>
    </motion.header>
  )
}
