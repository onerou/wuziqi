import { CheckerPlugin } from "awesome-typescript-loader";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { merge } from "webpack-merge";
import developmentConfig from "./config/webpack.development.config";
import productionConfig from "./config/webpack.production.config";
import tsImportPluginFactory from "ts-import-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
let allowConfig =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;
let config: any = {
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
    },
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
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
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          useBabel: false,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "antd",
                style: "css",
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
