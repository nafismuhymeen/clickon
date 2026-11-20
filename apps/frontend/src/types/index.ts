// ============================================================
// ClickOn — Shared TypeScript Interfaces
// ============================================================

// ---- Auth ----

export interface User {
  id: number;
  email: string;
  role: 'FREE' | 'PRO';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type RegisterResponse = LoginResponse;

export interface RefreshResponse {
  accessToken: string;
}

// ---- Links ----

export interface Link {
  id: number;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  customSlug?: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
  totalClicks?: number;
}

export interface CreateLinkPayload {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: string;
}

export interface UpdateLinkPayload {
  originalUrl?: string;
  isActive?: boolean;
  expiresAt?: string | null;
}

// ---- Analytics ----

export interface Analytics {
  linkId: number;
  totalClicks: number;
  uniqueCountries: number;
  clicksToday: number;
  clicksThisWeek: number;
  topCountries: { country: string; count: number }[];
  topDevices: { device: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  clicksByDay: { date: string; count: number }[];
}

// ---- API Response Wrappers ----

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalClicks?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// ---- Socket Events ----

export interface ClickNewEvent {
  linkId: number;
  country: string;
  device: string;
  timestamp: string;
  totalClicks: number;
}
