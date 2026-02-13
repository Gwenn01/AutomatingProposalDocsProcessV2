/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing colors
        primaryGreen: "#058C42",
        secondary: "#08AA52"

      },
    },
  },
  plugins: [],
}