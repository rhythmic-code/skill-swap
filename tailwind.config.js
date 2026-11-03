/** @type {import('tailwindcss').Config} */
// Hallmark Coral redesign — Tailwind is used for layout utilities only.
// All colours and typography go through the CSS token system in tokens.css.
// The default palette (indigo-500, slate-900, etc.) is not used as design tokens.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
