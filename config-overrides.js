module.exports = function override(config, env) {
  // resolve the issue with wallet-adapter dependencies that don't include polyfill
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
  };
  return config;
};
