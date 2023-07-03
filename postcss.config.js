const path = require("node:path");
module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, "tailwind.config.js"),
    },
    "postcss-import": {},
    "tailwindcss/nesting": {},
    autoprefixer: {},
  },
};
