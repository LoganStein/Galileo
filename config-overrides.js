const { rewireWebpackConfig } = require("react-app-rewired");
// const customConfig = require("./webpack.config.js");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    https: false,
    http: false,
  };
  return config;
};
