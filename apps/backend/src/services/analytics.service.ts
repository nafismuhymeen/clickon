import { db } from "../db/index.js";
import { links, clicks } from "../db/schema/index.js";
import { eq, and, sql, gte, desc } from "drizzle-orm";
import { AppError } from "../utils/errors.js";
import { WEEKDAY_LABELS, ANALYTICS_TOP_LIMIT } from "../config/limits.js";
import type { Analytics } from "../types/index.js";

export class AnalyticsService {
  static async getLinkAnalytics(userId: number, linkId: number): Promise<Analytics> {
    // Verify link belongs to user
    const [link] = await db
      .select({ id: links.id })
      .from(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .limit(1);

    if (!link) {
      throw AppError.notFound("Link not found or access denied", "LINK_NOT_FOUND");
    }

    const now = new Date();
    // Start of today UTC
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
    );
    // Start of 7-day window UTC (6 days ago 00:00:00 UTC through today)
    const sevenDaysAgoStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6, 0, 0, 0, 0)
    );

    // 1. Total Clicks
    const [totalClicksRecord] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(clicks)
      .where(eq(clicks.linkId, linkId));
    const totalClicks = totalClicksRecord?.count ?? 0;

    // 2. Unique Countries
    const [uniqueCountriesRecord] = await db
      .select({
        count: sql<number>`count(DISTINCT ${clicks.country})::int`,
      })
      .from(clicks)
      .where(
        and(
          eq(clicks.linkId, linkId),
          sql`${clicks.country} IS NOT NULL AND ${clicks.country} != 'Unknown'`
        )
      );
    const uniqueCountries = uniqueCountriesRecord?.count ?? 0;

    // 3. Clicks Today (UTC)
    const [clicksTodayRecord] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(clicks)
      .where(and(eq(clicks.linkId, linkId), gte(clicks.createdAt, todayStart)));
    const clicksToday = clicksTodayRecord?.count ?? 0;

    // 4. Clicks This Week (last 7 days UTC)
    const [clicksThisWeekRecord] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(clicks)
      .where(and(eq(clicks.linkId, linkId), gte(clicks.createdAt, sevenDaysAgoStart)));
    const clicksThisWeek = clicksThisWeekRecord?.count ?? 0;

    // 5. Top Countries (Limit 5)
    const topCountriesRaw = await db
      .select({
        country: sql<string>`coalesce(${clicks.country}, 'Unknown')`,
        count: sql<number>`count(*)::int`,
      })
      .from(clicks)
      .where(eq(clicks.linkId, linkId))
      .groupBy(clicks.country)
      .orderBy(desc(sql`count(*)`))
      .limit(ANALYTICS_TOP_LIMIT);

    const topCountries = topCountriesRaw.map((row) => ({
      country: row.country,
      count: Number(row.count),
    }));

    // 6. Top Devices (Limit 5)
    const topDevicesRaw = await db
      .select({
        device: sql<string>`coalesce(${clicks.device}, 'Desktop')`,
        count: sql<number>`count(*)::int`,
      })
      .from(clicks)
      .where(eq(clicks.linkId, linkId))
      .groupBy(clicks.device)
      .orderBy(desc(sql`count(*)`))
      .limit(ANALYTICS_TOP_LIMIT);

    const topDevices = topDevicesRaw.map((row) => ({
      device: row.device,
      count: Number(row.count),
    }));

    // 7. Top Referrers (Limit 5)
    const topReferrersRaw = await db
      .select({
        referrer: sql<string>`coalesce(${clicks.referrer}, 'Direct')`,
        count: sql<number>`count(*)::int`,
      })
      .from(clicks)
      .where(eq(clicks.linkId, linkId))
      .groupBy(clicks.referrer)
      .orderBy(desc(sql`count(*)`))
      .limit(ANALYTICS_TOP_LIMIT);

    const topReferrers = topReferrersRaw.map((row) => ({
      referrer: row.referrer,
      count: Number(row.count),
    }));

    // 8. Clicks by Day (Last 7 days in chronological order ending today UTC)
    const dayRows = await db
      .select({
        dayKey: sql<string>`TO_CHAR(${clicks.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(clicks)
      .where(and(eq(clicks.linkId, linkId), gte(clicks.createdAt, sevenDaysAgoStart)))
      .groupBy(sql`TO_CHAR(${clicks.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`);

    const dayCountMap = new Map<string, number>();
    for (const row of dayRows) {
      dayCountMap.set(row.dayKey, Number(row.count));
    }

    const clicksByDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
      );
      const isoKey = d.toISOString().slice(0, 10);
      const label = WEEKDAY_LABELS[d.getUTCDay()];
      clicksByDay.push({
        date: label,
        count: dayCountMap.get(isoKey) || 0,
      });
    }

    return {
      linkId,
      totalClicks,
      uniqueCountries,
      clicksToday,
      clicksThisWeek,
      topCountries,
      topDevices,
      topReferrers,
      clicksByDay,
    };
  }
}

