import { join, resolve } from "path";

export default {
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: join(__dirname, "dist"),
        compress: true,
        hot: true,
        host: "0.0.0.0",
        port: 9000,
    },
}