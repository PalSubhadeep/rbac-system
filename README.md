# 🔐 RBAC System — Role-Based Access Control

A full-stack web application implementing Role-Based Access Control (RBAC), built with **Node.js + Express** (backend) and **React** (frontend).

---

## 🗂️ Project Structure

```
rbac-app/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── config/
│   │   │   └── database.js       # DB setup, seeding, helper functions
│   │   ├── middleware/
│   │   │   └── auth.js           # verifyToken + requireRole (core RBAC logic)
│   │   └── routes/
│   │       ├── auth.js           # /api/auth/login, /register
│   │       ├── users.js          # /api/users (Admin only)
│   │       └── content.js        # /api/dashboard, /api/content
│   ├── middleware.test.js         # Unit tests for role-check middleware
│   ├── db.json                    # JSON file database (auto-created)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js                 # Routes setup
    │   ├── api.js                 # Axios instance with auto token attachment
    │   ├── context/
    │   │   └── AuthContext.js     # Global auth state (React Context)
    │   ├── components/
    │   │   ├── Navbar.js          # Role-aware navigation
    │   │   └── ProtectedRoute.js  # Route guard (redirects unauthorized users)
    │   └── pages/
    │       ├── Login.js
    │       ├── Register.js
    │       ├── Dashboard.js       # Admin + Manager only
    │       ├── AdminPanel.js      # Admin only
    │       ├── Content.js         # All authenticated users
    │       └── AccessDenied.js    # Shown on unauthorized access
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ installed
- npm installed

### Step 1 — Clone / Download the project
```bash
cd rbac-app
```

### Step 2 — Install all dependencies
```bash
npm install 
npm run install-all   # installs packages for both backend & frontend
npm start             # starts BOTH servers simultaneously
```
The frontend runs at **http://localhost:3000**

That's it! Visit http://localhost:3000 in your browser.

---

## 🌱 Seeded Users (Ready to Use)

Roles and users are automatically created in `db.json` on first run.

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| manager@example.com | manager123 | Manager |
| viewer@example.com | viewer123 | Viewer |

You can also register new users — they get the **Viewer** role by default.

---

## 🛡️ Role Permissions

| Feature | Admin | Manager | Viewer |
|---------|-------|---------|--------|
| View content | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |

---

## 🔌 API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, get JWT token |
| GET | /api/users | Admin | List all users |
| POST | /api/users/:id/role | Admin | Change user's role |
| DELETE | /api/users/:id | Admin | Delete a user |
| GET | /api/dashboard | Admin, Manager | Dashboard stats |
| GET | /api/content | All logged-in | View content |
| GET | /api/audit-logs | Admin | View audit trail |

All protected routes require: `Authorization: Bearer <token>` header.

---

## 🧪 Running Tests

```bash
cd backend
node middleware.test.js
```

Tests cover:
- Valid JWT token passes through
- Missing/invalid token returns 401
- Correct role grants access
- Wrong role returns 403
- Multi-role routes work correctly

---

## ✅ Bonus Features Implemented

- **Audit Logs** — Every login, role change, deletion, and page access is recorded
- **Role Assignment UI** — Admin can reassign roles directly from the Admin Panel
- **Unit Tests** — 9 tests for the role-check middleware (no test library needed)

---

## 🧠 Key Design Decisions & Assumptions

1. **Database**: Used `lowdb` (JSON file) instead of PostgreSQL/MySQL for simplicity. In production, swap `database.js` for a real SQL connection — the rest of the code stays the same.

2. **Roles in DB**: Roles are seeded into `db.json`, not hardcoded in the application logic. The `requireRole()` middleware checks the role from the JWT, and the JWT role is always looked up from the DB at login time.

3. **JWT Storage**: Token stored in `localStorage`. For production, `httpOnly` cookies are more secure (prevents XSS), but localStorage is simpler for a demo.

4. **Route Protection**: Unauthorized users are *redirected* to `/access-denied` — not just hidden. This is enforced in `ProtectedRoute.js` on the frontend AND by the middleware on the backend.

5. **Password Hashing**: All passwords are hashed with `bcryptjs` (10 salt rounds) — never stored in plain text.

6. **Self-protection**: An admin cannot delete or change the role of their own account.

---

## ⚠️ Known Limitations

- `db.json` is not suitable for production — use PostgreSQL or MongoDB
- No refresh token (JWT expires in 24 hours, user must re-login)
- No email verification on registration
- No rate limiting on login (could be brute-forced)
- Frontend is not deployed (runs locally only)
