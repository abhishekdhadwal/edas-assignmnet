/**
 * @file response.ts
 * @description Standardizes the API response format across the entire application.
 */

import { Response } from 'express';

/**
 * Standard API Response Structure
 * Ensures all endpoints return data in the format: { success, message, data }
 *
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Descriptive message for the user/developer
 * @param data - Payload (optional)
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = {},
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};
