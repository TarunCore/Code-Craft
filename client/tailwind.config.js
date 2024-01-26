/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "editor-bg":"#1e1e1e",
        "file-bg":"#252526",
        "file-bg-hover":"#2a2d2e",
        "file-selected":"#37373d",
        "file-name-top":"#0d1117"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    }
  },
  plugins: [],
}

