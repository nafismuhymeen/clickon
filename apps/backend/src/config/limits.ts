/**
 * Application limits, feature gates, and shared constants.
 * Inferred from the ClickOn frontend application contracts and pricing/terms specs.
 */

// ---- Feature Gates ----
export const FREE_ALLOW_CUSTOM_SLUG = false;
export const PRO_ALLOW_CUSTOM_SLUG = true;

export const FREE_MAX_ACTIVE_LINKS = 50;
export const PRO_MAX_ACTIVE_LINKS = Infinity;

export const FREE_LINK_CREATIONS_PER_HOUR = 100;
export const PRO_LINK_CREATIONS_PER_HOUR = 10000;

// ---- Slug Constraints ----
export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 32;
export const CUSTOM_SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/;

// Reserved path segments and shortcodes that cannot be used as custom slugs
export const RESERVED_SLUGS = new Set([
  "api",
  "r",
  "health",
  "admin",
  "login",
  "register",
  "dashboard",
  "analytics",
  "contact",
  "docs",
  "terms",
  "about",
  "settings",
  "logout",
  "404",
  "favicon",
  "robots.txt",
  "sitemap.xml",
  "static",
  "assets",
  "public",
]);

// ---- Real-Time Socket Events ----
// Socket event emitted on recorded click, matching frontend ClickNewEvent
export const SOCKET_EVENT_CLICK_NEW = "click:new";

// ---- Analytics Formatting ----
// 3-letter weekday labels matching frontend chart format (INITIAL_ANALYTICS & ClicksChart)
export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

// Number of days to include in the clicksByDay trend chart
export const ANALYTICS_DAYS_COUNT = 7;

// Top items limit for analytics breakdowns
export const ANALYTICS_TOP_LIMIT = 5;

// ---- Contact Form Topics ----
export const CONTACT_TOPICS = [
  "general",
  "support",
  "enterprise",
  "abuse",
  "partnership",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

