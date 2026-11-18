import { Router, type Request, type Response } from "express";
import { checkDbConnection } from "../db/index.js";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  asyncHandler(async (_req: Request, res: Response) => {
    const isDbConnected = await checkDbConnection();
    const isRedisConnected = await redis.ping();

    const isHealthy = isDbConnected;
    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json({
      status: isHealthy ? "ok" : "error",
      message: isHealthy
        ? "ClickOn Express backend is operating normally"
        : "Database connectivity failure",
      services: {
        database: isDbConnected ? "connected" : "disconnected",
        redis: isRedisConnected ? "connected" : "disabled_or_unreachable",
      },
      environment: env.NODE_ENV,
    });
  })
);

