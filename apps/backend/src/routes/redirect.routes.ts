import { Router } from "express";
import { RedirectController } from "../controllers/redirect.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { redirectLimiter } from "../middleware/rateLimiter.js";

export const redirectRouter = Router();

redirectRouter.get("/:code", redirectLimiter, asyncHandler(RedirectController.handleRedirect));

