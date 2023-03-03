module.exports = {
  rules: {
    semi: ["warn", "always"],
    quotes: ["warn", "double"],
    "comma-dangle": [
      "warn",
      {
        arrays: "only-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "object-curly-newline": ["warn", { multiline: true, consistent: true }],
    "object-curly-spacing": ["warn", "always"],
    "object-property-newline": [
      "warn",
      { allowMultiplePropertiesPerLine: true },
    ],
  },
};
