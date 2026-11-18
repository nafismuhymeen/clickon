import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/tokens.js";
import type { UserRole } from "../types/index.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError.unauthorized("Authentication required", "AUTH_REQUIRED");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw AppError.unauthorized("Authentication token missing", "TOKEN_MISSING");
  }

  const user = verifyAccessToken(token);
  req.user = user;
  next();
}

export function requireRole(requiredRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required", "AUTH_REQUIRED");
    }

    if (req.user.role !== requiredRole) {
      throw AppError.forbidden(
        `Feature requires ${requiredRole} subscription plan`,
        "UPGRADE_REQUIRED"
      );
    }

    next();
  };
}

