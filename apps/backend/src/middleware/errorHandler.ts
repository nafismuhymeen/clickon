import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, "NOT_FOUND", `Cannot ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // If response headers are already sent, delegate to Express default
  if (res.headersSent) {
    return;
  }

  // AppError
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const message = firstIssue
      ? `${firstIssue.path.join(".") || "field"}: ${firstIssue.message}`
      : "Validation error";
    sendError(res, "VALIDATION_ERROR", message, 400);
    return;
  }

  // SyntaxError from invalid JSON body
  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, "BAD_REQUEST", "Malformed JSON body in request", 400);
    return;
  }

  // Generic or unexpected error
  console.error("Unhandled Server Error:", err);
  sendError(res, "INTERNAL_SERVER_ERROR", "Internal server error", 500);
}
