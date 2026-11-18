import { db } from "../db/index.js";
import { users, refreshTokens } from "../db/schema/index.js";
import { eq, and } from "drizzle-orm";
import {
  hashPassword,
  comparePassword,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  dummyPasswordCheck,
} from "../utils/tokens.js";
import { AppError } from "../utils/errors.js";
import type { User, LoginResponse, RefreshResponse, UserRole } from "../types/index.js";

export class AuthService {
  static async register(
    email: string,
    password: string,
    role: UserRole = "FREE"
  ): Promise<LoginResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      throw AppError.conflict("User with this email already exists", "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash,
        role,
      })
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
      });

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role as UserRole,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);
    const hashedRefreshToken = hashToken(refreshToken);

    // Default 7 days expiration for refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!foundUser) {
      // Prevent user enumeration timing attack
      await dummyPasswordCheck(password);
      throw AppError.unauthorized("Invalid credentials", "INVALID_CREDENTIALS");
    }

    const isMatch = await comparePassword(password, foundUser.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized("Invalid credentials", "INVALID_CREDENTIALS");
    }

    const user: User = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role as UserRole,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);
    const hashedRefreshToken = hashToken(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  static async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { userId } = verifyRefreshToken(refreshToken);
    const hashed = hashToken(refreshToken);

    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, hashed), eq(refreshTokens.userId, userId)))
      .limit(1);

    if (!tokenRecord) {
      throw AppError.unauthorized("Invalid or revoked refresh token", "INVALID_REFRESH_TOKEN");
    }

    if (new Date(tokenRecord.expiresAt).getTime() <= Date.now()) {
      // Clean up expired token
      await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenRecord.id));
      throw AppError.unauthorized("Refresh token has expired", "EXPIRED_REFRESH_TOKEN");
    }

    const [userRecord] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord) {
      throw AppError.unauthorized("User account no longer exists", "USER_NOT_FOUND");
    }

    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role as UserRole,
    };

    const newAccessToken = generateAccessToken(user);

    return {
      accessToken: newAccessToken,
    };
  }

  static async logout(refreshToken?: string, userId?: number): Promise<void> {
    if (refreshToken) {
      const hashed = hashToken(refreshToken);
      await db.delete(refreshTokens).where(eq(refreshTokens.token, hashed));
    } else if (userId) {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
  }

  static async getMe(userId: number): Promise<User> {
    const [userRecord] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role as UserRole,
    };
  }
}

