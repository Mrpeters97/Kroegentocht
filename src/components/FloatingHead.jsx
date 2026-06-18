import { useState } from 'react'

// FloatingHead — toont een rond uitgesneden hoofd (zonnebril + lach).
//
// Verwacht het bronbestand op /floating-head.png (of .jpg) in /public.
// Sleep daar je foto uit `image_29a5ca.jpg` neer; vierkant bijgesneden
// werkt het mooist. Zolang het bestand ontbreekt valt de component
// terug op een pastel placeholder-gezichtje, zodat de app blijft werken.
export default function FloatingHead({ size = 56, src = '/images/image_29a5ca.jpg' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border-[3px] border-white/90 bg-white/10 shadow-glass ring-1 ring-white/20"
      style={{ width: size, height: size }}
    >
      {!failed ? (
        <img
          src={src}
          alt="Jarige"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        // Pastel placeholder: rond koppie met zonnebril + glimlach
        <svg viewBox="0 0 56 56" className="h-full w-full">
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
