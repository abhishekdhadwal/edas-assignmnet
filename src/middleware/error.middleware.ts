/**
 * @file error.middleware.ts
 * @description Centralized error handling and standard error response structure.
 */

import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { sendResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Custom Error class to handle operational errors with status codes.
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Catches all errors from routes and returns a consistent JSON response.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.COMMON.INTERNAL_ERROR;

  // Log error with request context for debugging
  logger.error(err, `[${req.method}] ${req.url} - ${message}`);

  // Send standardized response format
  return sendResponse(res, statusCode, message);
};
