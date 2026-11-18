import type { Request, Response } from "express";
import { RedirectService } from "../services/redirect.service.js";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export class RedirectController {
  static async handleRedirect(req: Request, res: Response): Promise<void> {
    const code = req.params.code?.trim();

    if (!code) {
      res.redirect(302, `${env.FRONTEND_URL}/404`);
      return;
    }

    const result = await RedirectService.resolveCode(code);

    if (result.status === "NOT_FOUND") {
      const acceptsHtml = req.accepts(["html", "json"]) === "html";
      if (acceptsHtml) {
        res.redirect(302, `${env.FRONTEND_URL}/404`);
        return;
      }
      sendError(res, "NOT_FOUND", "Short link not found", 404);
      return;
    }

    if (result.status === "GONE") {
      res.status(410).json({
        success: false,
        error: {
          code: "GONE",
          message: "This short link has expired or has been deactivated",
        },
      });
      return;
    }

    const { link } = result;

    // Send 302 HTTP redirection first
    res.redirect(302, link!.originalUrl);

    // Asynchronously log click event and emit real-time socket
    RedirectService.recordClickAsync(link!.id, req);
  }
}

