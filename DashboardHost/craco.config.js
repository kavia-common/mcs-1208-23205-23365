/* craco.config.js - Webpack customization for Module Federation host */
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.output = config.output || {};
      // Ensure dynamic loading works from any base path
      config.output.publicPath = 'auto';

      // Attach Module Federation plugin for shared singletons.
      config.plugins = config.plugins || [];
      const { ModuleFederationPlugin } = webpack.container;

      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'dashboard_host',
          filename: 'remoteEntry.js',
          // We will load remotes dynamically at runtime; keep this empty.
          remotes: {},
          exposes: {},
          shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false }
          }
        })
      );
      return config;
    }
  }
};
