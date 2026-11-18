import { customAlphabet } from "nanoid";
import {
  SLUG_MIN_LENGTH,
  SLUG_MAX_LENGTH,
  CUSTOM_SLUG_REGEX,
  RESERVED_SLUGS,
} from "../config/limits.js";
import { AppError } from "./errors.js";

// Base62 alphabet for collision-resistant 7-character short codes
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid7 = customAlphabet(ALPHABET, 7);

export function generateShortCode(): string {
  return nanoid7();
}

export function validateCustomSlug(slug: string): string {
  const trimmed = slug.trim();

  if (trimmed.length < SLUG_MIN_LENGTH || trimmed.length > SLUG_MAX_LENGTH) {
    throw AppError.badRequest(
      `Custom slug must be between ${SLUG_MIN_LENGTH} and ${SLUG_MAX_LENGTH} characters`,
      "INVALID_SLUG_LENGTH"
    );
  }

  if (!CUSTOM_SLUG_REGEX.test(trimmed)) {
    throw AppError.badRequest(
      "Custom slug can only contain alphanumeric characters, underscores, and hyphens",
      "INVALID_SLUG_FORMAT"
    );
  }

  if (RESERVED_SLUGS.has(trimmed.toLowerCase())) {
    throw AppError.badRequest(
      `"${trimmed}" is a reserved system keyword and cannot be used as a custom slug`,
      "RESERVED_SLUG"
    );
  }

  return trimmed;
}

