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
  webpack(config, { dev }) {
    // Treat warnings as errors if we're not in development.
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push({
        apply(compiler) {
          compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
            if (compilation.warnings.length > 0) {
              throw new Error(
                compilation.warnings
                  .map((warning) => warning.message)
                  .join("\n\n"),
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
    return config;
  },
};

module.exports = withBundleAnalyzer(config);
