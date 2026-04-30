/**
 * @file cache.handler.ts
 * @description Event listeners for automated cache invalidation.
 */

import eventEmitter, { EVENTS } from '../utils/events.js';
import { clearUserCache } from '../middleware/cache.middleware.js';
import logger from '../utils/logger.js';

export const setupCacheHandlers = () => {
  // Example: User Cache Invalidation
  eventEmitter.on(EVENTS.USER.UPDATED, async ({ userId }) => {
    logger.debug(`Event: ${EVENTS.USER.UPDATED} - Clearing cache for user ${userId}`);
    await clearUserCache(userId, 'profile', 'me');
  });
};
