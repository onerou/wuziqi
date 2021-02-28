const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const { merge } = require("webpack-merge");
const developmentConfig = require("./config/webpack.development.config.cjs");
const productionConfig = require("./config/webpack.production.config.cjs");
const tsImportPluginFactory = require("ts-import-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let allowConfig =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;
let config = {
  entry: "./src/main.tsx",
  output: {
    filename: "[name].bundle[chunkhash:8].js",
    path: __dirname + "/dist",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@PAGE": resolve(__dirname, "./src/pages/"),
      "@COMPONTENT": resolve(__dirname, "./src/components/"),
      "@": resolve(__dirname, "./src/"),
      "@UTILS": resolve(__dirname, "./src/utils/"),
      "@STORE": resolve(__dirname, "./src/store/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.((le|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                strictMath: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: "awesome-typescript-loader",
        options: {
          useBabel: false,
          transpileOnly:true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "antd",
                libraryDirectory:"lib",
                style: false,
              }),
            ],
          }),
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("./src/index.html"),
    }),
    new MiniCssExtractPlugin(),
  ],
};

module.exports = merge(config, allowConfig);