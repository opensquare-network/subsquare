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

const ignores = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.turbo/**",
  "**/dist/**",
];

const withFiles = (configs, files) =>
  configs.map((config) => ({
    ...config,
    files,
    ignores: Array.from(new Set([...(config.ignores || []), ...ignores])),
  }));

module.exports = [
  {
    ignores,
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
  ...withFiles(
    [].concat(nextCoreWebVitals),
    nextAppFiles.concat(nextCommonFiles),
  ),
  {
    files: nextAppFiles,
    rules: {
      ...osnConfig.rules,
      "@next/next/no-img-element": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "(^_|^req|^context)" }],
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/react-in-jsx-scope": "off",
    },
    ignores,
  },
  ...withFiles([eslintJs.configs.recommended], nextCommonFiles),
  ...withFiles(
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
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores,
  },
];
