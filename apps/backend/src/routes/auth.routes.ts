import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, asyncHandler(AuthController.register));
authRouter.post("/login", authLimiter, asyncHandler(AuthController.login));
authRouter.post("/refresh", asyncHandler(AuthController.refresh));
authRouter.post("/logout", requireAuth, asyncHandler(AuthController.logout));
authRouter.get("/me", requireAuth, asyncHandler(AuthController.getMe));

