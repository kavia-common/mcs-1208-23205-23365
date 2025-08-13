import React, { useEffect, useState } from 'react';
import { loadRemoteModule } from '../mf/loadRemote';
import { remotesConfig } from '../mf/remotes';

// PUBLIC_INTERFACE
function RemoteComponent({ remoteKey, module, fallback = null, props: childProps = {} }) {
  /** Render a remote federated module as a React component.
   * @param {('asset'|'templates'|'explorer')} remoteKey Identifier for the remote configuration to use
   * @param {string} module Exposed module path on the remote (e.g., "./App")
   * @param {React.ReactNode} [fallback] Optional fallback element to render while loading
   * @param {Record<string, any>} [props] Props to forward to the rendered remote component
   * @returns {JSX.Element}
   */
  const [Comp, setComp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const cfg = remotesConfig[remoteKey];
    if (!cfg || !cfg.url || !cfg.scope) {
      setError(new Error(`Unknown remote "${remoteKey}" or missing config`));
      return undefined;
    }
    loadRemoteModule({ url: cfg.url, scope: cfg.scope, module })
      .then((mod) => {
        if (!cancelled) setComp(() => mod);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      });
    return () => {
      cancelled = true;
    };
  }, [remoteKey, module]);

  if (error) {
    return <div role="alert" data-cy="remote-error">Failed to load remote: {String(error.message || error)}</div>;
  }
  if (!Comp) {
    return <>{fallback}</>;
  }
  return <Comp {...childProps} />;
}

export default RemoteComponent;
