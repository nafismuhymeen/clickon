import { rateLimit, type Options } from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { redis } from "../config/redis.js";
import { sendError } from "../utils/response.js";
import type { Request, Response } from "express";

function createStore(prefix: string) {
  if (process.env.NODE_ENV === "test") {
    return undefined;
  }
  const client = redis.getClient();
  if (redis.isAvailable() && client) {
    try {
      return new RedisStore({
        sendCommand: (...args: string[]): Promise<RedisReply> => {
          const command = args[0];
          const cmdArgs = args.slice(1);
          return client.call(command, ...cmdArgs) as Promise<RedisReply>;
        },
        prefix: `rl:${prefix}:`,
      });
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function rateLimitHandler(_req: Request, res: Response): Response {
  return sendError(
    res,
    "TOO_MANY_REQUESTS",
    "Too many requests, please slow down and try again later",
    429
  );
}

const baseOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
};

// Strict on auth: 15 minutes, max 20 requests per IP
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 20,
  store: createStore("auth"),
});

// Strict on contact: 1 hour, max 10 submissions per IP
export const contactLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 10,
  store: createStore("contact"),
});

// Moderate on links management: 15 minutes, max 200 requests per IP
export const linksLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 200,
  store: createStore("links"),
});

// Generous on redirection /r/:code: 15 minutes, max 2000 clicks per IP
export const redirectLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 2000,
  store: createStore("redirect"),
});
