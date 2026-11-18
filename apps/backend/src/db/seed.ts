import { db, pool } from "./index.js";
import { users, links, clicks } from "./schema/index.js";
import { hashPassword } from "../utils/tokens.js";
import { eq } from "drizzle-orm";

/**
 * ClickOn Database Seeder (Development / Test Only)
 * Creates demo FREE and PRO users with sample links and realistic click analytics.
 */
async function seed() {
  console.log("🌱 Starting ClickOn database seed (DEVELOPMENT ONLY)...");

  // 1. Create Demo Users
  const passwordHash = await hashPassword("password123");

  // Clean existing demo users if present
  await db.delete(users).where(eq(users.email, "nafis@clickon.io"));
  await db.delete(users).where(eq(users.email, "free@clickon.io"));

  const [proUser] = await db
    .insert(users)
    .values({
      email: "nafis@clickon.io",
      passwordHash,
      role: "PRO",
    })
    .returning();

  const [freeUser] = await db
    .insert(users)
    .values({
      email: "free@clickon.io",
      passwordHash,
      role: "FREE",
    })
    .returning();

  console.log(`✓ Created demo PRO user: ${proUser.email} (ID: ${proUser.id})`);
  console.log(`✓ Created demo FREE user: ${freeUser.email} (ID: ${freeUser.id})`);

  // 2. Create Sample Links for PRO User
  const [proLink1] = await db
    .insert(links)
    .values({
      userId: proUser.id,
      shortCode: "tech-launch-2026",
      customSlug: "tech-launch-2026",
      originalUrl: "https://github.com/nafis/clickon-monorepo",
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    })
    .returning();

  await db.insert(links).values([
    {
      userId: proUser.id,
      shortCode: "summer-sale",
      customSlug: "summer-sale",
      originalUrl: "https://store.clickon.io/campaigns/summer-2026",
      isActive: true,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      userId: proUser.id,
      shortCode: "product-demo",
      customSlug: "product-demo",
      originalUrl: "https://youtube.com/watch?v=demo12345",
      isActive: false,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  ]);

  // 3. Create Sample Links for FREE User
  const [freeLink1] = await db
    .insert(links)
    .values({
      userId: freeUser.id,
      shortCode: "free123",
      customSlug: null,
      originalUrl: "https://clickon.io/docs",
      isActive: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    })
    .returning();

  console.log("✓ Created sample links for both users");

  // 4. Seed Clicks for proLink1 (tech-launch-2026)
  const countries = ["United States", "Germany", "United Kingdom", "Japan", "Canada"];
  const devices = ["Desktop (Chrome)", "Mobile (Safari)", "Tablet", "Desktop (Firefox)"];
  const referrers = ["Twitter / X", "Direct", "LinkedIn", "Google Search", "GitHub"];

  const clickInserts = [];
  const now = Date.now();

  // Generate clicks distributed across the last 7 days
  for (let i = 0; i < 7; i++) {
    const dayTimestamp = now - i * 24 * 60 * 60 * 1000;
    // between 10 and 30 clicks per day
    const clicksForDay = 15 + (i * 3) % 15;

    for (let j = 0; j < clicksForDay; j++) {
      const clickTime = new Date(dayTimestamp - j * 12 * 60 * 1000);
      clickInserts.push({
        linkId: proLink1.id,
        country: countries[(i + j) % countries.length],
        city: "Sample City",
        device: devices[(j + i) % devices.length],
        browser: "Chrome",
        referrer: referrers[j % referrers.length],
        ip: `192.0.2.${(j % 250) + 1}`,
        createdAt: clickTime,
      });
    }
  }

  // Also add some clicks for freeLink1
  for (let j = 0; j < 5; j++) {
    clickInserts.push({
      linkId: freeLink1.id,
      country: "United States",
      city: "New York",
      device: "Desktop (Chrome)",
      browser: "Chrome",
      referrer: "Direct",
      ip: `198.51.100.${j + 1}`,
      createdAt: new Date(now - j * 60 * 60 * 1000),
    });
  }

  await db.insert(clicks).values(clickInserts);

  console.log(`✓ Seeded ${clickInserts.length} sample clicks for analytics verification`);
  console.log("🎉 Seed finished successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
