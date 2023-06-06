const path = require("node:path");
const light =
  require("./packages/next-common/components/styled/theme/light").default;

const resolve = (dir) => path.resolve(__dirname, dir);

/**
 * `light.neutral100` -> `{ neutral100: 'var(--neutral100)' }`
 */
const twLightVariables = Object.keys(light).reduce((value, key) => {
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
    extend: {
      colors: {
        ...twLightVariables,
      },
    },
    // TODO: v2, disable all tw colors
    // colors: {},
  },
  plugins: [],
};
