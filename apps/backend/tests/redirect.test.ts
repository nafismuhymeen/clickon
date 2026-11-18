import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool, db } from "../src/db/index.js";
import { redis } from "../src/config/redis.js";
import { clicks } from "../src/db/schema/index.js";
import { eq } from "drizzle-orm";

const app = createApp();

describe("Redirect & Click Tracking (/r/:code)", () => {
  let userToken = "";
  let activeCode = "";
  let activeLinkId = 0;
  let inactiveCode = "";
  let expiredCode = "";

  beforeAll(async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: `redirect_tester_${Date.now()}@clickon.io`,
        password: "Password123!",
        role: "PRO",
      });
    userToken = regRes.body.data.accessToken;

    // 1. Create active link
    const linkRes = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        originalUrl: "https://example.com/target-destination",
      });
    activeCode = linkRes.body.data.shortCode;
    activeLinkId = linkRes.body.data.id;

    // 2. Create inactive link
    const inactiveRes = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        originalUrl: "https://example.com/inactive",
      });
    inactiveCode = inactiveRes.body.data.shortCode;
    await request(app)
      .patch(`/api/links/${inactiveRes.body.data.id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ isActive: false });

    // 3. Create expired link (expired 1 hour ago)
    const expiredRes = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        originalUrl: "https://example.com/expired",
        expiresAt: new Date(Date.now() + 2000).toISOString(),
      });
    expiredCode = expiredRes.body.data.shortCode;
    // Set to past directly via pool
    await pool.query("UPDATE links SET expires_at = NOW() - INTERVAL '1 hour' WHERE id = $1", [
      expiredRes.body.data.id,
    ]);
  });

  afterAll(async () => {
    await pool.end();
    await redis.quit();
  });

  it("GET /r/:code performs 302 redirect to original destination", async () => {
    const res = await request(app)
      .get(`/r/${activeCode}`)
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0")
      .set("Referer", "https://twitter.com/clickon");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("https://example.com/target-destination");
  });

  it("Records click in database asynchronously following 302 redirect", async () => {
    // Wait briefly for asynchronous setImmediate to record click
    await new Promise((resolve) => setTimeout(resolve, 300));

    const clickRecords = await db
      .select()
      .from(clicks)
      .where(eq(clicks.linkId, activeLinkId));

    expect(clickRecords.length).toBeGreaterThanOrEqual(1);
    expect(clickRecords[0].referrer).toBe("Twitter / X");
    expect(clickRecords[0].device).toContain("Desktop");
  });

  it("GET /r/:code for inactive link returns 410 Gone", async () => {
    const res = await request(app).get(`/r/${inactiveCode}`);
    expect(res.status).toBe(410);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("GONE");
  });

  it("GET /r/:code for expired link returns 410 Gone", async () => {
    const res = await request(app).get(`/r/${expiredCode}`);
    expect(res.status).toBe(410);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("GONE");
  });

  it("GET /r/nonexistent for API / non-HTML client returns 404", async () => {
    const res = await request(app)
      .get("/r/not-found-xyz")
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("GET /r/nonexistent for browser client redirects to FRONTEND_URL/404", async () => {
    const res = await request(app)
      .get("/r/not-found-xyz")
      .set("Accept", "text/html,application/xhtml+xml");

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("/404");
  });
});

