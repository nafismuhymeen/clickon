import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  User,
  Link,
  CreateLinkPayload,
  UpdateLinkPayload,
  Analytics,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const TOKEN_STORAGE_KEY = 'clickon_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'clickon_refresh_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setStoredTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

// Request Interceptor: Attach Bearer Access Token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Auto Refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/register') &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        clearStoredTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post<ApiResponse<RefreshResponse>>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        setStoredTokens(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearStoredTokens();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract clean error message
export function getApiErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) {
      return data.error.message;
    }
    if (data?.message) {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

// ---- API Methods ----

export const authApi = {
  async register(payload: { email: string; password: string; role?: 'FREE' | 'PRO' }): Promise<RegisterResponse> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>('/api/auth/register', payload);
    return res.data.data;
  },

  async login(payload: { email: string; password: string }): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', payload);
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/api/auth/me');
    return res.data.data;
  },

  async logout(): Promise<void> {
    const refreshToken = getStoredRefreshToken();
    try {
      await apiClient.post('/api/auth/logout', { refreshToken });
    } finally {
      clearStoredTokens();
    }
  },
};

export const linksApi = {
  async list(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Link>> {
    const res = await apiClient.get<PaginatedResponse<Link>>('/api/links', { params });
    return res.data;
  },

  async get(id: number): Promise<Link> {
    const res = await apiClient.get<ApiResponse<Link>>(`/api/links/${id}`);
    return res.data.data;
  },

  async create(payload: CreateLinkPayload): Promise<Link> {
    const res = await apiClient.post<ApiResponse<Link>>('/api/links', payload);
    return res.data.data;
  },

  async update(id: number, payload: UpdateLinkPayload): Promise<Link> {
    const res = await apiClient.patch<ApiResponse<Link>>(`/api/links/${id}`, payload);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/links/${id}`);
  },

  async getAnalytics(id: number): Promise<Analytics> {
    const res = await apiClient.get<ApiResponse<Analytics>>(`/api/links/${id}/analytics`);
    return res.data.data;
  },
};

export const contactApi = {
  async submit(payload: {
    name: string;
    email: string;
    topic: string;
    message: string;
    honeypot?: string;
  }): Promise<{ message: string }> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/api/contact', payload);
    return res.data.data;
  },
};
