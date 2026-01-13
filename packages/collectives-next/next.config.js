const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["next-common", "@osn/icons", "@osn/react-cmdk"],
  modularizeImports: {
    "@osn/icons/subsquare": {
      transform: "@osn/icons/subsquare/{{member}}",
    },
  },
  allowedDevOrigins: ["127.0.0.1"],
  compress: true,
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/democracy/referendums",
        destination: "/democracy/referenda",
        permanent: true,
      },
    ];
  },
  webpack(config, { dev, isServer }) {
    // Enable WASM support for Hydration SDK (from next-common dependency)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Explicitly declare that the target environment supports async/await
    if (!isServer) {
      config.output.environment = {
        ...config.output.environment,
        asyncFunction: true,
      };
    }

    // For server-side, exclude Hydration WASM modules to avoid build errors
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          "@galacticcouncil/math-omnipool":
            "commonjs @galacticcouncil/math-omnipool",
          "@galacticcouncil/math-xyk": "commonjs @galacticcouncil/math-xyk",
          "@galacticcouncil/math-stableswap":
            "commonjs @galacticcouncil/math-stableswap",
          "@galacticcouncil/math-liquidity-mining":
            "commonjs @galacticcouncil/math-liquidity-mining",
        });
      }
    }

    // Treat warnings as errors if we're not in development.
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push({
        apply(compiler) {
          compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
            // Filter out WASM async/await warnings from Hydration SDK
            const filteredWarnings = compilation.warnings.filter(
              (warning) =>
                !(
                  warning.message.includes("asyncWebAssembly") ||
                  (warning.message.includes("async/await") &&
                    warning.message.includes("@galacticcouncil"))
                ),
            );
            if (filteredWarnings.length > 0) {
              throw new Error(
                filteredWarnings.map((warning) => warning.message).join("\n\n"),
              );
            }
          });
        },
      });
    }

    // Add this to make the build fail on errors
    config.bail = true;

    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      },
    );

    // Fix MetaMask SDK React Native dependency issue
    config.resolve.alias["@react-native-async-storage/async-storage"] = false;

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow https://app.mimir.global/ use iframe
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://app.mimir.global;",
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
