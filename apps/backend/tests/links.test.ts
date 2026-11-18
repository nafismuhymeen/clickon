import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/index.js";
import { redis } from "../src/config/redis.js";

const app = createApp();

describe("Links CRUD & Ownership Isolation (/api/links)", () => {
  let freeToken = "";
  let proToken = "";
  let freeLinkId = 0;
  const customSlugPro = `my-campaign-${Date.now().toString().slice(-6)}`;

  beforeAll(async () => {
    // Register FREE user
    const freeRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: `free_user_${Date.now()}@clickon.io`,
        password: "Password123!",
        role: "FREE",
      });
    freeToken = freeRes.body.data.accessToken;

    // Register PRO user
    const proRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: `pro_user_${Date.now()}@clickon.io`,
        password: "Password123!",
        role: "PRO",
      });
    proToken = proRes.body.data.accessToken;
  });

  afterAll(async () => {
    await pool.end();
    await redis.quit();
  });

  it("POST /api/links creates a link with auto-generated shortCode for FREE user", async () => {
    const res = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${freeToken}`)
      .send({
        originalUrl: "https://example.com/long-landing-page",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.shortCode).toHaveLength(7);
    expect(res.body.data.shortUrl).toContain(`/r/${res.body.data.shortCode}`);
    expect(res.body.data.originalUrl).toBe("https://example.com/long-landing-page");
    expect(res.body.data.isActive).toBe(true);
    expect(res.body.data.totalClicks).toBe(0);

    freeLinkId = res.body.data.id;
  });

  it("POST /api/links rejects customSlug for FREE user with 403 Forbidden", async () => {
    const res = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${freeToken}`)
      .send({
        originalUrl: "https://example.com/brand",
        customSlug: "free-attempt",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("PRO_FEATURE_REQUIRED");
  });

  it("POST /api/links allows customSlug for PRO user", async () => {
    const res = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${proToken}`)
      .send({
        originalUrl: "https://example.com/pro-landing",
        customSlug: customSlugPro,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shortCode).toBe(customSlugPro);
    expect(res.body.data.customSlug).toBe(customSlugPro);
  });

  it("POST /api/links rejects reserved custom slugs", async () => {
    const res = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${proToken}`)
      .send({
        originalUrl: "https://example.com/admin",
        customSlug: "admin",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("RESERVED_SLUG");
  });

  it("POST /api/links rejects invalid URL schemes (e.g. javascript:)", async () => {
    const res = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${proToken}`)
      .send({
        originalUrl: "javascript:alert(1)",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/links returns PaginatedResponse<Link> scoped to owner", async () => {
    const res = await request(app)
      .get("/api/links?page=1&limit=10")
      .set("Authorization", `Bearer ${freeToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);

    // Ensure PRO user's link is not returned to FREE user
    const hasProLink = res.body.data.some((l: { shortCode: string }) => l.shortCode === customSlugPro);
    expect(hasProLink).toBe(false);
  });

  it("Ownership Isolation: PRO user cannot GET another user's link", async () => {
    const res = await request(app)
      .get(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${proToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("Ownership Isolation: PRO user cannot PATCH another user's link", async () => {
    const res = await request(app)
      .patch(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${proToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("Ownership Isolation: PRO user cannot DELETE another user's link", async () => {
    const res = await request(app)
      .delete(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${proToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("PATCH /api/links/:id allows owner to deactivate link", async () => {
    const res = await request(app)
      .patch(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${freeToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it("DELETE /api/links/:id deletes the link", async () => {
    const deleteRes = await request(app)
      .delete(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${freeToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const getRes = await request(app)
      .get(`/api/links/${freeLinkId}`)
      .set("Authorization", `Bearer ${freeToken}`);

    expect(getRes.status).toBe(404);
  });
});
