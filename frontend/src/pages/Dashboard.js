// pages/Dashboard.js - Admin and Manager only
// Shows system statistics and recent activity

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch dashboard data from GET /api/dashboard
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <div style={styles.error}>{error}</div>;
  if (!data) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📊 Dashboard</h1>
      <p style={styles.welcome}>Welcome, <strong>{user.name}</strong> ({user.role})</p>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderColor: "#3b82f6" }}>
          <div style={styles.statNumber}>{data.stats.totalUsers}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>

        {data.stats.roleBreakdown.map(r => (
          <div key={r.name} style={styles.statCard}>
            <div style={styles.statNumber}>{r.count}</div>
            <div style={styles.statLabel}>{r.name}s</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Log */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 Recent Activity</h2>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>User</span>
            <span>Action</span>
            <span>Target</span>
            <span>Time</span>
          </div>
          {data.recentActivity.length === 0 && (
            <div style={{ padding: "12px 16px", color: "#94a3b8" }}>No activity yet</div>
          )}
          {data.recentActivity.map(log => (
            <div key={log.id} style={styles.tableRow}>
              <span>{log.user_name || "Unknown"}</span>
              <span><code style={styles.code}>{log.action}</code></span>
              <span style={{ color: "#64748b" }}>{log.target}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: 900, margin: "0 auto" },
  heading: { fontSize: 28, color: "#1e293b", marginBottom: 4 },
  welcome: { color: "#64748b", marginBottom: 28 },
  statsGrid: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 },
  statCard: {
    flex: 1, minWidth: 140, padding: 20, backgroundColor: "white",
    borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "2px solid #e2e8f0", textAlign: "center"
  },
  statNumber: { fontSize: 36, fontWeight: "bold", color: "#1e293b" },
  statLabel: { color: "#64748b", marginTop: 4, fontSize: 14 },
  section: { backgroundColor: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  sectionTitle: { fontSize: 18, color: "#1e293b", marginBottom: 16 },
  table: { border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" },
  tableHeader: {
    display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr",
    padding: "10px 16px", backgroundColor: "#f8fafc",
    fontSize: 13, fontWeight: "600", color: "#64748b", gap: 8
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr",
    padding: "10px 16px", borderTop: "1px solid #f1f5f9",
    fontSize: 14, gap: 8, alignItems: "center"
  },
  code: { backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 12 },
  error: { padding: 32, color: "#dc2626" },
  loading: { padding: 32, color: "#64748b" },
};

export default Dashboard;
