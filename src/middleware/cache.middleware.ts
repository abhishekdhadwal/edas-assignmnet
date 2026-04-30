/**
 * @file cache.middleware.ts
 * @description Structured Redis-based response caching for high-performance API endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.js';
import logger from '../utils/logger.js';

interface CacheOptions {
  ttl: number;
  resource: string;
  idParam?: string;
}

/**
 * Middleware to cache GET responses in Redis.
 * Uses a structured key format: cache:userId:resource:resourceId:queryParams
 *
 * @param options - Cache configuration (TTL, resource name, and optional ID parameter name)
 */
export const cacheMiddleware = (options: CacheOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const userId = (req as any).user?.id || 'guest';
    const { ttl, resource, idParam } = options;

    // 2. Identify the specific resource ID (e.g., projectId) from the request params
    const resourceId = idParam ? req.params[idParam] : 'all';

    // 3. Include query parameters to ensure pagination/filtering are cached correctly
    const queryKey = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : 'default';

    // 4. Generate the structured key
    const key = `cache:${userId}:${resource}:${resourceId}:${queryKey}`;

    try {
      // 5. Check if data exists in Redis
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        logger.debug(`Cache hit for ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      // 6. Intercept the response to save it
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redisClient.setex(key, ttl, JSON.stringify(body)).catch((err) => {
          logger.error(err, 'Redis cache set error');
        });
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error(error, 'Cache middleware error');
      next();
    }
  };
};

/**
 * Utility to clear structured cache keys for a specific user and resource.
 *
 * @param userId - ID of the user
 * @param resource - Resource name (e.g., 'projects', 'tasks')
 * @param resourceId - Optional ID to narrow down (e.g., clear only tasks for one project)
 */
export const clearUserCache = async (userId: string, resource: string, resourceId?: string) => {
  try {
    // Generate pattern: cache:userId:resource:resourceId:*
    const pattern = `cache:${userId}:${resource}:${resourceId || '*'}:*`;
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.debug(`Cleared ${keys.length} cache keys for ${pattern}`);
    }
  } catch (error) {
    logger.error(error, 'Error clearing user cache');
  }
};
