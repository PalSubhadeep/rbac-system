// pages/Register.js - Registration form

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 RBAC System</h1>
        <h2 style={styles.subtitle}>Create Account</h2>
        <p style={styles.note}>New users are assigned the <strong>Viewer</strong> role by default.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Your full name"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
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
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "white", padding: "40px", borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px",
  },
  title: { textAlign: "center", color: "#1e293b", marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#64748b", fontWeight: "normal", marginBottom: 8 },
  note: { textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 24 },
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
  success: {
    backgroundColor: "#f0fdf4", color: "#16a34a", padding: "10px 14px",
    borderRadius: 8, marginBottom: 16, fontSize: 14
  },
  submitBtn: {
    width: "100%", padding: "12px", backgroundColor: "#10b981",
    color: "white", border: "none", borderRadius: 8, fontSize: 16,
    cursor: "pointer", fontWeight: "600", marginTop: 8
  },
  loginLink: { textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 14 },
};

export default Register;
