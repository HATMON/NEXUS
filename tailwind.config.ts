import type { Config } from "tailwindcss";

// Design tokens — "EcoVolt": a solar-energy marketplace.
// Palette grounded in the subject itself: dusk sky, not generic "eco green."
// Indigo evokes the sky a panel actually works against; gold is the sun/output.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101425",        // near-black indigo, primary text
        steel: "#4A5170",      // secondary text / borders
        dusk: "#1B2340",       // deep dusk-sky blue, primary surface accent
        signal: "#C17A1F",     // solar-gold (darkened for text contrast), used ONLY for price/CTA/output values
        paper: "#F6F5F1",      // page background, warm-neutral (not eco-green, not cream cliché)
        line: "#DEDBD2",       // hairline rule color
        panel: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
