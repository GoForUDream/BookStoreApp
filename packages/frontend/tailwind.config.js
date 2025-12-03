/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#db637c', light: '#e98a9d', dark: '#c4506a' },
        secondary: { DEFAULT: '#687890', light: '#8a9bb0', dark: '#4f5d70' },
        pastel: {
          pink: '#FFD6E0',
          peach: '#FFEDDA',
          yellow: '#FFF3CD',
          mint: '#D4EDDA',
          sky: '#D1ECF1',
          lavender: '#E2D9F3',
          rose: '#F8D7DA',
          cream: '#FFF8E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
