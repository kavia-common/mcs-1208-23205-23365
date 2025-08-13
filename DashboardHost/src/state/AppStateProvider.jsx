import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const initialState = {
  // Add shared cross-module UI state here
  sidebarOpen: true
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

const AppStateContext = createContext(undefined);
const AuthContext = createContext(undefined);

// PUBLIC_INTERFACE
export function AppStateProvider({ children }) {
  /** Root provider for shared state and authentication contexts. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simple auth persistence
  const auth = useProvideAuth();

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AuthContext.Provider value={auth}>
      <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** Access shared UI state and dispatch function. */
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth context with user, login, and logout. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AppStateProvider');
  return ctx;
}

function useProvideAuth() {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('dh_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem('dh_user');
      }
    }
  }, []);

  const login = React.useCallback((u) => {
    setUser(u);
    try {
      localStorage.setItem('dh_user', JSON.stringify(u));
    } catch {
      // ignore storage errors
    }
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem('dh_user');
  }, []);

  return { user, login, logout };
}
