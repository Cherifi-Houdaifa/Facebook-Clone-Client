const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const mode = process.env.mode;

module.exports = {
    mode: mode,
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].[contenthash].js",
        clean: true,
        publicPath: "/",
    },
    devtool: mode === "development" ? "eval-source-map" : false,
    devServer: {
        static: path.resolve(__dirname, "./build"),
        port: "4000",
        open: true,
        hot: true,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "public/index.html"),
            favicon: path.resolve(__dirname, "public/favicon.ico"),
        }),
        new webpack.DefinePlugin({
            "process.env.SERVER_URL": JSON.stringify({
                url: process.env.SERVER_URL,
            }),
        }),
    ],
};
