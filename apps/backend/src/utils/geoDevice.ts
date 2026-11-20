import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import type { Request } from "express";

const ISO_COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  CA: "Canada",
  AU: "Australia",
  JP: "Japan",
  IN: "India",
  BR: "Brazil",
  NL: "Netherlands",
  ES: "Spain",
  IT: "Italy",
  SE: "Sweden",
  CH: "Switzerland",
  SG: "Singapore",
  BD: "Bangladesh",
  PK: "Pakistan",
  ID: "Indonesia",
  MX: "Mexico",
  RU: "Russia",
  CN: "China",
  KR: "South Korea",
  ZA: "South Africa",
  AE: "United Arab Emirates",
  TR: "Turkey",
  PL: "Poland",
};

const BOT_USER_AGENTS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /slackbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /discordbot/i,
  /googlebot/i,
  /bingbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /duckduckbot/i,
  /telegrambot/i,
  /applebot/i,
  /preview/i,
  /pingdom/i,
  /uptimerobot/i,
];

export function isBot(userAgent?: string): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

export function extractClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const list = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const clientIp = list.split(",")[0].trim();
    if (clientIp) return clientIp;
  }
  return req.ip || req.socket.remoteAddress || "127.0.0.1";
}

export function normalizeReferrer(rawReferrer?: string): string {
  if (!rawReferrer || !rawReferrer.trim()) {
    return "Direct";
  }

  try {
    const parsed = new URL(rawReferrer);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    // Friendly names for common social / search referrers
    if (host.includes("twitter.com") || host.includes("x.com") || host === "t.co") {
      return "Twitter / X";
    }
    if (host.includes("linkedin.com") || host === "lnkd.in") {
      return "LinkedIn";
    }
    if (host.includes("google.")) {
      return "Google Search";
    }
    if (host.includes("instagram.com")) {
      return "Instagram";
    }
    if (host.includes("facebook.com") || host === "fb.me") {
      return "Facebook";
    }
    if (host.includes("youtube.com") || host === "youtu.be") {
      return "YouTube";
    }
    if (host.includes("github.com")) {
      return "GitHub";
    }
    if (host.includes("reddit.com")) {
      return "Reddit";
    }

    return host;
  } catch {
    return rawReferrer.trim().slice(0, 100);
  }
}

export function parseDeviceAndBrowser(userAgent?: string): {
  device: string;
  browser: string;
} {
  if (!userAgent) {
    return { device: "Desktop", browser: "Unknown" };
  }

  const parser = new UAParser(userAgent);
  const browserName = parser.getBrowser().name || "Unknown";
  const deviceType = parser.getDevice().type; // 'mobile', 'tablet', undefined for desktop

  let device: string;
  if (deviceType === "mobile") {
    device = browserName !== "Unknown" ? `Mobile (${browserName})` : "Mobile";
  } else if (deviceType === "tablet") {
    device = "Tablet";
  } else {
    device = browserName !== "Unknown" ? `Desktop (${browserName})` : "Desktop";
  }

  return {
    device,
    browser: browserName,
  };
}

export function parseGeoLocation(
  ip: string,
  reqHeaders?: Record<string, string | string[] | undefined>
): {
  country: string;
  city: string;
} {
  // 1. If deployed behind Cloudflare or similar reverse proxy, use their geo headers directly
  const cfCountry = reqHeaders?.["cf-ipcountry"];
  if (cfCountry && typeof cfCountry === "string" && cfCountry.length === 2 && cfCountry !== "XX" && cfCountry !== "T1") {
    const code = cfCountry.toUpperCase();
    const countryName = ISO_COUNTRY_NAMES[code] || code;
    return {
      country: countryName,
      city: "Unknown",
    };
  }

  // 2. Normalize loopback / private IPv4 for local testing (fallback to 8.8.8.8)
  const isLoopback = ip === "::1" || ip === "127.0.0.1" || ip === "localhost";
  const normalizedIp = isLoopback ? "8.8.8.8" : ip;
  const geo = geoip.lookup(normalizedIp);

  if (!geo) {
    return {
      country: "Unknown",
      city: "Unknown",
    };
  }

  const countryName = ISO_COUNTRY_NAMES[geo.country] || geo.country || "Unknown";
  const cityName = geo.city || "Unknown";

  return {
    country: countryName,
    city: cityName,
  };
}
