const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Development mode settings
  if (config.mode === 'development') {
    config.devtool = 'eval-source-map';
    config.devServer.compress = false;
  }

  return config;
};
