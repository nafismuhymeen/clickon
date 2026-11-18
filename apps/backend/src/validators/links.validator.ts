import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z
    .string({ required_error: "Destination URL is required" })
    .min(1, "Destination URL is required"),
  customSlug: z.string().trim().optional(),
  expiresAt: z.union([z.string(), z.date()]).optional(),
});

export const updateLinkSchema = z.object({
  originalUrl: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.union([z.string(), z.date()]).nullable().optional(),
});

export const listLinksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
});

