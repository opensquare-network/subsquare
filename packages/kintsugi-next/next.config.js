const withTM = require("next-transpile-modules")(["@subsquare/next-common"]);

module.exports = {
  ...withTM(),
  webpack(config, { webpack }) {
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
    config.plugins.push(
      new webpack.ProvidePlugin({
        "window.Quill": "quill",
      })
    );
    return config;
  },
};
