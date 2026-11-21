import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/index.js";
import { redis } from "../src/config/redis.js";

const app = createApp();

describe("Auth Integration Tests (/api/auth)", () => {
  const testUser = {
    email: `test_auth_${Date.now()}@clickon.io`,
    password: "Password123!",
  };

  let accessToken = "";
  let refreshToken = "";

  afterAll(async () => {
    await pool.end();
    await redis.quit();
  });

  let verificationToken = "";

  it("POST /api/auth/register should register a new unverified user and send verification email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.message).toContain("verify");
  });

  it("POST /api/auth/login should reject unverified user with 403 Forbidden", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EMAIL_NOT_VERIFIED");
  });

  it("GET /api/auth/verify-email should verify user email with valid token", async () => {
    // Retrieve token from DB
    const [user] = await pool.query(
      "SELECT verification_token FROM users WHERE email = $1",
      [testUser.email.toLowerCase()]
    ).then((r) => r.rows);

    expect(user.verification_token).toBeDefined();
    verificationToken = user.verification_token;

    const res = await request(app)
      .get(`/api/auth/verify-email?token=${verificationToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/auth/login should authenticate valid credentials after email is verified", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it("POST /api/auth/register should reject duplicate email with 409 Conflict", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EMAIL_EXISTS");
  });

  it("POST /api/auth/login should reject invalid credentials with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("GET /api/auth/me should return authenticated user profile", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
  });

  it("POST /api/auth/refresh should return a new accessToken matching RefreshResponse", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).not.toHaveProperty("refreshToken"); // contract: accessToken only
  });

  it("POST /api/auth/logout should revoke the refresh token", async () => {
    const logoutRes = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ refreshToken });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // Reusing the revoked refresh token must now fail
    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(refreshRes.status).toBe(401);
    expect(refreshRes.body.success).toBe(false);
  });
});
