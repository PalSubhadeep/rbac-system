// App.js - Main component that sets up all the routes
// React Router is used for client-side navigation (no page reloads)

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Content from "./pages/Content";
import AccessDenied from "./pages/AccessDenied";

// Layout wrapper: shows Navbar on all pages EXCEPT login/register
function AppLayout({ children }) {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    // AuthProvider wraps everything so all components can access auth state
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public routes - no auth needed */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Protected: All authenticated users */}
            <Route path="/content" element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            } />

            {/* Protected: Admin and Manager only */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Protected: Admin only */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
