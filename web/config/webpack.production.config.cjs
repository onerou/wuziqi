const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  devtool: "eval",
  optimization: {
    concatenateModules: true,
    sideEffects: true,
    minimize: true,
    removeAvailableModules: true,
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 250000,
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new TerserPlugin({
          parallel: true
    })
  ],
};
