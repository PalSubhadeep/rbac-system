// pages/AdminPanel.js - Admin only
// Lists all users, allows changing roles and deleting users

import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Handle role change dropdown
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/users/${userId}/role`, { role: newRole });
      setMessage(`Role updated to ${newRole} successfully!`);
      fetchUsers(); // refresh the user list
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"?`)) return;

    try {
      await api.delete(`/users/${userId}`);
      setMessage(`User "${userName}" deleted.`);
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const roleColors = { Admin: "#dc2626", Manager: "#ea580c", Viewer: "#2563eb" };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>⚙️ Admin Panel</h1>
      <p style={styles.subtitle}>Manage users, roles, and permissions</p>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : (
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>👥 All Users ({users.length})</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Current Role</th>
                <th style={styles.th}>Change Role</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>
                    {user.name}
                    {user.id === currentUser.id && (
                      <span style={styles.youBadge}> (you)</span>
                    )}
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.rolePill,
                      backgroundColor: roleColors[user.role] || "#6b7280"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {/* Disable role change for yourself */}
                    {user.id !== currentUser.id ? (
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Cannot change own role</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {user.id !== currentUser.id ? (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        style={styles.deleteBtn}
                      >
                        🗑️ Delete
                      </button>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: 1000, margin: "0 auto" },
  heading: { fontSize: 28, color: "#1e293b", marginBottom: 4 },
  subtitle: { color: "#64748b", marginBottom: 24 },
  success: {
    backgroundColor: "#f0fdf4", color: "#16a34a",
    padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14
  },
  error: {
    backgroundColor: "#fef2f2", color: "#dc2626",
    padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14
  },
  loading: { color: "#64748b", padding: 20 },
  card: {
    backgroundColor: "white", borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24, overflowX: "auto"
  },
  sectionTitle: { fontSize: 18, color: "#1e293b", marginBottom: 16 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f8fafc" },
  th: {
    padding: "10px 14px", textAlign: "left",
    fontSize: 13, color: "#64748b", fontWeight: "600",
    borderBottom: "2px solid #e2e8f0"
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 14px", fontSize: 14, verticalAlign: "middle" },
  rolePill: {
    padding: "3px 10px", borderRadius: 12, color: "white",
    fontSize: 12, fontWeight: "bold"
  },
  youBadge: {
    fontSize: 11, color: "#10b981", fontWeight: "600"
  },
  select: {
    padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db",
    fontSize: 13, cursor: "pointer"
  },
  deleteBtn: {
    padding: "6px 12px", backgroundColor: "#fef2f2", color: "#dc2626",
    border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontSize: 13
  },
};

export default AdminPanel;
