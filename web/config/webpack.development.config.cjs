const { join, resolve } =require("path");

module.exports ={
    mode: "development",
    output: {
        filename: "[name].dev-[chunkhash:8].js",
    },
    devtool: "source-map",
    devServer: {
        contentBase: join(__dirname, "dist"),
        compress: true,
        hot: true,
        host: "0.0.0.0",
        port: 9000,
    },
}