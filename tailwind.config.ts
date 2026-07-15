import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#EDE7DA",       // Daş - warm limestone
        paper: "#FBF8F2",
        ink: "#16302C",      // deep petrol-green
        "ink-soft": "#45564F",
        teal: { DEFAULT: "#2F6F63", deep: "#1D4A41" },
        gold: { DEFAULT: "#C98A3B", deep: "#8C5E23" },
        brick: { DEFAULT: "#A84B34", deep: "#8F3D29" },
        line: "rgba(22,48,44,0.14)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;