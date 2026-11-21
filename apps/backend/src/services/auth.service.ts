import { db } from "../db/index.js";
import { users, refreshTokens } from "../db/schema/index.js";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { env } from "../config/env.js";
import { sendVerificationEmail } from "./mail.service.js";
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
  ): Promise<{ message: string; email: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id, isVerified: users.isVerified })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      throw AppError.conflict("User with this email already exists", "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(users).values({
      email: normalizedEmail,
      passwordHash,
      role,
      isVerified: false,
      verificationToken,
      verificationExpiresAt,
    });

    // Send verification email via configured SMTP / Resend
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail({
      to: normalizedEmail,
      verificationUrl,
    });

    return {
      message: "Registration successful. Please verify your email before logging in.",
      email: normalizedEmail,
    };
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token || !token.trim()) {
      throw AppError.badRequest("Verification token is required", "INVALID_TOKEN");
    }

    const trimmedToken = token.trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, trimmedToken))
      .limit(1);

    if (!user) {
      throw AppError.badRequest("Invalid or expired verification token", "INVALID_TOKEN");
    }

    if (user.verificationExpiresAt && new Date(user.verificationExpiresAt).getTime() < Date.now()) {
      throw AppError.badRequest("Verification token has expired. Please request a new one.", "TOKEN_EXPIRED");
    }

    await db
      .update(users)
      .set({
        isVerified: true,
      })
      .where(eq(users.id, user.id));

    return { message: "Email successfully verified! You can now sign in." };
  }

  static async resendVerification(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      // Return success message to prevent user enumeration
      return { message: "If this email is registered, a verification link has been sent." };
    }

    if (user.isVerified) {
      return { message: "Email is already verified. You can sign in." };
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        verificationToken,
        verificationExpiresAt,
      })
      .where(eq(users.id, user.id));

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail({
      to: normalizedEmail,
      verificationUrl,
    });

    return { message: "Verification link sent to your email." };
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

    // Check email verification
    if (!foundUser.isVerified) {
      throw AppError.forbidden(
        "Please verify your email address before logging in. Check your inbox for the verification link.",
        "EMAIL_NOT_VERIFIED"
      );
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

