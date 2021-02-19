import { CheckerPlugin } from "awesome-typescript-loader";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { merge } from "webpack-merge";
import developmentConfig from "./config/webpack.development.config";
import productionConfig from "./config/webpack.production.config";
import tsImportPluginFactory from "ts-import-plugin";
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
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
          },
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
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "antd",
                libraryDirectory: "lib",
                style: "css",
              }),
            ],
          }),
          compilerOptions: {
            module: "es2015",
          },
        },
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
  ],
};

module.exports = merge(config, allowConfig);
