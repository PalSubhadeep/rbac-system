// pages/AccessDenied.js - Shown when user tries to access a restricted page

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🚫</div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          Sorry, your role (<strong>{user?.role}</strong>) doesn't have permission to view this page.
        </p>
        <p style={styles.hint}>
          You were redirected here because unauthorized access is blocked — not just hidden.
        </p>
        <button onClick={() => navigate("/content")} style={styles.btn}>
          ← Go to Content
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh", display: "flex",
    alignItems: "center", justifyContent: "center"
  },
  card: {
    textAlign: "center", backgroundColor: "white",
    padding: "48px", borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: 400
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { color: "#dc2626", fontSize: 28, marginBottom: 12 },
  message: { color: "#374151", marginBottom: 12, lineHeight: 1.6 },
  hint: {
    color: "#94a3b8", fontSize: 13, marginBottom: 24,
    backgroundColor: "#f8fafc", padding: 12, borderRadius: 8
  },
  btn: {
    padding: "10px 24px", backgroundColor: "#3b82f6",
    color: "white", border: "none", borderRadius: 8,
    cursor: "pointer", fontSize: 15
  },
};

export default AccessDenied;
