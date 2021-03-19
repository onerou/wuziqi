const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  output: {
    filename: "[name].bundle-[chunkhash:8].js",
  },
  optimization: {
    concatenateModules: true,
    sideEffects: true,
    minimize: true,
    removeAvailableModules: true,
    splitChunks: {
      chunks: "all",
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
