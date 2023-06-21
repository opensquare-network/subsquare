module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "@osn"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/jsx-uses-react": "error",
    "react/prop-types": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
