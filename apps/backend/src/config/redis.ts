import { Redis } from "ioredis";
import { env } from "./env.js";

let redisClient: Redis | null = null;
let isRedisAvailable = false;

if (env.REDIS_URL) {
  try {
    const client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times) => {
        if (times > 3) {
          return null; // Stop retrying after 3 attempts
        }
        return Math.min(times * 100, 1000);
      },
    });

    client.on("connect", () => {
      isRedisAvailable = true;
      console.log("Redis connected successfully");
    });

    client.on("error", (err) => {
      isRedisAvailable = false;
      // Log connection errors without crashing
      if (process.env.NODE_ENV !== "test") {
        console.warn("Redis unavailable, falling back to database:", err.message);
      }
    });

    client.on("close", () => {
      isRedisAvailable = false;
    });

    // Attempt initial connection asynchronously
    client.connect().catch((err) => {
      isRedisAvailable = false;
      if (process.env.NODE_ENV !== "test") {
        console.warn("Redis initial connect failed (optional fallback enabled):", err.message);
      }
    });

    redisClient = client;
  } catch (err: unknown) {
    isRedisAvailable = false;
    console.warn("Could not initialize Redis client, proceeding without Redis:", err);
  }
}

export const redis = {
  getClient: (): Redis | null => redisClient,
  isAvailable: (): boolean => isRedisAvailable && redisClient !== null,

  async ping(): Promise<boolean> {
    if (!redisClient || !isRedisAvailable) return false;
    try {
      const pong = await redisClient.ping();
      return pong === "PONG";
    } catch {
      return false;
    }
  },

  async get(key: string): Promise<string | null> {
    if (!redisClient || !isRedisAvailable) return null;
    try {
      return await redisClient.get(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!redisClient || !isRedisAvailable) return;
    try {
      if (ttlSeconds) {
        await redisClient.set(key, value, "EX", ttlSeconds);
      } else {
        await redisClient.set(key, value);
      }
    } catch {
      // Ignore cache write errors
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient || !isRedisAvailable) return;
    try {
      await redisClient.del(key);
    } catch {
      // Ignore cache deletion errors
    }
  },

  async quit(): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch {
        // Ignore on shutdown
      }
    }
  },
};

