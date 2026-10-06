import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080608",
        gold: {
          light: "#F7E9AA",
          DEFAULT: "#D4AF37",
          dark: "#9E7811",
          rich: "#C59B27",
        },
        champagne: {
          light: "#FAF0E2",
          DEFAULT: "#F7E7CE",
          dark: "#DFCAA8",
        },
        blush: {
          light: "#FFF0F2",
          DEFAULT: "#F7D1D5",
          dark: "#E3AAB0",
        },
        rose: {
          subtle: "#FCEAE6",
          DEFAULT: "#E0A899",
          dark: "#B86F5E",
        },
        burgundy: {
          light: "#6E1B26",
          DEFAULT: "#4A0E17",
          dark: "#2C0710",
          deep: "#150206",
        },
        ivory: {
          DEFAULT: "#FFFDF9",
          muted: "#EDE7DF",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        amiri: ["var(--font-amiri)", "serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.4", filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))" },
          "100%": { opacity: "0.8", filter: "drop-shadow(0 0 25px rgba(212, 175, 55, 0.6))" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 50px rgba(212, 175, 55, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
