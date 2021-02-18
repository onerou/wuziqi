import { CheckerPlugin } from "awesome-typescript-loader";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import { join, resolve } from "path";
module.exports = {
  mode: "development",
  entry: "./src/main.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@PAGE": resolve(__dirname, "./src/pages/"),
      "@COMPONTENT": resolve(__dirname, "./src/components/"),
      "@": resolve(__dirname, "./src/"),
      "@UTILS": resolve(__dirname, "./src/utils/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_module/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    hot: true,
    host: "0.0.0.0",
    port: 9000,
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("./src/index.html"),
    }),
  ],
};
