const path = require("node:path");
module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {
      config: path.join(__dirname, "tailwind.config.js"),
    },
    "postcss-import": {},
    autoprefixer: {},
  },
};
