/* global __webpack_init_sharing__, __webpack_share_scopes__ */
const scriptCache = new Map();

/**
 * PUBLIC_INTERFACE
 * Load a remote's remoteEntry.js for a given scope if not already loaded.
 * @param {string} url Fully-qualified URL to the remoteEntry.js
 * @param {string} scope The global container name exposed by the remote
 * @returns {Promise<any>} The loaded container (window[scope])
 */
export async function loadRemoteEntry(url, scope) {
  if (!url || !scope) {
    throw new Error('loadRemoteEntry requires url and scope');
  }
  if (window[scope]) return window[scope];

  if (!scriptCache.has(url)) {
    scriptCache.set(
      url,
      new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = url;
        el.type = 'text/javascript';
        el.async = true;
        el.onload = () => resolve(true);
        el.onerror = () => reject(new Error(`Failed to load remote at ${url}`));
        document.head.appendChild(el);
      })
    );
  }
  await scriptCache.get(url);
  if (!window[scope]) {
    throw new Error(`Remote scope "${scope}" not found after loading ${url}`);
  }
  return window[scope];
}

/**
 * PUBLIC_INTERFACE
 * Dynamically load a federated module from a remote container.
 * @param {{ url: string; scope: string; module: string }} opts
 * @returns {Promise<any>} The resolved module (default export if present)
 */
export async function loadRemoteModule({ url, scope, module }) {
  if (!url || !scope) throw new Error('loadRemoteModule requires url and scope');
  if (!module) throw new Error('loadRemoteModule requires "module" path, e.g., "./App"');

  const container = await loadRemoteEntry(url, scope);

  // Initialize sharing if not already initialized
  await __webpack_init_sharing__('default');
  const shareScope = __webpack_share_scopes__.default;

  // Initialize the container, it may provide shared modules
  if (!container.__initialized) {
    await container.init(shareScope);
    container.__initialized = true;
  }

  const factory = await container.get(module);
  const Module = factory();
  return Module && Module.default ? Module.default : Module;
}
