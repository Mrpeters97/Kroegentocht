import { useState } from 'react'

// Feesthoedje in dezelfde pastel-stijl als de slinger/ballonnen:
// een kegel met polka-dots, een gekartelde witte rand en een pom-pom
// bovenop. Het zit ín het hoofd-component, dus het beweegt/roteert
// automatisch mee met het zwevende hoofd.
function PartyHat({ size }) {
  const w = size * 0.50
  const h = size * 0.7
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 50"
      fill="none"
      className="pointer-events-none absolute left-1/2 top-0 z-10"
      style={{ transform: 'translate(-50%, -56%) rotate(14deg)', transformOrigin: 'bottom center' }}
    >
      <defs>
        <linearGradient id="hat-cone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE3F0" />
          <stop offset="45%" stopColor="#FF9FC9" />
          <stop offset="100%" stopColor="#D23E7E" />
        </linearGradient>
        <clipPath id="hat-clip">
          <polygon points="20,5 7,44 33,44" />
        </clipPath>
      </defs>

      {/* Kegel */}
      <polygon
        points="20,5 7,44 33,44"
        fill="url(#hat-cone)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.8"
      />

      {/* Polka-dots (geclipt op de kegel) */}
      <g clipPath="url(#hat-clip)">
        <circle cx="18" cy="17" r="2.4" fill="#FFD27F" />
        <circle cx="24" cy="25" r="2.2" fill="#7FE8C2" />
        <circle cx="15" cy="31" r="2.6" fill="#7FB2E8" />
        <circle cx="24" cy="37" r="2.3" fill="#C9A8FF" />
        <circle cx="29" cy="34" r="1.7" fill="#FFD27F" />
        {/* Zachte glansveeg langs links */}
        <polygon points="20,5 12,42 16,43" fill="rgba(255,255,255,0.35)" />
      </g>

      {/* Gekartelde witte rand onderaan */}
      <g fill="#ffffff">
        <circle cx="9" cy="44" r="2" />
        <circle cx="15" cy="45" r="2" />
        <circle cx="21" cy="45.2" r="2" />
        <circle cx="27" cy="45" r="2" />
        <circle cx="32" cy="44" r="2" />
      </g>

      {/* Pom-pom + pluksels bovenop */}
      <g stroke="#FFD27F" strokeWidth="1.3" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="1" />
        <line x1="20" y1="6" x2="24" y2="2.5" />
        <line x1="20" y1="6" x2="16" y2="2.5" />
      </g>
      <circle cx="20" cy="6" r="4.3" fill="#FFD27F" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6" />
    </svg>
  )
}

// FloatingHead — toont een zwevend, vooraf uitgesneden hoofd.
//
// Verwacht het (transparante) bronbestand op /images/jarige.png in
// /public. De afbeelding is al uitgesneden, dus geen CSS-masker nodig;
// we tonen 'm gewoon met een zachte slagschaduw zodat hij lijkt te
// zweven. Zolang het bestand ontbreekt valt de component terug op een
// pastel placeholder-gezichtje.
export default function FloatingHead({ size = 56, src = '/images/jarige.png', hat = false }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size, filter: 'drop-shadow(0 6px 9px rgba(0,0,0,0.45))' }}
    >
      {hat && <PartyHat size={size} />}
      {!failed ? (
        <img
          src={src}
          alt="Jarige"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        // Pastel placeholder: rond koppie met zonnebril + glimlach
        <svg viewBox="0 0 56 56" className="h-full w-full rounded-full border-[3px] border-white/90">
          <defs>
            <radialGradient id="head-skin" cx="40%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#FFE7D6" />
              <stop offset="100%" stopColor="#FFC9B0" />
            </radialGradient>
          </defs>
          <rect width="56" height="56" fill="#FFD9E8" />
          <circle cx="28" cy="30" r="18" fill="url(#head-skin)" />
          {/* Zonnebril */}
          <rect x="14" y="24" width="11" height="8" rx="3" fill="#1E1B4B" />
          <rect x="31" y="24" width="11" height="8" rx="3" fill="#1E1B4B" />
          <rect x="24" y="26" width="8" height="2.4" rx="1.2" fill="#1E1B4B" />
          {/* Lach */}
          <path d="M21 38 Q 28 45 35 38" stroke="#1E1B4B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      )}
    </div>
  )
}
