/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kumar: ['"Kumar One"', "cursive"],
        inter: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg) scale(1.1)" },
          "50%": { transform: "rotate(3deg) scale(1.1)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
