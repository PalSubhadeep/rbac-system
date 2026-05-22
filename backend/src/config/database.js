// database.js - JSON file-based database using lowdb
// This stores all data in a db.json file — simple and zero native dependencies!

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bcrypt = require("bcryptjs");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "../../db.json"));
const db = low(adapter);

function initializeDatabase() {
  // Set default structure if db.json is empty
  db.defaults({
    roles: [],
    users: [],
    audit_logs: [],
    nextUserId: 1,
    nextLogId: 1
  }).write();

  // Seed roles if empty
  if (db.get("roles").size().value() === 0) {
    db.get("roles").push(
      { id: 1, name: "Admin" },
      { id: 2, name: "Manager" },
      { id: 3, name: "Viewer" }
    ).write();
    console.log("✅ Roles seeded: Admin, Manager, Viewer");
  }

  // Seed default users if empty
  if (db.get("users").size().value() === 0) {
    const hash = (pwd) => bcrypt.hashSync(pwd, 10);
    const now = new Date().toISOString();

    db.get("users").push(
      { id: 1, name: "Admin User",   email: "admin@example.com",   password: hash("admin123"),   role_id: 1, created_at: now },
      { id: 2, name: "Manager User", email: "manager@example.com", password: hash("manager123"), role_id: 2, created_at: now },
      { id: 3, name: "Viewer User",  email: "viewer@example.com",  password: hash("viewer123"),  role_id: 3, created_at: now }
    ).write();
    db.set("nextUserId", 4).write();

    console.log("✅ Default users seeded");
    console.log("   admin@example.com / admin123");
    console.log("   manager@example.com / manager123");
    console.log("   viewer@example.com / viewer123");
  }
}

initializeDatabase();

// Helper functions to mimic SQL-like queries
const dbHelpers = {
  // Get role name from role_id
  getRoleName: (role_id) => {
    const role = db.get("roles").find({ id: role_id }).value();
    return role ? role.name : "Unknown";
  },
  // Get role_id from role name
  getRoleId: (roleName) => {
    const role = db.get("roles").find({ name: roleName }).value();
    return role ? role.id : null;
  },
  // Get all users with their role names
  getUsersWithRoles: () => {
    return db.get("users").value().map(u => ({
      id: u.id, name: u.name, email: u.email,
      role: dbHelpers.getRoleName(u.role_id),
      created_at: u.created_at
    }));
  },
  // Get next auto-increment id
  nextId: (field) => {
    const id = db.get(field).value();
    db.set(field, id + 1).write();
    return id;
  },
  // Add an audit log entry
  addLog: (user_id, action, target) => {
    try {
      db.get("audit_logs").push({
        id: dbHelpers.nextId("nextLogId"),
        user_id, action, target,
        timestamp: new Date().toISOString()
      }).write();
    } catch (_) {}
  }
};

module.exports = { db, dbHelpers };
