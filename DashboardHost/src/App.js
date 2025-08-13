import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import './App.css';
import { useAuth } from './state/AppStateProvider';
import ErrorBoundary from './components/ErrorBoundary';
import RemoteComponent from './components/RemoteComponent';
import ProtectedRoute from './components/ProtectedRoute';
import SkipToContent from './components/SkipToContent';

/**
 * Layout components
 */
function Header({ theme, onToggleTheme }) {
  return (
    <header className="dh-header" role="banner" data-cy="header">
      <div className="dh-header__brand">
        <Link to="/" className="dh-header__logo" aria-label="Dashboard Home">
          DashboardHost
        </Link>
      </div>
      <nav className="dh-topnav" aria-label="Primary">
        <Link to="/asset" className="dh-topnav__link" data-cy="nav-asset">Asset</Link>
        <Link to="/templates" className="dh-topnav__link" data-cy="nav-templates">Templates</Link>
        <Link to="/explorer" className="dh-topnav__link" data-cy="nav-explorer">Explorer</Link>
      </nav>
      <div className="dh-header__actions">
        <button
          className="btn theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          data-cy="toggle-theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="dh-sidebar" aria-label="Secondary" data-cy="sidebar">
      <ul className="dh-sidebar__list">
        <li><Link to="/asset" className="dh-sidebar__link">Asset Dashboard</Link></li>
        <li><Link to="/templates" className="dh-sidebar__link">Templates</Link></li>
        <li><Link to="/explorer" className="dh-sidebar__link">Explorer</Link></li>
      </ul>
    </aside>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="dh-breadcrumbs" data-cy="breadcrumbs">
      <ol>
        <li><Link to="/">Home</Link></li>
        {parts.map((segment, idx) => {
          const url = '/' + parts.slice(0, idx + 1).join('/');
          const label = segment.replace(/[-_]/g, ' ');
          const isLast = idx === parts.length - 1;
          return (
            <li key={url} aria-current={isLast ? 'page' : undefined}>
              {isLast ? <span>{label}</span> : <Link to={url}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Simple local pages
 */
function Home() {
  return (
    <section id="main-content" className="dh-content" data-cy="home">
      <h1 className="title">Welcome</h1>
      <p className="description">
        Use the navigation to access Asset, Templates, or Explorer micro frontends.
      </p>
    </section>
  );
}

function Login() {
  const { login } = useAuth();
  return (
    <section id="main-content" className="dh-content" data-cy="login">
      <h1 className="title">Sign in</h1>
      <p className="description">This is a demo auth screen. Click below to simulate login.</p>
      <button
        className="btn btn-primary"
        onClick={() => login({ id: 'user-1', name: 'Demo User' })}
        data-cy="login-button"
      >
        Sign in
      </button>
    </section>
  );
}

function NotFound() {
  return (
    <section id="main-content" className="dh-content" data-cy="not-found">
      <h1 className="title">404</h1>
      <p className="description">The page you are looking for was not found.</p>
      <Link className="btn" to="/">Go Home</Link>
    </section>
  );
}

// PUBLIC_INTERFACE
function AppShell() {
  /** Top-level theme handling */
  const [theme, setTheme] = useState('light');
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="App dh-app">
      <SkipToContent />
      <Header theme={theme} onToggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <div className="dh-app__body">
        <Sidebar />
        <main className="dh-main" tabIndex={-1}>
          <div className="dh-main__toolbar">
            <Breadcrumbs />
            <div className="dh-user">
              {user ? (
                <>
                  <span className="dh-user__name" aria-label="Signed in user" data-cy="user-name">
                    {user.name}
                  </span>
                  <button className="btn" onClick={logout} data-cy="logout-button">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn btn-secondary" data-cy="nav-login">Login</Link>
              )}
            </div>
          </div>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/asset/*"
                element={
                  <ProtectedRoute>
                    <RemoteComponent remoteKey="asset" module="./App" fallback={<div>Loading Asset…</div>} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates/*"
                element={
                  <ProtectedRoute>
                    <RemoteComponent remoteKey="templates" module="./App" fallback={<div>Loading Templates…</div>} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explorer/*"
                element={
                  <ProtectedRoute>
                    <RemoteComponent remoteKey="explorer" module="./App" fallback={<div>Loading Explorer…</div>} />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      <footer className="dh-footer" role="contentinfo">
        <small>© {new Date().getFullYear()} DashboardHost</small>
      </footer>
    </div>
  );
}

export default AppShell;
