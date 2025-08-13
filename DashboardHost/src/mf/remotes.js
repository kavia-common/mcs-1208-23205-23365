const read = (name) => (typeof process !== 'undefined' ? process.env[name] : undefined);

export const remotesConfig = {
  asset: {
    scope: 'asset',
    url: (read('REACT_APP_ASSET_REMOTE_URL') || '').replace(/\/$/, '') + '/remoteEntry.js'
  },
  templates: {
    scope: 'templates',
    url: (read('REACT_APP_TEMPLATES_REMOTE_URL') || '').replace(/\/$/, '') + '/remoteEntry.js'
  },
  explorer: {
    scope: 'explorer',
    url: (read('REACT_APP_EXPLORER_REMOTE_URL') || '').replace(/\/$/, '') + '/remoteEntry.js'
  }
};
