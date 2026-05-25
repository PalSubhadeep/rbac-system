const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, dbHelpers } = require("../config/database");

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existing = db.get("users").find({ email }).value();
  if (existing) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const viewerRoleId = dbHelpers.getRoleId("Viewer");
  const newId = dbHelpers.nextId("nextUserId");

  db.get("users").push({
    id: newId,
    name, email,
    password: hashedPassword,
    role_id: viewerRoleId,
    created_at: new Date().toISOString()
  }).write();

  res.status(201).json({ message: "Registration successful! Please login." });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = db.get("users").find({ email }).value();
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const role = dbHelpers.getRoleName(user.role_id);

  //JWT token created

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role },
    process.env.JWT_SECRET || "secret_key_change_in_prod",
    { expiresIn: "24h" }
  );

  dbHelpers.addLog(user.id, "LOGIN", "auth/login");

  res.json({
    message: "Login successful!",
    token,
    user: { id: user.id, name: user.name, email: user.email, role }
  });
});

module.exports = router;
