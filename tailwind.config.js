/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ganadero-green': '#2D5A27',
        'ganadero-dark': '#1B2E1A',
      }
    },
  },
  plugins: [],
}