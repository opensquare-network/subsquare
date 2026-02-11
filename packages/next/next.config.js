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
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  serverExternalPackages: [
    "@galacticcouncil/math-omnipool",
    "@galacticcouncil/math-xyk",
    "@galacticcouncil/math-stableswap",
    "@galacticcouncil/math-liquidity-mining",
    "@galacticcouncil/math-lbp",
    "@galacticcouncil/math-hsm",
  ],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "@react-native-async-storage/async-storage":
        "next-common/utils/asyncStorageStub.js",
    },
  },
  async redirects() {
    return [
      {
        source: "/democracy/referendums",
        destination: "/democracy/referenda",
        permanent: true,
      },
      {
        source: "/treasury/burnt",
        destination: "/treasury/burn",
        permanent: false,
      },
      {
        source: "/assethub",
        destination: "/assets",
        permanent: false,
      },
      {
        source: "/foreign-assets",
        destination: "/assets?tab=foreign_assets",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
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

module.exports = config;
