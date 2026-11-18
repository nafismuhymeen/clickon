import { env } from "../config/env.js";
import { AppError } from "./errors.js";

const MAX_URL_LENGTH = 2048;

function isPrivateIp(hostname: string): boolean {
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0"
  ) {
    return true;
  }

  // Check IPv4 ranges
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private)
    if (a === 10) return true;
    // 172.16.0.0/12 (Private: 172.16.0.0 – 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local)
    if (a === 169 && b === 254) return true;
  }

  return false;
}

export function validateOriginalUrl(inputUrl: string): string {
  if (!inputUrl || typeof inputUrl !== "string") {
    throw AppError.badRequest("URL is required", "INVALID_URL");
  }

  const trimmed = inputUrl.trim();

  if (trimmed.length > MAX_URL_LENGTH) {
    throw AppError.badRequest(
      `URL exceeds maximum allowed length of ${MAX_URL_LENGTH} characters`,
      "URL_TOO_LONG"
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw AppError.badRequest("Malformed destination URL", "INVALID_URL_FORMAT");
  }

  // Reject unsafe schemes
  const protocol = parsedUrl.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    throw AppError.badRequest(
      "Only http and https protocols are supported",
      "INVALID_URL_SCHEME"
    );
  }

  // Prevent redirect loops back to our BASE_URL or self
  let parsedBaseUrl: URL;
  try {
    parsedBaseUrl = new URL(env.BASE_URL);
    if (
      parsedUrl.hostname.toLowerCase() === parsedBaseUrl.hostname.toLowerCase() &&
      parsedUrl.port === parsedBaseUrl.port
    ) {
      throw AppError.badRequest(
        "Redirect loop detected: Destination URL cannot point back to this service",
        "REDIRECT_LOOP"
      );
    }
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
  }

  // Reject localhost and private IP addresses in production
  if (env.NODE_ENV === "production" && isPrivateIp(parsedUrl.hostname.toLowerCase())) {
    throw AppError.badRequest(
      "Private and internal IP ranges are forbidden in production",
      "FORBIDDEN_DESTINATION_HOST"
    );
  }

  return trimmed;
}

export function validateFutureDate(dateInput: string | Date | undefined | null): Date | null {
  if (!dateInput) return null;

  const parsed = new Date(dateInput);
  if (isNaN(parsed.getTime())) {
    throw AppError.badRequest("Invalid date format for expiresAt", "INVALID_DATE");
  }

  if (parsed.getTime() <= Date.now()) {
    throw AppError.badRequest(
      "Expiration date must be set in the future",
      "EXPIRATION_IN_PAST"
    );
  }

  return parsed;
}

