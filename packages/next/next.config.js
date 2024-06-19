const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["next-common", "@osn/icons", "@osn/react-cmdk"],
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
  webpack(config) {
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
