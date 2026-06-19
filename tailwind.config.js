/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Donker canvas
        base: '#0B0712',
        surface: '#16101F',
        // Primaire (lichte) tekstkleur — token heet 'ink' (helder wit)
        ink: '#F7F5FF',
        // Roze accent — zachter/minder neon
        candy: {
          DEFAULT: '#E879A6',
          soft: '#FFC2D6',
        },
        blush: '#FFB6CE',
        sky: '#A9D6FF',
        lilac: '#C9B8FF',
      },
      fontFamily: {
        // Overal de Wide-variant van PP Right Grotesk. De verschillende
        // 'gewichten' (medium/light) komen uit font-weight, niet uit een
        // aparte (smalle) font-family.
        // Alleen 'wide' (titels) gebruikt de brede cut; de rest gewone breedte.
        wide: ['PPRightGrotesk-Wide', 'system-ui', 'sans-serif'],
        medium: ['PPRightGrotesk', 'system-ui', 'sans-serif'],
        light: ['PPRightGrotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        polaroid: '0 16px 36px rgba(0,0,0,0.6)',
        glass: '0 10px 30px rgba(0,0,0,0.45)',
        candy: '0 6px 18px rgba(232,121,166,0.28)',
      },
    },
  },
  plugins: [],
}
