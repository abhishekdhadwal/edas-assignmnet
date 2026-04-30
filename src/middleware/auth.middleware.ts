/**
 * @file auth.middleware.ts
 * @description JWT Authentication middleware to protect private routes.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config/env.validator.js';
import { AppError } from './error.middleware.js';
import { HTTP_STATUS } from '../config/constants.js';

const config = getConfig();

/**
 * Middleware to verify JWT tokens from the Authorization header.
 * Expects format: "Bearer <token>"
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header is present and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // 3. Attach decoded user info to the request object for use in controllers
    (req as any).user = decoded;

    next();
  } catch (error) {
    // 4. Return unauthorized error if token is invalid or expired
    return next(new AppError('Unauthorized: Invalid or expired token', HTTP_STATUS.UNAUTHORIZED));
  }
};
