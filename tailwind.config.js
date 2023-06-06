const path = require("node:path");
const colors = require("tailwindcss/colors");

const resolve = (dir) => path.resolve(__dirname, dir);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    resolve("./packages/next/**/*.{html,js,jsx}"),
    resolve("./packages/kintsugi-next/**/*.{html,js,jsx}"),
    resolve("./packages/next-common/**/*.{html,js,jsx}"),
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      // TODO: v2, fulfill colors
      neutral: {
        100: "#ffffff",
      },
    },
  },
  plugins: [],
};
