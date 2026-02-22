import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  details: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: ApiError | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error?.statusCode || 500;
  const message = error?.message || "Internal Server Error";

  console.error({
    timestamp: new Date(),
    statusCode,
    message,
    path: req.path,
    method: req.method,
    error: error?.details || error,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { details: error?.details }),
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
