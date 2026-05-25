const jwt = require("jsonwebtoken");
const { dbHelpers } = require("../config/database");

function verifyToken(req, res, next) {
  // It checks the jwt token before giving them the access
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_change_in_prod");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
// checks if the role has the access to the page
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`
      });
    }

    dbHelpers.addLog(req.user.id, `ACCESS:${req.method}`, req.originalUrl);
    next();
  };
}

module.exports = { verifyToken, requireRole };
