const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = (env, argv) => {
  const config = {
    mode: "production",
    entry: ["./src/index.jsx"],
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: { cacheDirectory: true, cacheCompression: false }
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg|bmp|otf)$/i,
          use: [
            {
              loader: "file-loader",
              options: { publicPath: "dist" }
            }
          ]
        },
        {
          test: /\.node/i,
          use: [
            {
              loader: "native-addon-loader",
              options: { name: "[name]-[hash].[ext]" }
            }
          ]
        }
      ]
    },
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    }
  }

  if (argv.mode === "development") {
    config.mode = "development";
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devtool = "source-map";
    config.watch = true;
    config.entry.unshift("webpack/hot/poll?100");
  }

  return config
}
