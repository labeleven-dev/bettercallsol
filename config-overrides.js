//@ts-ignore
const {
  override,
  addWebpackModuleRule,
  setWebpackTarget,
} = require("customize-cra");

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
    // resolve the issue with wallet-adapter dependencies that don't include polyfill
    config.resolve.fallback = {
      fs: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    };
    return config;
  }
);
