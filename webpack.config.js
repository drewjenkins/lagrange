const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const Dotenv = require("dotenv-webpack");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";
const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.ejs",
      filename: "index.html",
      inject: false,
    }),
    new MiniCssExtractPlugin({ filename: `index.css` }),
    new webpack.ProvidePlugin({ process: "process/browser" }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.styl$/i,
        use: ["stylus-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      path: require.resolve("path"),
      Buffer: require.resolve("buffer"),
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.devtool = "source-map";
    config.plugins.push(
      new webpack.DefinePlugin({ PRODUCTION: JSON.stringify(true) }),
      new WorkboxWebpackPlugin.GenerateSW({ exclude: [/\.map$/] }),
      new Dotenv({ systemvars: true })
    );
    config.optimization = {
      concatenateModules: true,
      emitOnErrors: false,
      innerGraph: true,
      mangleExports: true,
      nodeEnv: "production",
      minimize: true,
      minimizer: [new CssMinimizerPlugin(), "..."],
      realContentHash: true,
      removeAvailableModules: true,
    };
  } else {
    config.mode = "development";
    config.devtool = "eval-source-map";
    config.devServer = {
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        logging: "none",
      },
      historyApiFallback: true,
      port: 3000,
      server: {
        type: "https",
        options: {
          key: fs.readFileSync("./localhost.key"),
          cert: fs.readFileSync("./localhost.crt"),
        },
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    };
    config.stats = { preset: "minimal" };
    config.plugins.push(
      new webpack.DefinePlugin({ PRODUCTION: JSON.stringify(false) }),
      new Dotenv()
    );
  }
  return config;
};
