/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deriv: {
          primary: '#ff444f',
          secondary: '#1a1d21',
          accent: '#00c8ff'
        }
      }
    },
  },
  plugins: [],
}
