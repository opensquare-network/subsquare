module.exports = {
  webpack(config, { webpack }) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      },
      {
        test: /\/next-common\/.*\.js/,
        use: "babel-loader",
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
