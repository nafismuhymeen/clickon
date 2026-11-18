import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool, db } from "../src/db/index.js";
import { redis } from "../src/config/redis.js";
import { clicks } from "../src/db/schema/index.js";

const app = createApp();

describe("Analytics Module (/api/links/:id/analytics)", () => {
  let userToken = "";
  let otherToken = "";
  let linkId = 0;

  beforeAll(async () => {
    // 1. Register main user
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: `analytics_user_${Date.now()}@clickon.io`,
        password: "Password123!",
        role: "PRO",
      });
    userToken = userRes.body.data.accessToken;

    // 2. Register other user
    const otherRes = await request(app)
      .post("/api/auth/register")
      .send({
        email: `other_analytics_${Date.now()}@clickon.io`,
        password: "Password123!",
        role: "PRO",
      });
    otherToken = otherRes.body.data.accessToken;

    // 3. Create link
    const linkRes = await request(app)
      .post("/api/links")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        originalUrl: "https://example.com/analytics-target",
      });
    linkId = linkRes.body.data.id;

    // 4. Seed clicks directly for this link
    const now = new Date();
    await db.insert(clicks).values([
      {
        linkId,
        country: "United States",
        city: "San Francisco",
        device: "Desktop (Chrome)",
        browser: "Chrome",
        referrer: "Twitter / X",
        ip: "1.1.1.1",
        createdAt: now,
      },
      {
        linkId,
        country: "United States",
        city: "New York",
        device: "Mobile (Safari)",
        browser: "Safari",
        referrer: "Direct",
        ip: "1.1.1.2",
        createdAt: now,
      },
      {
        linkId,
        country: "Germany",
        city: "Berlin",
        device: "Desktop (Firefox)",
        browser: "Firefox",
        referrer: "LinkedIn",
        ip: "1.1.1.3",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ]);
  });

  afterAll(async () => {
    await pool.end();
    await redis.quit();
  });

  it("GET /api/links/:id/analytics returns exact Analytics shape", async () => {
    const res = await request(app)
      .get(`/api/links/${linkId}/analytics`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const data = res.body.data;
    expect(data.linkId).toBe(linkId);
    expect(data.totalClicks).toBe(3);
    expect(data.uniqueCountries).toBe(2); // US and Germany
    expect(data.clicksToday).toBe(2);
    expect(data.clicksThisWeek).toBe(3);

    // Top Countries
    expect(Array.isArray(data.topCountries)).toBe(true);
    expect(data.topCountries.length).toBeLessThanOrEqual(5);
    expect(data.topCountries[0].country).toBe("United States");
    expect(data.topCountries[0].count).toBe(2);

    // Top Devices
    expect(Array.isArray(data.topDevices)).toBe(true);
    expect(data.topDevices.length).toBeLessThanOrEqual(5);

    // Top Referrers
    expect(Array.isArray(data.topReferrers)).toBe(true);
    expect(data.topReferrers.length).toBeLessThanOrEqual(5);

    // clicksByDay (7 days, format matching ClicksChart)
    expect(Array.isArray(data.clicksByDay)).toBe(true);
    expect(data.clicksByDay).toHaveLength(7);
    for (const item of data.clicksByDay) {
      expect(typeof item.date).toBe("string");
      expect(typeof item.count).toBe("number");
      expect(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).toContain(item.date);
    }
  });

  it("Non-owner cannot view analytics (returns 404)", async () => {
    const res = await request(app)
      .get(`/api/links/${linkId}/analytics`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

