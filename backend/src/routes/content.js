const express = require("express");
const router = express.Router();
const { db, dbHelpers } = require("../config/database");
const { verifyToken, requireRole } = require("../middleware/auth");

// GET /api/dashboard — Admin and Manager only
router.get("/dashboard", verifyToken, requireRole("Admin", "Manager"), (req, res) => {
  const users = db.get("users").value();
  const roles = db.get("roles").value();

  const roleStats = roles.map(r => ({
    name: r.name,
    count: users.filter(u => u.role_id === r.id).length
  }));

  const recentLogs = db.get("audit_logs").value()
    .slice(-10).reverse()
    .map(log => ({
      ...log,
      user_name: (db.get("users").find({ id: log.user_id }).value() || {}).name || "Unknown"
    }));

  res.json({
    stats: { totalUsers: users.length, roleBreakdown: roleStats },
    recentActivity: recentLogs,
    accessedBy: req.user.role
  });
});

// GET /api/content — ALL authenticated users
router.get("/content", verifyToken, (req, res) => {
  const content = [
    { id: 1, title: "Getting Started Guide", category: "Documentation", author: "Admin User" },
    { id: 2, title: "Company Policies 2024", category: "HR", author: "Manager User" },
    { id: 3, title: "Product Roadmap Q1", category: "Planning", author: "Manager User" },
    { id: 4, title: "Engineering Best Practices", category: "Technical", author: "Admin User" },
  ];
  dbHelpers.addLog(req.user.id, "VIEW_CONTENT", "/content");
  res.json({ content, viewedBy: req.user.name, role: req.user.role });
});

// GET /api/audit-logs — Admin only
router.get("/audit-logs", verifyToken, requireRole("Admin"), (req, res) => {
  const logs = db.get("audit_logs").value()
    .slice(-50).reverse()
    .map(log => ({
      ...log,
      user_name: (db.get("users").find({ id: log.user_id }).value() || {}).name || "Unknown"
    }));
  res.json({ logs });
});

module.exports = router;
