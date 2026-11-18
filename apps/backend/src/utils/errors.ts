export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, code = "BAD_REQUEST") {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new AppError(message, 401, code);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new AppError(message, 403, code);
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new AppError(message, 404, code);
  }

  static conflict(message: string, code = "CONFLICT") {
    return new AppError(message, 409, code);
  }

  static gone(message = "Link has expired or is inactive", code = "GONE") {
    return new AppError(message, 410, code);
  }

  static unprocessable(message: string, code = "UNPROCESSABLE_ENTITY") {
    return new AppError(message, 422, code);
  }

  static tooManyRequests(message = "Too many requests, please try again later", code = "TOO_MANY_REQUESTS") {
    return new AppError(message, 429, code);
  }

  static internal(message = "An unexpected error occurred", code = "INTERNAL_SERVER_ERROR") {
    return new AppError(message, 500, code);
  }
}

