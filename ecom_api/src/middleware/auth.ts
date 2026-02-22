import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    const secret = process.env.SECRET_PRIVATE_KEY;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Secret key is not configured",
      });
    }

    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const secret = process.env.SECRET_PRIVATE_KEY;
      if (secret) {
        const decoded = jwt.verify(token, secret) as {
          id: number;
          email: string;
        };
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // Silently fail - user will be treated as unauthenticated
    next();
  }
};
