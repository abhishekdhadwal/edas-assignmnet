/**
 * @file server.ts
 * @description Entry point for the Real-Time Task Management System.
 * Handles database initialization, server startup, and graceful shutdown.
 */

import 'reflect-metadata';
import http from 'http';
import app from './app.js';
import { AppDataSource } from './config/database.js';
import { getConfig } from './config/env.validator.js';
import logger from './utils/logger.js';
import { setupSockets } from './sockets/socket.manager.js';
import { setupCacheHandlers } from './events/cache.handler.js';
import { setupSocketHandlers } from './events/socket.handler.js';
import redisClient from './config/redis.js';

const config = getConfig();

/**
 * Initializes and starts the HTTP server.
 */
async function startServer() {
  try {
    // 1. Initialize Database Connection
    await AppDataSource.initialize();
    logger.info('Database initialized');

    // 2. Setup HTTP Server
    const httpServer = http.createServer(app);

    // 3. Initialize Socket.IO Manager
    const io = setupSockets(httpServer);
    app.set('io', io); // Make io accessible in controllers via req.app.get('io')

    // 4. Initialize Event Handlers (EDA)
    setupCacheHandlers();
    setupSocketHandlers(io);

    // 5. Start Listening
    const server = httpServer.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
      logger.info(`Swagger docs: http://localhost:${config.PORT}/api/v1/docs`);
    });

    /**
     * Graceful Shutdown Handler
     * Ensures all connections are closed properly before the process exits.
     */
    let isShuttingDown = false;
    const shutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info(`Received ${signal}. Shutting down server...`);

      // Force exit after 3 seconds if graceful shutdown fails
      const timeout = setTimeout(() => {
        logger.warn('Graceful shutdown timed out, forcing exit');
        process.exit(1);
      }, 3000);

      try {
        server.close(async () => {
          logger.info('HTTP server closed');

          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            logger.info('Database connection closed');
          }

          // Close Redis connection
          await redisClient.quit();
          logger.info('Redis connection closed');

          clearTimeout(timeout);
          process.exit(0);
        });
      } catch (error) {
        logger.error(error, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
