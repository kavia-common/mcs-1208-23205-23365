import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AppStateProvider';

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  /** Guards routes to only allow authenticated users. */
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
