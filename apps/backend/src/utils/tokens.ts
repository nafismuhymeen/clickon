import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import type { User, UserRole } from "../types/index.js";
import { AppError } from "./errors.js";

interface AccessTokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

interface RefreshTokenPayload {
  userId: number;
}

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateAccessToken(user: User): string {
  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(userId: number): string {
  const payload = {
    userId,
    jti: crypto.randomUUID(),
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): User {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw AppError.unauthorized("Invalid or expired access token", "INVALID_TOKEN");
  }
}

export function verifyRefreshToken(token: string): { userId: number } {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return {
      userId: decoded.userId,
    };
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token", "INVALID_REFRESH_TOKEN");
  }
}

// Constant-time dummy hash comparison for user enumeration defense
export async function dummyPasswordCheck(password: string): Promise<void> {
  // A precomputed dummy bcrypt hash (cost 12)
  const dummyHash = "$2a$12$e80yvYp9L0p/N3U3E5i9yObQh7k17Hw05h1sB26c36v4G4R9X0/W6";
  await bcrypt.compare(password, dummyHash);
}
