module.exports = {
  webpack(config,{ webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.plugins.push(
      new webpack.ProvidePlugin({
        'window.Quill': 'quill'
      })
    )
    return config;
  },
};
