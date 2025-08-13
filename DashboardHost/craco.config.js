/* craco.config.js - Webpack customization for Module Federation host */
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.output = config.output || {};
      // Ensure dynamic loading works from any base path
      config.output.publicPath = 'auto';

      // Module Federation expects the runtime to be present when consuming shared modules.
      // Disabling runtimeChunk helps avoid timing issues with share scope initialization.
      config.optimization = config.optimization || {};
      config.optimization.runtimeChunk = false;

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
          // Share React as singletons and explicitly avoid eager consumption.
          // Include react/jsx-runtime to match React 17+ automatic JSX runtime.
          shared: {
            react: { singleton: true, strictVersion: false, requiredVersion: false, eager: false },
            'react-dom': { singleton: true, strictVersion: false, requiredVersion: false, eager: false },
            'react/jsx-runtime': { singleton: true, strictVersion: false, requiredVersion: false, eager: false }
          }
        })
      );
      return config;
    }
  }
};
