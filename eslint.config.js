const { FlatCompat } = require("@eslint/eslintrc");
const { fixupConfigRules } = require("@eslint/compat");
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
  "**/.yalc/**",
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
    fixupConfigRules([].concat(nextCoreWebVitals)),
    nextAppFiles.concat(nextCommonFiles),
  ),
  {
    files: nextAppFiles,
    rules: {
      ...osnConfig.rules,
      "@next/next/no-img-element": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "(^_|^req|^context)" }],
      "react-hooks/set-state-in-effect": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-anonymous-default-export": "off",
    },
    ignores,
  },
  ...withFiles([eslintJs.configs.recommended], nextCommonFiles),
  ...withFiles(
    fixupConfigRules(
      compat.extends(
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
      ),
    ),
    nextCommonFiles,
  ),
  {
    files: nextCommonFiles,
    rules: {
      ...osnConfig.rules,
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-anonymous-default-export": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores,
  },
  // eslint-plugin-react-hooks 7.1 的 recommended 新增了一批 compiler 规则
  // （7.0.1 只有 rules-of-hooks + exhaustive-deps）。这里保持升级前的规则集，
  // 是否启用这些新规则单独评估，避免和依赖升级混在一起。
  {
    files: nextAppFiles.concat(nextCommonFiles),
    rules: {
      "react-hooks/config": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/gating": "off",
      "react-hooks/globals": "off",
      "react-hooks/immutability": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/static-components": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/use-memo": "off",
    },
    ignores,
  },
];
