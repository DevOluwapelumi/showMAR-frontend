/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "#111827", // dark background
      secondary: "#1F2937", // card bg
      accent: "#E50914", // Netflix red
      },
    },
  },
  plugins: [],
}
