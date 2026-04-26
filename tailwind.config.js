/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f7efe1',
        beige: '#e9d9bd',
        sand: '#d9c39a',
        terracotta: '#c0673f',
        clay: '#a04e2a',
        bark: '#5b3a22',
        moss: '#7a8a4b',
        leaf: '#9bab6a',
        ink: '#2a1a10',
        parchment: '#fbf6ea',
        nightcream: '#1f1812',
        nightbeige: '#2c241c',
        nightsand: '#3a2f24',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cottage: '0 6px 0 0 rgba(91, 58, 34, 0.3), 0 10px 24px -8px rgba(91, 58, 34, 0.35)',
        cottageSm: '0 3px 0 0 rgba(91, 58, 34, 0.3), 0 6px 14px -6px rgba(91, 58, 34, 0.3)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120vh) rotate(720deg)', opacity: '0.2' },
        },
      },
      animation: {
        pop: 'pop 220ms ease-out',
        flip: 'flip 500ms ease-in-out',
        slideUp: 'slideUp 280ms ease-out',
        confetti: 'confetti 2.4s linear forwards',
      },
    },
  },
  plugins: [],
};
