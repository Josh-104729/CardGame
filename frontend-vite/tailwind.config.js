/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        card: {
          red: '#dc2626',
          black: '#1f2937',
        },
        game: {
          bg: '#0f766e',
          surface: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}

