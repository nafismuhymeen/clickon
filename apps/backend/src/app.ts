import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.routes.js";
import { redirectRouter } from "./routes/redirect.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { linksRouter } from "./routes/links.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export function createApp(): express.Express {
  const app = express();

  // Trust proxy for reverse proxies / Cloudflare / edge hosting
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS restricted to FRONTEND_URL with credentials
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Request body parsing limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // HTTP Request logger (disabled in test runs)
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Health check endpoint (GET /health)
  app.use(healthRouter);

  // Public redirection routes (GET /r/:code)
  app.use("/r", redirectRouter);

  // API v1 and standard API routing
  app.use("/api/auth", authRouter);
  app.use("/api/links", linksRouter);
  app.use("/api/contact", contactRouter);

  // Compatibility aliases for /api/v1/*
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/links", linksRouter);
  app.use("/api/v1/contact", contactRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Central error handler
  app.use(errorHandler);

  return app;
}

