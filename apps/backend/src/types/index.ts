export type UserRole = "FREE" | "PRO";

export interface User {
  id: number;
  email: string;
  role: UserRole;
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
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ClickNewEvent {
  linkId: number;
  country: string;
  device: string;
  timestamp: string;
  totalClicks: number;
}

// Augment Express Request type to include authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
