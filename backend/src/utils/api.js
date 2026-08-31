class ApiError extends Error { constructor(status, message, code = "REQUEST_FAILED") { super(message); this.status = status; this.code = code; } }
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const send = (res, status, data, message) => res.status(status).json({ success: true, data, ...(message && { message }) });
module.exports = { ApiError, asyncHandler, send };
