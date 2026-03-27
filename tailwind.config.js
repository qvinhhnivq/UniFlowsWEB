/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        fg: '#f0ece3',
        accent: '#c8f542',
        muted: '#222',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        serif: ['var(--font-noto-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}
