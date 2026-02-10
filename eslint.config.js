const { FlatCompat } = require("@eslint/eslintrc");
const eslintJs = require("@eslint/js");
const globals = require("globals");
const osnConfig = require("@osn/eslint-config");
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
});

const nextAppFiles = [
  "packages/next/**/*.{js,jsx}",
  "packages/collectives-next/**/*.{js,jsx}",
  "packages/kintsugi-next/**/*.{js,jsx}",
];

const nextCommonFiles = ["packages/next-common/**/*.{js,jsx}"];

const scopeToFiles = (configs, files) =>
  configs.map((config) => ({
    ...config,
    files,
  }));

module.exports = [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...scopeToFiles([].concat(nextCoreWebVitals), nextAppFiles),
  {
    files: nextAppFiles,
    rules: {
      ...osnConfig.rules,
      "@next/next/no-img-element": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "(^_|^req|^context)" }],
    },
  },
  ...scopeToFiles(
    compat.extends(
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
    ),
    nextCommonFiles,
  ),
  {
    files: nextCommonFiles,
    rules: {
      ...osnConfig.rules,
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
