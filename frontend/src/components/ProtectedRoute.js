// components/ProtectedRoute.js
// This component wraps routes that require authentication or specific roles.
// If the user doesn't have access, they get REDIRECTED (not just hidden).
// This is important — the assignment specifically says "do not just hide the route"

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // While checking localStorage on startup, show nothing (avoid flash)
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  // Not logged in at all → redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to /access-denied
  // allowedRoles is optional — if not provided, any logged-in user can access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  // All checks passed — render the actual page
  return children;
}

export default ProtectedRoute;
