/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#120820',
        violetdeep: '#1E0B36',
        violet: '#4C1D95',
        neon: '#7C3AED',
        candle: '#FACC15',
        goldlight: '#FDE047',
      },
      fontFamily: { thai: ['Noto Sans Thai', 'sans-serif'] },
      boxShadow: {
        glow: '0 0 34px rgba(250, 204, 21, .22)',
        purple: '0 0 40px rgba(124, 58, 237, .24)',
      },
    },
  },
  plugins: [],
}
