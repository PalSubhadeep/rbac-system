// index.js - Main entry point for the backend server
// This is where Express is set up and all routes are connected

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// MIDDLEWARE (runs on every request)
// ─────────────────────────────────────────────

// cors() allows the React frontend (localhost:3000) to talk to this backend (localhost:5000)
// Without this, the browser would block cross-origin requests
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// express.json() parses incoming JSON request bodies
// So req.body works for POST/PUT requests
app.use(express.json());

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));       // /api/auth/login, /register
app.use("/api/users", require("./routes/users"));     // /api/users, /api/users/:id/role
app.use("/api", require("./routes/content"));         // /api/dashboard, /api/content

// Health check — useful to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "RBAC Backend is running!" });
});

// 404 handler — if no route matched
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📦 Database: rbac.db (SQLite)`);
  console.log(`\nTest users ready:`);
  console.log(`  admin@example.com    / admin123   → Admin`);
  console.log(`  manager@example.com  / manager123 → Manager`);
  console.log(`  viewer@example.com   / viewer123  → Viewer\n`);
});
