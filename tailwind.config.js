const path = require("node:path");
const light = require("./packages/next-common/styles/light").default;

const resolve = (dir) => path.resolve(__dirname, dir);

/**
 * `light.neutral100` -> `{ neutral100: 'var(--neutral100)' }`
 */
const twThemeVariables = Object.keys(light).reduce((value, key) => {
  value[key] = `var(--${key})`;
  return value;
}, {});

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    resolve("./packages/next/**/*.{html,js,jsx}"),
    resolve("./packages/kintsugi-next/**/*.{html,js,jsx}"),
    resolve("./packages/next-common/**/*.{html,js,jsx}"),
  ],
  theme: {
    colors: twThemeVariables,
    screens: {
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      pad: "1080px",
    },
    extend: {
      borderRadius: {
        "2xl": "14px",
        "3xl": "16px",
      },
      boxShadow: {
        100: "0px 6px 7px rgba(30, 33, 52, 0.02),0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786)",
        200: "0px 6px 22px rgba(30, 33, 52, 0.11), 0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718), 0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282)",
      },
    },
  },
  plugins: [
    require("./packages/next-common/styles/tailwind-plugins/scrollbar").plugin,
    require("./packages/next-common/styles/tailwind-plugins/fonts").plugin,
  ],
};
