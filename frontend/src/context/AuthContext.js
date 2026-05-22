// AuthContext.js - Global state for authentication
// React Context lets us share the logged-in user info with ALL components
// without passing it as props through every level

import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context (like a "store" for auth data)
const AuthContext = createContext(null);

// 2. AuthProvider wraps the whole app so every component can access auth data
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // null = not logged in
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // check localStorage on startup

  // On app load, check if user was previously logged in (token in localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Called after successful login
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    // Store in localStorage so user stays logged in after page refresh
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Called on logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // The value that all child components can access
  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — makes using the context easier
//    Usage: const { user, token, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
