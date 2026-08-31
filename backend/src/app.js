const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const crypto = require("crypto");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errors");

function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001").split(",");
  app.use((req, res, next) => { req.requestId = crypto.randomUUID(); res.setHeader("X-Request-Id", req.requestId); next(); });
  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
  app.use(express.json({ limit: "20kb" }));
  app.use(morgan(":method :url :status :response-time ms", { skip: () => process.env.NODE_ENV === "test" }));
  app.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" }, requestId: req.requestId }));
  app.use("/api/v1", routes);
  app.use(notFound); app.use(errorHandler);
  return app;
}
module.exports = { createApp };
