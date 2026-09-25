/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#0A0F2C',
        deep: '#0D1B4B',
        aqua: '#00E5FF',
        gold: '#FFD700',
        foam: '#E8F4FD',
        mist: '#8DB4CC',
        kelp: '#00E676',
        amber: '#FFB300',
        coral: '#FF1744',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        wave: 'wave 14s linear infinite',
        'wave-slow': 'wave 26s linear infinite',
        'spin-slow': 'spinSlow 9s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
