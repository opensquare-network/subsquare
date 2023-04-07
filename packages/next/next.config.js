/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["next-common"],
  compiler: {
    styledComponents: true,
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
