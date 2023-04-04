const withTM = require("next-transpile-modules")(["@subsquare/next-common"]);

module.exports = {
  async redirects() {
    return [
      {
        source: "/democracy/referendums",
        destination: "/democracy/referenda",
        permanent: true,
      },
    ];
  },
  ...withTM(),
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      }
    );
    return config;
  },
};
