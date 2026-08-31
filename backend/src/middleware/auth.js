const jwt = require("jsonwebtoken"); const { ApiError } = require("../utils/api");
function authenticate(req, res, next) { const token = req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.slice(7); if (!token) return next(new ApiError(401, "Authentication is required", "UNAUTHENTICATED")); try { req.auth = jwt.verify(token, process.env.JWT_SECRET); return next(); } catch { return next(new ApiError(401, "Session is invalid or expired", "INVALID_TOKEN")); } }
module.exports = { authenticate };
