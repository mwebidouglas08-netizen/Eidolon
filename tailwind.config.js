/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060D14',
          900: '#0D1B2A',
          800: '#0F2034',
          700: '#162232',
          600: '#1B2A3B',
          500: '#243344',
        },
        gold: { DEFAULT: '#C17B2E', light: '#E8943A', bright: '#F0A500' },
        steel: '#4A9EBF',
        mint: '#1D9E75',
        muted: '#7B9AB0',
        offwhite: '#E8EDF2',
      },
    },
  },
  plugins: [],
}
