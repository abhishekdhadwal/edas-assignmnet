/**
 * @file redis.ts
 * @description Redis client configuration using ioredis.
 * Handles connection management, error logging, and retry strategies.
 */

import { Redis } from 'ioredis';
import logger from '../utils/logger.js';
import { getConfig } from './env.validator.js';

const config = getConfig();

/**
 * Initialize Redis Client
 * Configured with a custom retry strategy for better resilience in production.
 */
const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  /**
   * Exponential backoff retry strategy
   * @param times - Number of reconnection attempts
   * @returns Delay in milliseconds before next attempt
   */
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000); // Max delay of 2 seconds
    return delay;
  },
});

// Event Listeners for connection monitoring
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (err) => logger.error(err, 'Redis error'));

export default redisClient;
