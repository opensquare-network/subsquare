module.exports = {
  rules: {
    semi: ["warn", "always"],
    quotes: ["warn", "double"],
    "comma-dangle": ["warn", "always-multiline"],
    "object-curly-newline": ["warn", { multiline: true, consistent: true }],
    "object-curly-spacing": ["warn", "always"],
    "object-property-newline": [
      "warn",
      { allowMultiplePropertiesPerLine: true },
    ],
  },
};
