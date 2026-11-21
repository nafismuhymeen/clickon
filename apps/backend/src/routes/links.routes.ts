import { Router } from "express";
import { LinksController } from "../controllers/links.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { linksLimiter } from "../middleware/rateLimiter.js";

export const linksRouter = Router();

linksRouter.use(requireAuth);
linksRouter.use(linksLimiter);

linksRouter.post("/", asyncHandler(LinksController.create));
linksRouter.get("/", asyncHandler(LinksController.list));
linksRouter.get("/:id", asyncHandler(LinksController.getById));
linksRouter.patch("/:id", asyncHandler(LinksController.update));
linksRouter.delete("/:id", asyncHandler(LinksController.delete));
linksRouter.get("/:id/analytics", asyncHandler(LinksController.getAnalytics));
linksRouter.post("/:id/export-csv", asyncHandler(LinksController.exportCSV));

