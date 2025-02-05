/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-once': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'spin-once': 'spin-once 0.5s linear'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default tailwindConfig;
