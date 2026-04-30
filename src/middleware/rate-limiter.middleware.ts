/**
 * @file rate-limiter.middleware.ts
 * @description Redis-based sliding window rate limiter to prevent API abuse.
 */

import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.js';
import { AppError } from './error.middleware.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

/**
 * Middleware to restrict the number of requests a single IP can make.
 * @param limit - Maximum number of requests allowed within the window
 * @param windowSeconds - The time window in seconds
 */
export const rateLimiter = (limit: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;

    try {
      // 1. Get current request count for this IP
      const current = await redisClient.get(key);
      const count = current ? parseInt(current) : 0;

      // 2. Check if limit exceeded
      if (count >= limit) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        return next(new AppError(MESSAGES.COMMON.RATE_LIMIT, HTTP_STATUS.TOO_MANY_REQUESTS));
      }

      // 3. Increment count and reset expiry using a Redis Transaction (Atomic)
      await redisClient.multi().incr(key).expire(key, windowSeconds).exec();

      next();
    } catch (error) {
      // Corrected Pino logging order: (Error object first, then Message)
      logger.error(error, 'Rate limiter error');

      // Fail-safe: If Redis is down, we allow the request to proceed (Fail Open)
      next();
    }
  };
};
