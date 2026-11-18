import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator.js";
import { sendSuccess } from "../utils/response.js";
import type { UserRole } from "../types/index.js";

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const parsed = registerSchema.parse(req.body);
    const result = await AuthService.register(
      parsed.email,
      parsed.password,
      parsed.role as UserRole
    );
    return sendSuccess(res, result, 201);
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const parsed = loginSchema.parse(req.body);
    const result = await AuthService.login(parsed.email, parsed.password);
    return sendSuccess(res, result, 200);
  }

  static async refresh(req: Request, res: Response): Promise<Response> {
    const parsed = refreshTokenSchema.parse(req.body);
    const result = await AuthService.refresh(parsed.refreshToken);
    return sendSuccess(res, result, 200);
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.body?.refreshToken as string | undefined;
    const userId = req.user?.id;
    await AuthService.logout(refreshToken, userId);
    return sendSuccess(res, { message: "Logged out successfully" }, 200);
  }

  static async getMe(req: Request, res: Response): Promise<Response> {
    const user = await AuthService.getMe(req.user!.id);
    return sendSuccess(res, user, 200);
  }
}

