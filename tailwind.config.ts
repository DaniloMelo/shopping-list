import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primaryLightBG: "var(--primary-ligth-bg)",
        secondaryLightBG: "var(--secondary-light-bg)",
        lightTxt: "var(--light-txt)",
        primaryDarkBG: "var(--primary-dark-bg)",
        secondaryDarkBG: "var(--secondary-dark-bg)",
        darkTxt: "var(--dark-txt)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
