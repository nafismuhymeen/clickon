import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/index.js";
import { redis } from "../src/config/redis.js";

const app = createApp();

describe("Contact Module (POST /api/contact)", () => {
  afterAll(async () => {
    await pool.end();
    await redis.quit();
  });

  it("POST /api/contact succeeds with valid fields", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({
        name: "Alex Mercer",
        email: "alex@company.com",
        topic: "support",
        message: "Need help with API rate limits.",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Your message has been dispatched to our engineering team!");
  });

  it("POST /api/contact rejects invalid topic", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({
        name: "Alex Mercer",
        email: "alex@company.com",
        topic: "invalid-topic-xyz",
        message: "Message text",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/contact rejects empty message", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({
        name: "Alex Mercer",
        email: "alex@company.com",
        topic: "general",
        message: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/contact with honeypot filled silently returns success without dispatching", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({
        name: "Spam Bot",
        email: "bot@spam.com",
        topic: "general",
        message: "Buy cheap crypto",
        honeypot: "gotcha-bot",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

