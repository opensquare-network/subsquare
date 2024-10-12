module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@osn",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "unused-imports"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/jsx-uses-react": "error",
    "react/prop-types": 0,
    "react-hooks/exhaustive-deps": "error",
    // unused-imports
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "(^_|^req|^context)",
        args: "after-used",
        argsIgnorePattern: "(^_|^req|^context)",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
