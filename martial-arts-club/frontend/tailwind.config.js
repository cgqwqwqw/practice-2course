/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161512",
        "ink-soft": "#211f1a",
        paper: "#EDE8DD",
        "paper-dim": "#DED7C6",
        vermilion: "#A8342A",
        "vermilion-bright": "#C24A3B",
        gold: "#B08A4E",
        sage: "#6B7660",
      },
      fontFamily: {
        display: ["'Shippori Mincho'", "serif"],
        sans: ["'Zen Kaku Gothic New'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
