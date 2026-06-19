import { motion } from 'framer-motion'
import FoilBalloonLogo from './FoilBalloonLogo'

export default function TopBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center pt-[calc(env(safe-area-inset-top)+44px)] pb-2"
    >
      {/* De 29 + gezicht dansen, en overlappen straks net de bovenkant van de titel */}
      <div className="relative z-10">
        <FoilBalloonLogo />
      </div>

      {/* Grote, gestapelde caps-titel — schuift met negatieve marge onder de
          ballon. Lettergrootte schaalt mee met de schermbreedte (clamp) zodat
          de titel op smalle telefoons dezelfde marges/lucht houdt als op een
          breed desktop-scherm, i.p.v. van rand tot rand te stretchen. */}
      <h1 className="title-fat relative z-0 -mt-5 px-4 text-center font-wide font-medium uppercase leading-[0.92] tracking-[0.02em] text-ink">
        <span className="block text-[clamp(28px,7.8vw,42px)]">Verjaardags</span>
        <span className="block text-[clamp(28px,7.8vw,42px)]">Kroegentocht</span>
      </h1>
    </motion.header>
  )
}
