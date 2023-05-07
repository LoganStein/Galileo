const { rewireWebpackConfig } = require("react-app-rewired");
const customConfig = require("./webpack.config.js");

module.exports = function override(config, env) {
  return rewireWebpackConfig(config, env, () => customConfig);
};
