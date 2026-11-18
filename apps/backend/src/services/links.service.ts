import { db } from "../db/index.js";
import { links, clicks } from "../db/schema/index.js";
import { eq, and, sql, desc, ilike, or } from "drizzle-orm";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import {
  FREE_MAX_ACTIVE_LINKS,
  FREE_ALLOW_CUSTOM_SLUG,
} from "../config/limits.js";
import { generateShortCode, validateCustomSlug } from "../utils/shortCode.js";
import { validateOriginalUrl, validateFutureDate } from "../utils/urlValidator.js";
import { AppError } from "../utils/errors.js";
import type { Link, User } from "../types/index.js";

function formatLink(
  row: typeof links.$inferSelect & { totalClicks?: number }
): Link {
  return {
    id: row.id,
    shortCode: row.shortCode,
    shortUrl: `${env.BASE_URL}/r/${row.shortCode}`,
    originalUrl: row.originalUrl,
    customSlug: row.customSlug || undefined,
    isActive: row.isActive,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
    totalClicks: row.totalClicks !== undefined ? Number(row.totalClicks) : 0,
  };
}

export class LinksService {
  static async createLink(
    user: User,
    data: {
      originalUrl: string;
      customSlug?: string;
      expiresAt?: string | Date;
    }
  ): Promise<Link> {
    const validUrl = validateOriginalUrl(data.originalUrl);
    const expiresAt = validateFutureDate(data.expiresAt);

    // Free tier checks
    if (user.role === "FREE") {
      if (data.customSlug) {
        throw AppError.forbidden(
          "Custom slugs are a PRO feature. Upgrade to create branded custom aliases.",
          "PRO_FEATURE_REQUIRED"
        );
      }

      // Check active links limit
      const [countResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(links)
        .where(and(eq(links.userId, user.id), eq(links.isActive, true)));

      if ((countResult?.count ?? 0) >= FREE_MAX_ACTIVE_LINKS) {
        throw AppError.forbidden(
          `Free tier limit reached (maximum ${FREE_MAX_ACTIVE_LINKS} active links). Please upgrade to PRO for unlimited links.`,
          "LIMIT_EXCEEDED"
        );
      }
    }

    let shortCode: string;
    let customSlug: string | null = null;

    if (data.customSlug) {
      if (!FREE_ALLOW_CUSTOM_SLUG && user.role !== "PRO") {
        throw AppError.forbidden("Custom slugs are a PRO feature", "PRO_FEATURE_REQUIRED");
      }

      const validatedSlug = validateCustomSlug(data.customSlug);

      // Check slug uniqueness
      const [existingSlug] = await db
        .select({ id: links.id })
        .from(links)
        .where(or(eq(links.shortCode, validatedSlug), eq(links.customSlug, validatedSlug)))
        .limit(1);

      if (existingSlug) {
        throw AppError.conflict(
          `The custom slug "${validatedSlug}" is already taken`,
          "SLUG_ALREADY_EXISTS"
        );
      }

      shortCode = validatedSlug;
      customSlug = validatedSlug;
    } else {
      // Generate collision-safe random code with retries
      let attempts = 0;
      const MAX_ATTEMPTS = 5;
      shortCode = generateShortCode();

      while (attempts < MAX_ATTEMPTS) {
        const [existing] = await db
          .select({ id: links.id })
          .from(links)
          .where(eq(links.shortCode, shortCode))
          .limit(1);

        if (!existing) break;
        attempts++;
        shortCode = generateShortCode();
      }

      if (attempts >= MAX_ATTEMPTS) {
        throw AppError.internal("Failed to generate a unique short code, please try again");
      }
    }

    const [created] = await db
      .insert(links)
      .values({
        shortCode,
        originalUrl: validUrl,
        customSlug,
        userId: user.id,
        expiresAt,
        isActive: true,
      })
      .returning();

    return formatLink({ ...created, totalClicks: 0 });
  }

  static async listUserLinks(
    userId: number,
    query: { page: number; limit: number; search?: string }
  ): Promise<{
    links: Link[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, query.page);
    const limit = Math.max(1, Math.min(100, query.limit));
    const offset = (page - 1) * limit;

    const conditions = [eq(links.userId, userId)];

    if (query.search) {
      const searchPattern = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(links.shortCode, searchPattern),
          ilike(links.originalUrl, searchPattern),
          ilike(links.customSlug, searchPattern)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [totalRecord] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(whereClause);

    const total = totalRecord?.count ?? 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch links with aggregated totalClicks via LEFT JOIN clicks
    const rows = await db
      .select({
        id: links.id,
        shortCode: links.shortCode,
        originalUrl: links.originalUrl,
        customSlug: links.customSlug,
        userId: links.userId,
        expiresAt: links.expiresAt,
        isActive: links.isActive,
        createdAt: links.createdAt,
        updatedAt: links.updatedAt,
        totalClicks: sql<number>`count(${clicks.id})::int`.as("total_clicks"),
      })
      .from(links)
      .leftJoin(clicks, eq(links.id, clicks.linkId))
      .where(whereClause)
      .groupBy(links.id)
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      links: rows.map(formatLink),
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async getLinkById(userId: number, linkId: number): Promise<Link> {
    const [row] = await db
      .select({
        id: links.id,
        shortCode: links.shortCode,
        originalUrl: links.originalUrl,
        customSlug: links.customSlug,
        userId: links.userId,
        expiresAt: links.expiresAt,
        isActive: links.isActive,
        createdAt: links.createdAt,
        updatedAt: links.updatedAt,
        totalClicks: sql<number>`count(${clicks.id})::int`.as("total_clicks"),
      })
      .from(links)
      .leftJoin(clicks, eq(links.id, clicks.linkId))
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .groupBy(links.id)
      .limit(1);

    if (!row) {
      throw AppError.notFound("Link not found or access denied", "LINK_NOT_FOUND");
    }

    return formatLink(row);
  }

  static async updateLink(
    userId: number,
    linkId: number,
    data: {
      originalUrl?: string;
      isActive?: boolean;
      expiresAt?: string | Date | null;
    }
  ): Promise<Link> {
    // Verify ownership
    const [existing] = await db
      .select()
      .from(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .limit(1);

    if (!existing) {
      throw AppError.notFound("Link not found or access denied", "LINK_NOT_FOUND");
    }

    const updates: Partial<typeof links.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.originalUrl !== undefined) {
      updates.originalUrl = validateOriginalUrl(data.originalUrl);
    }

    if (data.isActive !== undefined) {
      updates.isActive = data.isActive;
    }

    if (data.expiresAt !== undefined) {
      updates.expiresAt = data.expiresAt ? validateFutureDate(data.expiresAt) : null;
    }

    const [updated] = await db
      .update(links)
      .set(updates)
      .where(eq(links.id, linkId))
      .returning();

    // Invalidate Redis cache
    await redis.del(`url:${existing.shortCode}`);
    if (existing.customSlug && existing.customSlug !== existing.shortCode) {
      await redis.del(`url:${existing.customSlug}`);
    }

    // Get updated total clicks
    const [clickCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(clicks)
      .where(eq(clicks.linkId, linkId));

    return formatLink({
      ...updated,
      totalClicks: clickCount?.count ?? 0,
    });
  }

  static async deleteLink(userId: number, linkId: number): Promise<void> {
    const [existing] = await db
      .select({ id: links.id, shortCode: links.shortCode, customSlug: links.customSlug })
      .from(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .limit(1);

    if (!existing) {
      throw AppError.notFound("Link not found or access denied", "LINK_NOT_FOUND");
    }

    await db.delete(links).where(eq(links.id, linkId));

    // Invalidate Redis cache
    await redis.del(`url:${existing.shortCode}`);
    if (existing.customSlug && existing.customSlug !== existing.shortCode) {
      await redis.del(`url:${existing.customSlug}`);
    }
  }
}

