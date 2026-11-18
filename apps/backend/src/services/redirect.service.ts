import { db } from "../db/index.js";
import { links, clicks } from "../db/schema/index.js";
import { eq, or, sql } from "drizzle-orm";
import { redis } from "../config/redis.js";
import {
  extractClientIp,
  isBot,
  normalizeReferrer,
  parseDeviceAndBrowser,
  parseGeoLocation,
} from "../utils/geoDevice.js";
import { emitClickEvent } from "../sockets/index.js";
import type { Request } from "express";

interface CachedLinkData {
  id: number;
  originalUrl: string;
  isActive: boolean;
  expiresAt: string | null;
}

export class RedirectService {
  static async resolveCode(
    code: string
  ): Promise<{ status: "FOUND" | "NOT_FOUND" | "GONE"; link?: CachedLinkData }> {
    const cacheKey = `url:${code}`;

    // 1. Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      try {
        const linkData = JSON.parse(cached) as CachedLinkData;
        if (!linkData.isActive) {
          return { status: "GONE" };
        }
        if (linkData.expiresAt && new Date(linkData.expiresAt).getTime() <= Date.now()) {
          return { status: "GONE" };
        }
        return { status: "FOUND", link: linkData };
      } catch {
        // Cache parse error, proceed to DB
      }
    }

    // 2. Query DB
    const [row] = await db
      .select({
        id: links.id,
        originalUrl: links.originalUrl,
        isActive: links.isActive,
        expiresAt: links.expiresAt,
      })
      .from(links)
      .where(or(eq(links.shortCode, code), eq(links.customSlug, code)))
      .limit(1);

    if (!row) {
      return { status: "NOT_FOUND" };
    }

    const linkData: CachedLinkData = {
      id: row.id,
      originalUrl: row.originalUrl,
      isActive: row.isActive,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    };

    if (!linkData.isActive) {
      return { status: "GONE" };
    }

    if (linkData.expiresAt && new Date(linkData.expiresAt).getTime() <= Date.now()) {
      return { status: "GONE" };
    }

    // Cache valid link in Redis (TTL: 300 seconds / 5 mins)
    await redis.set(cacheKey, JSON.stringify(linkData), 300);

    return { status: "FOUND", link: linkData };
  }

  static recordClickAsync(linkId: number, req: Request): void {
    // Run asynchronously without blocking redirect response
    setImmediate(async () => {
      try {
        const userAgent = req.headers["user-agent"];

        // Skip bot traffic
        if (isBot(userAgent)) {
          return;
        }

        const ip = extractClientIp(req);
        const geo = parseGeoLocation(ip);
        const { device, browser } = parseDeviceAndBrowser(userAgent);
        const rawReferrer = req.headers["referer"] || req.headers["referrer"];
        const referrer = normalizeReferrer(
          Array.isArray(rawReferrer) ? rawReferrer[0] : rawReferrer
        );

        // Record in DB
        await db.insert(clicks).values({
          linkId,
          country: geo.country,
          city: geo.city,
          device,
          browser,
          referrer,
          ip,
        });

        // Compute updated total clicks for real-time live counter
        const [totalCountRecord] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(clicks)
          .where(eq(clicks.linkId, linkId));

        const totalClicks = totalCountRecord?.count ?? 0;

        // Emit real-time WebSocket event
        emitClickEvent({
          linkId,
          country: geo.country,
          device,
          timestamp: new Date().toISOString(),
          totalClicks,
        });
      } catch (err) {
        console.error("Error recording click asynchronously:", err);
      }
    });
  }
}

