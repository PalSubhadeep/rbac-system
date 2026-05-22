// components/Navbar.js - Navigation bar that shows/hides links based on role
// This is the visual part of RBAC — users only see what they're allowed to access

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login after logout
  };

  // Role badge colors
  const roleBadgeColors = {
    Admin: "#dc3545",    // red
    Manager: "#fd7e14",  // orange
    Viewer: "#0d6efd",   // blue
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🔐 RBAC System</div>

      <div style={styles.links}>
        {/* "Content" is visible to ALL logged-in users */}
        <Link to="/content" style={styles.link}>📄 Content</Link>

        {/* "Dashboard" only shown to Admin and Manager */}
        {(user?.role === "Admin" || user?.role === "Manager") && (
          <Link to="/dashboard" style={styles.link}>📊 Dashboard</Link>
        )}

        {/* "Admin Panel" only shown to Admin */}
        {user?.role === "Admin" && (
          <Link to="/admin" style={styles.link}>⚙️ Admin Panel</Link>
        )}
      </div>

      <div style={styles.userInfo}>
        {/* Role badge */}
        <span style={{
          ...styles.roleBadge,
          backgroundColor: roleBadgeColors[user?.role] || "#6c757d"
        }}>
          {user?.role}
        </span>
        <span style={styles.userName}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    backgroundColor: "#1e293b",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    flexWrap: "wrap",
    gap: "10px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#60a5fa",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  roleBadge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default Navbar;
