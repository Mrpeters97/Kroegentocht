import { motion } from 'framer-motion'
import FloatingHead from './FloatingHead'

// FoilBalloonLogo — "Fake 3D" folieballon-cijfers, puur CSS/SVG.
// De cijfer-vórmen komen uit het nieuwe /images/logo.svg (de "29"),
// maar de stýling is overgenomen van het oude logo:
//   - metallic rosé-folie gradient over de cijfers
//   - een donkerder, verschoven & geblurde kopie eronder = volume/extrusie
//   - een glans-overlay (wit→transparant) over de bovenhelft
//   - gelaagde drop-shadows (CSS filter) voor zachte folie-glans + grondschaduw
// De '29' zweeft zachtjes; de avatar dobbert asynchroon mee.

// De twee cijfer-paths, geëxtraheerd uit public/images/logo.svg.
const TWO_PATH =
  'M1658.68 2115.72L469.784 2487.92L408.465 2292.05C943.935 1601.78 1062.18 1377.45 995.911 1165.79C947.449 1010.99 848.946 958.578 679.405 1011.66C477.219 1074.95 425.165 1230 525.686 1495.69L201.126 1552.2C66.5844 1181.54 209.557 921.716 622.352 792.484C982.496 679.736 1220.04 762.62 1305.75 1036.41C1392.13 1312.31 1272.64 1547.44 826.369 2112.66L836.515 2130.29C897.326 2106.63 957.021 2086.78 1021.26 2066.67L1587.8 1889.31L1658.68 2115.72Z'
const NINE_PATH =
  'M2168.36 2342.32C1794.33 2260.43 1615.96 2058.72 1646.23 1750.19L1981.2 1778.35C1952.84 1969.81 2040.47 2090.66 2224.79 2131.01C2458.7 2182.22 2620.05 2033.43 2700.28 1666.93L2702.88 1655.08C2583.35 1741.87 2412.52 1768.85 2219.57 1726.61C1862.78 1648.5 1704.02 1439.79 1770.57 1135.81L1771.28 1132.58C1839.71 819.982 2111.72 692.021 2517.01 780.753C2963.27 878.452 3132.43 1158.35 3028.83 1631.55L3016.8 1686.53C2902.58 2208.24 2604.92 2437.89 2168.36 2342.32ZM2353.81 1557.19C2553.22 1600.85 2690.64 1530.4 2727.93 1360.09L2728.63 1356.86C2768.75 1173.61 2674.86 1040.1 2465.74 994.315C2254.47 948.061 2127.46 1017.4 2087.11 1201.72L2086.63 1203.88C2045.81 1390.36 2134.99 1509.29 2353.81 1557.19Z'

// Beide cijfers samen, als één groep zodat de gradient continu over de "29" loopt.
function Digits({ fill, fillOpacity }) {
  return (
    <g fill={fill} fillOpacity={fillOpacity} fillRule="evenodd">
      <path d={TWO_PATH} />
      <path d={NINE_PATH} />
    </g>
  )
}

// Zachte folie-glans + grondschaduw — exact de waardes uit het oude logo,
// in scherm-pixels via een CSS filter op het SVG-element.
const GLOW =
  'drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 2px 1px rgba(255,255,255,0.5)) drop-shadow(0 16px 16px rgba(210,62,126,0.35)) drop-shadow(0 4px 3px rgba(193,75,135,0.45))'

export default function FoilBalloonLogo() {
  return (
    <div className="relative inline-block">
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 4, 0, -4, 0], rotate: [-3, 3, -2, 2, -3], scale: [1, 1.03, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
        style={{ width: 'clamp(150px, 46vw, 210px)' }}
      >
        <svg
          viewBox="0 640 3184 1900"
          className="block w-full select-none"
          style={{ filter: GLOW }}
          aria-label="29"
          role="img"
        >
          <defs>
            {/* Metallic rosé-folie verloop met een lichte reflectieband (≈160deg). */}
            <linearGradient id="foil" gradientUnits="userSpaceOnUse" x1="900" y1="680" x2="1750" y2="2488">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="16%" stopColor="#FFE3F0" />
              <stop offset="40%" stopColor="#FF9FC9" />
              <stop offset="52%" stopColor="#F86FA8" />
              <stop offset="64%" stopColor="#FFA9CE" />
              <stop offset="82%" stopColor="#F25E9C" />
              <stop offset="100%" stopColor="#D23E7E" />
            </linearGradient>
            {/* Donkere kopie voor de extrusie eronder. */}
            <linearGradient id="foilDeep" gradientUnits="userSpaceOnUse" x1="900" y1="680" x2="1750" y2="2488">
              <stop offset="0%" stopColor="#E36AA0" />
              <stop offset="60%" stopColor="#C73C7B" />
              <stop offset="100%" stopColor="#9E2A60" />
            </linearGradient>
            {/* Glans bovenlangs (verticaal). */}
            <linearGradient id="gloss" gradientUnits="userSpaceOnUse" x1="0" y1="680" x2="0" y2="2488">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="26%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="46%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <filter id="extrudeBlur" x="-10%" y="-10%" width="120%" height="130%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          {/* Extrusie-laag: donker, verschoven en geblurd → volume */}
          <g transform="translate(0,55)" filter="url(#extrudeBlur)" opacity="0.6">
            <Digits fill="url(#foilDeep)" />
          </g>

          {/* Hoofd-laag: metallic folie */}
          <Digits fill="url(#foil)" />

          {/* Glans-overlay over de bovenhelft */}
          <Digits fill="url(#gloss)" />
        </svg>
      </motion.div>

      {/* Zwevend hoofd mét feesthoedje, asynchroon t.o.v. de ballon.
          Net als in logo.svg staat het hoofd tússen de cijfers: horizontaal
          gecentreerd in de gap tussen de "2" en de "9". De buitenste laag
          regelt het centreren (CSS-transform); de binnenste dobbert los.
          De avatar zit iets links van het exacte midden, want de gap tussen
          de cijfers ligt daar. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="-translate-x-[6%] -translate-y-[10%]">
          <motion.div
            animate={{ y: [0, -14, 0], x: [0, -5, 0, 5, 0], rotate: [-8, 8, -6, 6, -8] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <FloatingHead size={110} src="/images/jarige.png" hat />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
