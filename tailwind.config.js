/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka"', 'sans-serif'],
        baloo: ['"Baloo 2"', 'cursive'],
        comic: ['"Comic Neue"', 'cursive'],
      },
      colors: {
        brand: {
          brown: {
            50: '#fdfaf6',
            100: '#f9f6f1',
            200: '#f2e8d8',
            300: '#e8d4c0',
            400: '#d7ccc8',
            500: '#c05c3c',
            600: '#a84a2e',
            700: '#8b3d25',
            800: '#4B2E2E',
            900: '#2d1b1b',
          },
          terracotta: {
            50: '#fdf8f3',
            100: '#fcefe6',
            200: '#f8dcc8',
            300: '#f2c4a0',
            400: '#f2a65a',
            500: '#e8943a',
            600: '#d97a2a',
            700: '#b45e24',
            800: '#8f4a22',
            900: '#743d1f',
          }
        }
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 12px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 16px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
} 