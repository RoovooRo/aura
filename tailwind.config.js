/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#06070b",
          800: "#0b0d14",
          700: "#11141d",
          600: "#1a1e2a",
          500: "#262b3a",
        },
        aura: {
          gold: "#f5c54a",
          ember: "#ff6a3d",
          arc: "#5ad7ff",
          beam: "#a4f0ff",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 32px -4px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [],
};
