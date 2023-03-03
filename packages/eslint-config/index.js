module.exports = {
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-newline": ["error", { multiline: true, consistent: true }],
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": [
      "error",
      { allowMultiplePropertiesPerLine: true },
    ],
  },
};
