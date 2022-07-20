const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.
  /**
   * resolve: {
    alias: {
        'react-native': 'react-native-web',
        ...
        'react-native-maps': 'react-native-web-maps',
    }
}
   */
  return {
    ...config,
    resolve: {
      ...(config.resolve || {}),
      alias: {
        ...((config.resolve || {}).alias || {}),
        'react-native-maps': 'react-native-web-maps',
      },
    },
  };
};
