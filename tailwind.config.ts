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
        primaryBtnColor: "var(--primary-btn-color)",
        primaryBtnColorHover: "var(--primary-btn-color-hover)",
        secondaryBtnColor: "var(--secondary-btn-color)",
        secondaryBtnColorHover: "var(--secondary-btn-color-hover)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
