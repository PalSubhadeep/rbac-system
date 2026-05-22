// middleware.test.js - Unit tests for the auth middleware
// Run with: node middleware.test.js

// We mock jwt and the database so tests don't need a real server running
const jwt = require("jsonwebtoken");

// ─────────────────────────────────────────────
// Simple test runner (no extra libraries needed)
// ─────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     → ${err.message}`);
    failed++;
  }
}

function expect(value) {
  return {
    toBe: (expected) => {
      if (value !== expected) throw new Error(`Expected ${expected}, got ${value}`);
    },
    toEqual: (expected) => {
      if (JSON.stringify(value) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`);
    }
  };
}

// ─────────────────────────────────────────────
// Re-implement the middleware for testing
// (same logic as src/middleware/auth.js)
// ─────────────────────────────────────────────
const SECRET = "test_secret";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

// Helper: mock req/res/next
function mockReq(role, token = null) {
  const t = token || jwt.sign({ id: 1, name: "Test", role }, SECRET);
  return { headers: { authorization: `Bearer ${t}` }, user: null };
}

function mockRes() {
  const res = { _status: null, _body: null };
  res.status = (code) => { res._status = code; return res; };
  res.json = (body) => { res._body = body; return res; };
  return res;
}

// ─────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────
console.log("\n🧪 Running Middleware Tests\n");

console.log("verifyToken:");

test("allows request with valid JWT", () => {
  const req = mockReq("Admin");
  const res = mockRes();
  let called = false;
  verifyToken(req, res, () => { called = true; });
  expect(called).toBe(true);
  expect(req.user.role).toBe("Admin");
});

test("blocks request with no token (401)", () => {
  const req = { headers: {} };
  const res = mockRes();
  verifyToken(req, res, () => {});
  expect(res._status).toBe(401);
});

test("blocks request with invalid/tampered token (401)", () => {
  const req = { headers: { authorization: "Bearer fake.token.here" } };
  const res = mockRes();
  verifyToken(req, res, () => {});
  expect(res._status).toBe(401);
});

console.log("\nrequireRole:");

test("allows Admin to access Admin-only route", () => {
  const req = { user: { role: "Admin" } };
  const res = mockRes();
  let called = false;
  requireRole("Admin")(req, res, () => { called = true; });
  expect(called).toBe(true);
});

test("blocks Viewer from Admin-only route (403)", () => {
  const req = { user: { role: "Viewer" } };
  const res = mockRes();
  requireRole("Admin")(req, res, () => {});
  expect(res._status).toBe(403);
});

test("blocks Manager from Admin-only route (403)", () => {
  const req = { user: { role: "Manager" } };
  const res = mockRes();
  requireRole("Admin")(req, res, () => {});
  expect(res._status).toBe(403);
});

test("allows Admin and Manager to access dashboard route", () => {
  ["Admin", "Manager"].forEach(role => {
    const req = { user: { role } };
    const res = mockRes();
    let called = false;
    requireRole("Admin", "Manager")(req, res, () => { called = true; });
    expect(called).toBe(true);
  });
});

test("blocks Viewer from dashboard route (403)", () => {
  const req = { user: { role: "Viewer" } };
  const res = mockRes();
  requireRole("Admin", "Manager")(req, res, () => {});
  expect(res._status).toBe(403);
});

test("allows all roles to access content route", () => {
  ["Admin", "Manager", "Viewer"].forEach(role => {
    const req = { user: { role } };
    const res = mockRes();
    let called = false;
    requireRole("Admin", "Manager", "Viewer")(req, res, () => { called = true; });
    expect(called).toBe(true);
  });
});

// ─────────────────────────────────────────────
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
