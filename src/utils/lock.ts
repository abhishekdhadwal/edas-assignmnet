/**
 * @file lock.ts
 * @description Distributed locking utility using Redis SET NX.
 * Prevents race conditions in concurrent environments.
 */

import redisClient from '../config/redis.js';
import logger from './logger.js';

/**
 * Acquires a distributed lock for a specific resource.
 * @param resource - The unique identifier for the resource (e.g., task:uuid)
 * @param ttlMs - Time to live in milliseconds (default 5000ms)
 * @returns boolean - True if lock acquired, false otherwise
 */
export const acquireLock = async (resource: string, ttlMs: number = 5000): Promise<boolean> => {
  const lockKey = `lock:${resource}`;

  // SET key value [NX|XX] [GET] [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL]
  // 'NX' ensures we only set if it doesn't exist
  // 'PX' sets the expiry in milliseconds
  const result = await redisClient.set(lockKey, 'locked', 'PX', ttlMs, 'NX');

  const acquired = result === 'OK';
  if (acquired) {
    logger.debug(`Lock acquired for ${resource}`);
  } else {
    logger.warn(`Failed to acquire lock for ${resource} - Resource is busy`);
  }

  return acquired;
};

/**
 * Releases a distributed lock.
 * @param resource - The unique identifier for the resource
 */
export const releaseLock = async (resource: string): Promise<void> => {
  const lockKey = `lock:${resource}`;
  await redisClient.del(lockKey);
  logger.debug(`Lock released for ${resource}`);
};

/**
 * Execute a function with a distributed lock.
 * Automatically releases the lock after execution.
 */
export const withLock = async <T>(
  resource: string,
  fn: () => Promise<T>,
  ttlMs: number = 5000,
): Promise<T> => {
  const acquired = await acquireLock(resource, ttlMs);

  if (!acquired) {
    throw new Error(
      `Resource ${resource} is currently being modified by another process. Please try again.`,
    );
  }

  try {
    return await fn();
  } finally {
    await releaseLock(resource);
  }
};
