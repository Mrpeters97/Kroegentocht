import { motion } from 'framer-motion'

// Schuin hangende slinger met vlaggetjes, van linksboven naar
// ~rechtsonder (niet helemaal beneden). Het touw is een doorzakkende
// Bézier-curve; elk vlaggetje kantelt mee met de lokale helling van
// het touw (loodrecht erop), net als een echte bunting.

// Touw: P0 linksboven → P2 rechts, lager; P1 zorgt voor de doorzak.
const P0 = [6, 20]
const P1 = [172, 154]
const P2 = [352, 162]

function bezier(t) {
  const u = 1 - t
  return [
    u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0],
    u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1],
  ]
}

// Raaklijn-hoek (in graden) van de curve op parameter t.
function tangentDeg(t) {
  const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])
  const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

const COLORS = ['#E879A6', '#7FB2E8', '#C9A8FF', '#7FE8C2', '#FFD27F']
const N = 13
const FLAGS = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1)
  const [x, y] = bezier(t)
  return { x, y, angle: tangentDeg(t), color: COLORS[i % COLORS.length] }
})

const ROPE = `M${P0[0]},${P0[1]} Q${P1[0]},${P1[1]} ${P2[0]},${P2[1]}`

export default function Garland() {
  return (
    <motion.svg
      className="pointer-events-none absolute left-0 top-[12%] w-full"
      viewBox="0 0 360 240"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      style={{ transformOrigin: '6px 20px' }}
      animate={{ rotate: [-0.8, 0.8, -0.8] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Touw */}
      <path d={ROPE} stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" strokeLinecap="round" />

      {FLAGS.map((f, i) => (
        // Draai het vlaggetje mee met de helling van het touw.
        <g key={i} transform={`rotate(${f.angle} ${f.x} ${f.y})`}>
          <polygon
            points={`${f.x - 8},${f.y + 1} ${f.x + 8},${f.y + 1} ${f.x},${f.y + 17}`}
            fill={f.color}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.6"
          />
          {/* Klein highlight-streepje voor wat volume */}
          <line
            x1={f.x - 3}
            y1={f.y + 4}
            x2={f.x}
            y2={f.y + 13}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>
      ))}
    </motion.svg>
  )
}
