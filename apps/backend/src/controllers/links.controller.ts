import type { Request, Response } from "express";
import { LinksService } from "../services/links.service.js";
import { AnalyticsService } from "../services/analytics.service.js";
import {
  createLinkSchema,
  updateLinkSchema,
  listLinksQuerySchema,
} from "../validators/links.validator.js";
import { sendSuccess, sendPaginated } from "../utils/response.js";

export class LinksController {
  static async create(req: Request, res: Response): Promise<Response> {
    const parsed = createLinkSchema.parse(req.body);
    const link = await LinksService.createLink(req.user!, parsed);
    return sendSuccess(res, link, 201);
  }

  static async list(req: Request, res: Response): Promise<Response> {
    const query = listLinksQuerySchema.parse(req.query);
    const result = await LinksService.listUserLinks(req.user!.id, query);
    return sendPaginated(
      res,
      result.links,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      200
    );
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    const linkId = Number(req.params.id);
    const link = await LinksService.getLinkById(req.user!.id, linkId);
    return sendSuccess(res, link, 200);
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const linkId = Number(req.params.id);
    const parsed = updateLinkSchema.parse(req.body);
    const updated = await LinksService.updateLink(req.user!.id, linkId, parsed);
    return sendSuccess(res, updated, 200);
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const linkId = Number(req.params.id);
    await LinksService.deleteLink(req.user!.id, linkId);
    return sendSuccess(res, { message: "Link deleted successfully" }, 200);
  }

  static async getAnalytics(req: Request, res: Response): Promise<Response> {
    const linkId = Number(req.params.id);
    const analytics = await AnalyticsService.getLinkAnalytics(req.user!.id, linkId);
    return sendSuccess(res, analytics, 200);
  }
}

