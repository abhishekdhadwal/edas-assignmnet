import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger.js';
import redisClient from '../config/redis.js';
import { CACHE_TTL } from '../config/constants.js';

export const setupSockets = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      logger.warn('Socket connection attempt without userId');
      socket.disconnect();
      return;
    }

    logger.info(`User connected to socket: ${userId}`);

    // Base Setup: Join user-specific room for targeted notifications
    socket.join(`user:${userId}`);

    // Store socket ID in Redis for real-time state storage
    await redisClient.set(`socket:${userId}`, socket.id, 'EX', CACHE_TTL.SOCKET_SESSION);

    socket.on('disconnect', async () => {
      logger.info(`User disconnected from socket: ${userId}`);
      await redisClient.del(`socket:${userId}`);
    });
  });

  return io;
};
