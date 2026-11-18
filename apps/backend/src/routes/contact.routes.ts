import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

export const contactRouter = Router();

contactRouter.post("/", contactLimiter, asyncHandler(ContactController.submit));

