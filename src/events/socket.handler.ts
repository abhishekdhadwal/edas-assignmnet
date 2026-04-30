/**
 * @file socket.handler.ts
 * @description Event listeners for real-time socket notifications.
 */

import { Server } from 'socket.io';
import eventEmitter, { EVENTS } from '../utils/events.js';
import logger from '../utils/logger.js';

export const setupSocketHandlers = (io: Server) => {
  // Example: User Registered Notification
  eventEmitter.on(EVENTS.USER.REGISTERED, ({ userId, email }) => {
    logger.debug(`Event: ${EVENTS.USER.REGISTERED} - Broadcasting to user ${userId}`);
    // Broadcast to the specific user if they are connected
    io.to(`user:${userId}`).emit('welcome', {
      message: 'Welcome to the platform!',
      email,
    });
  });
};
