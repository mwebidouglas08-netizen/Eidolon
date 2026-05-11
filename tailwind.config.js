/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        gold: {
          DEFAULT: '#C17B2E',
          light: '#E8943A',
          bright: '#F0A500',
        },
        steel: '#4A9EBF',
        mint: '#1D9E75',
        muted: '#7B9AB0',
        offwhite: '#E8EDF2',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'none' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        glow: { from: { boxShadow: '0 0 8px rgba(193,123,46,0.3)' }, to: { boxShadow: '0 0 20px rgba(193,123,46,0.7)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(74,158,191,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,191,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
