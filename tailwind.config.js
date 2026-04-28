/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0d',
        paper: '#ffffff',
        wash: '#f5f5f6',
        line: '#0d0d0d',
        muted: '#6b6b6f',
        // Action colors picked to match the Lovable mockups.
        sky: '#5b9bd5',
        skydeep: '#3d7ec2',
        meadow: '#5ec569',
        meadowdeep: '#3fa84a',
        amber: '#f5a524',
        amberdeep: '#d8851a',
        gold: '#ffd866',
        nightpaper: '#16161a',
        nightwash: '#1f1f24',
      },
      fontFamily: {
        display: ['"Nunito"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      boxShadow: {
        // Sharp neobrutalist offset, no blur.
        nb: '4px 4px 0 0 #0d0d0d',
        nbSm: '3px 3px 0 0 #0d0d0d',
        nbLg: '6px 6px 0 0 #0d0d0d',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
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
        slideUp: 'slideUp 240ms ease-out',
        confetti: 'confetti 2.4s linear forwards',
      },
    },
  },
  plugins: [],
};
