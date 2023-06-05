const path = require("node:path");

const resolve = (dir) => path.resolve(__dirname, dir);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolve("./packages/next/**/*.{html,js,jsx}"),
    resolve("./packages/kintsugi-next/**/*.{html,js,jsx}"),
    resolve("./packages/next-common/**/*.{html,js,jsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
