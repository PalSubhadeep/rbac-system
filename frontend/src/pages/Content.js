// pages/Content.js - Accessible by ALL authenticated users (Admin, Manager, Viewer)

import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function Content() {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/content")
      .then(res => setContent(res.data.content))
      .catch(() => setError("Failed to load content."));
  }, []);

  const categoryColors = {
    Documentation: "#dbeafe",
    HR: "#fef9c3",
    Planning: "#dcfce7",
    Technical: "#fce7f3",
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📄 Content Library</h1>
      <p style={styles.subtitle}>
        Hello <strong>{user.name}</strong>! As a <strong>{user.role}</strong>, you have read-only access to all content.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {content.map(item => (
          <div key={item.id} style={styles.card}>
            <div style={{
              ...styles.categoryBadge,
              backgroundColor: categoryColors[item.category] || "#f1f5f9"
            }}>
              {item.category}
            </div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardAuthor}>By {item.author}</p>
            <div style={styles.readMore}>📖 Read More</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "32px", maxWidth: 900, margin: "0 auto" },
  heading: { fontSize: 28, color: "#1e293b", marginBottom: 4 },
  subtitle: { color: "#64748b", marginBottom: 28 },
  error: { backgroundColor: "#fef2f2", color: "#dc2626", padding: 14, borderRadius: 8 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 },
  card: {
    backgroundColor: "white", borderRadius: 12, padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9"
  },
  categoryBadge: {
    display: "inline-block", padding: "4px 10px",
    borderRadius: 20, fontSize: 12, fontWeight: "600",
    color: "#374151", marginBottom: 12
  },
  cardTitle: { fontSize: 16, color: "#1e293b", marginBottom: 8 },
  cardAuthor: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  readMore: { fontSize: 13, color: "#3b82f6", cursor: "pointer" },
};

export default Content;
