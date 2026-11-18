import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";
import { redis } from "./config/redis.js";
import { initSocketIO } from "./sockets/index.js";

const app = createApp();
const server = http.createServer(app);

// Initialize real-time Socket.IO
initSocketIO(server);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`ClickOn server is listening on port ${PORT}`);
  console.log(`Base URL: ${env.BASE_URL}`);
  console.log(`Frontend URL: ${env.FRONTEND_URL}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown handling
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}, initiating graceful shutdown...`);

  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await pool.end();
      console.log("PostgreSQL connection pool closed.");
    } catch (err) {
      console.error("Error closing PostgreSQL connection pool:", err);
    }

    try {
      await redis.quit();
      console.log("Redis connection closed.");
    } catch (err) {
      console.error("Error closing Redis connection:", err);
    }

    console.log("Shutdown complete. Exiting process.");
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error("Graceful shutdown timed out, force terminating.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
