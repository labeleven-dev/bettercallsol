//@ts-ignore
const { override, addWebpackModuleRule } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  addWebpackModuleRule({
    test: /\.(cjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve("babel-loader"),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve("babel-preset-react-app/dependencies"),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: false,
      sourceMaps: true,
      inputSourceMap: true,
    },
  }),
  function override(config, env) {
    // resolve the issue with dependencies that don't include polyfill
    config.resolve.fallback = {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer"),
      fs: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    };
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ];
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  }
);
