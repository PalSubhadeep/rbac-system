const express = require("express");
const router = express.Router();
const { db, dbHelpers } = require("../config/database");
const { verifyToken, requireRole } = require("../middleware/auth");

// GET /api/users — Admin only
router.get("/", verifyToken, requireRole("Admin"), (req, res) => {
  const users = dbHelpers.getUsersWithRoles();
  res.json({ users });
});

// GET /api/users/roles — Admin only
router.get("/roles", verifyToken, requireRole("Admin"), (req, res) => {
  const roles = db.get("roles").value();
  res.json({ roles });
});

// POST /api/users/:id/role — Admin only
router.post("/:id/role", verifyToken, requireRole("Admin"), (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  const roleId = dbHelpers.getRoleId(role);
  if (!roleId) {
    return res.status(400).json({ message: "Invalid role name." });
  }

  if (userId === req.user.id) {
    return res.status(400).json({ message: "You cannot change your own role." });
  }

  const user = db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  db.get("users").find({ id: userId }).assign({ role_id: roleId }).write();
  dbHelpers.addLog(req.user.id, "CHANGE_ROLE", `user:${userId} -> ${role}`);

  res.json({ message: `User role updated to ${role}.` });
});

// DELETE /api/users/:id — Admin only
router.delete("/:id", verifyToken, requireRole("Admin"), (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  const user = db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  db.get("users").remove({ id: userId }).write();
  dbHelpers.addLog(req.user.id, "DELETE_USER", `user:${userId}`);

  res.json({ message: "User deleted successfully." });
});

module.exports = router;
