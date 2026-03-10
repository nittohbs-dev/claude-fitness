/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crab: {
          red: '#E53E3E',
          dark: '#C53030',
          light: '#FC8181',
          shell: '#DD6B20',
          shell2: '#F6AD55',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        confetti: 'confetti 3s ease-in forwards',
      },
    },
  },
  plugins: [],
}
