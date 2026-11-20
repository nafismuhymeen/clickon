import type { Response } from "express";
import type { ApiResponse, PaginatedResponse, ApiError } from "../types/index.js";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(payload);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number; totalClicks?: number },
  statusCode = 200
): Response {
  const payload: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 500
): Response {
  const payload: ApiError = {
    success: false,
    error: {
      code,
      message,
    },
  };
  return res.status(statusCode).json(payload);
}

