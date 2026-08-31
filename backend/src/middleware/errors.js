const { ApiError } = require("../utils/api");
function notFound(req, res, next) { next(new ApiError(404, "Route not found", "NOT_FOUND")); }
function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const status = error.status || (error.name === "ValidationError" ? 422 : 500);
  if (status >= 500) console.error({ requestId: req.requestId, error });
  res.status(status).json({ success: false, error: { code: error.code || "INTERNAL_ERROR", message: status === 500 ? "An unexpected error occurred" : error.message }, requestId: req.requestId });
}
module.exports = { notFound, errorHandler };
