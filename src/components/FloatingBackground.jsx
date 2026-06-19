import { motion } from 'framer-motion'
import Garland from './Garland'

// Zachte, onscherpe gloed-blobs voor diepte (ver weg).
// Let op: een bewegende blob met grote blur-radius is op mobiel erg duur
// (elke frame een grote repaint). We houden de blur daarom gematigd en
// leunen op de lage opacity + grote 'size' voor de zachte gloed.
const BLOBS = [
  { x: '-12%', y: '6%', size: 240, color: '#B85C8E', blur: 48, dur: 17, drift: 36, op: 0.16 },
  { x: '72%', y: '2%', size: 180, color: '#5E7FB8', blur: 44, dur: 14, drift: -30, op: 0.14 },
  { x: '78%', y: '60%', size: 260, color: '#7A5FB0', blur: 56, dur: 20, drift: 28, op: 0.16 },
  { x: '-8%', y: '66%', size: 200, color: '#A86A9A', blur: 50, dur: 16, drift: -26, op: 0.14 },
]

// Echte, zichtbare 3D-ballonnen (lichaam + knoopje + touwtje).
// 'blur' geeft een paar exemplaren diepte (parallax).
const BALLOONS = [
  { x: '6%', y: '30%', size: 64, color: '#FF7DAE', dark: '#C24D80', dur: 9, delay: 0, rot: -6, blur: 0 },
  { x: '82%', y: '24%', size: 56, color: '#7FB2E8', dark: '#3F6FB0', dur: 11, delay: 1.2, rot: 7, blur: 0 },
  { x: '70%', y: '70%', size: 76, color: '#C9A8FF', dark: '#7E5BC2', dur: 12.5, delay: 0.6, rot: -5, blur: 0 },
  { x: '16%', y: '74%', size: 60, color: '#7FE8C2', dark: '#3FAE89', dur: 10.5, delay: 1.8, rot: 6, blur: 0 },
  { x: '40%', y: '84%', size: 50, color: '#FFD27F', dark: '#C99B3F', dur: 13, delay: 0.4, rot: -4, blur: 0.4 },
  { x: '90%', y: '48%', size: 44, color: '#FF9DC2', dark: '#C95E8E', dur: 9.5, delay: 2.2, rot: 8, blur: 1 },
  { x: '-2%', y: '50%', size: 48, color: '#A6C2E6', dark: '#5E7FB8', dur: 11.5, delay: 1, rot: -8, blur: 1.2 },
]

function Balloon({ x, y, size, color, dark, dur, delay, rot, blur }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, filter: blur ? `blur(${blur}px)` : undefined, willChange: 'transform' }}
      animate={{ y: [0, -22, 0], x: [0, 7, 0, -7, 0], rotate: [rot - 5, rot + 5, rot - 5] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="relative" style={{ width: size, height: size * 1.22 }}>
        {/* Lichaam */}
        <div
          className="rounded-[50%]"
          style={{
            width: size,
            height: size * 1.22,
            background: `radial-gradient(circle at 34% 27%, #ffffffd9 0%, ${color} 50%, ${dark} 100%)`,
            boxShadow: `inset -5px -7px 13px ${dark}aa, inset 6px 8px 15px #ffffff70, 0 12px 20px rgba(0,0,0,0.4)`,
          }}
        />
        {/* Knoopje */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: size * 1.18,
            width: size * 0.16,
            height: size * 0.13,
            background: dark,
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            borderRadius: 2,
          }}
        />
        {/* Touwtje */}
        <svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: size * 1.28 }}
          width="14"
          height={size * 0.5}
          viewBox="0 0 14 40"
          fill="none"
        >
          <path
            d="M7 0 C 2 8, 12 14, 6 22 C 1 30, 10 34, 7 40"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  )
}

export default function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Verre gloed-blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: b.color,
            filter: `blur(${b.blur}px)`,
            opacity: b.op,
            willChange: 'transform',
          }}
          animate={{ y: [0, b.drift, 0], x: [0, b.drift * 0.4, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Schuine slinger met vlaggetjes */}
      <Garland />

      {/* Zwevende 3D-ballonnen */}
      {BALLOONS.map((b, i) => (
        <Balloon key={`balloon-${i}`} {...b} />
      ))}
    </div>
  )
}
