// pages/Login.js - Login form

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setError("");
    setLoading(true);

    try {
      // Call POST /api/auth/login
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Save to context + localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Manager") navigate("/dashboard");
      else navigate("/content");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill buttons for demo
  const fillDemo = (role) => {
    const creds = {
      Admin: { email: "admin@example.com", password: "admin123" },
      Manager: { email: "manager@example.com", password: "manager123" },
      Viewer: { email: "viewer@example.com", password: "viewer123" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 RBAC System</h1>
        <h2 style={styles.subtitle}>Login</h2>

        {/* Demo quick-fill buttons */}
        <div style={styles.demoSection}>
          <p style={styles.demoLabel}>Quick fill (demo):</p>
          <div style={styles.demoButtons}>
            {["Admin", "Manager", "Viewer"].map(role => (
              <button key={role} onClick={() => fillDemo(role)} style={styles.demoBtn}>
                {role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: { textAlign: "center", color: "#1e293b", marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#64748b", fontWeight: "normal", marginBottom: 24 },
  demoSection: { backgroundColor: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 20 },
  demoLabel: { margin: "0 0 8px", fontSize: 13, color: "#64748b" },
  demoButtons: { display: "flex", gap: 8 },
  demoBtn: {
    flex: 1, padding: "6px", border: "1px solid #e2e8f0",
    borderRadius: 6, cursor: "pointer", fontSize: 13, backgroundColor: "white"
  },
  field: { marginBottom: 16 },
  label: { display: "block", marginBottom: 6, fontWeight: "600", color: "#374151", fontSize: 14 },
  input: {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
    borderRadius: 8, fontSize: 14, boxSizing: "border-box"
  },
  error: {
    backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 14px",
    borderRadius: 8, marginBottom: 16, fontSize: 14
  },
  submitBtn: {
    width: "100%", padding: "12px", backgroundColor: "#3b82f6",
    color: "white", border: "none", borderRadius: 8, fontSize: 16,
    cursor: "pointer", fontWeight: "600", marginTop: 8
  },
  registerLink: { textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 14 },
};

export default Login;
