/**
 * @file app.ts
 * @description Main Express application setup.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rate-limiter.middleware.js';
import { RATE_LIMIT, API_PREFIX } from './config/constants.js';
import swaggerSpec from './config/swagger.js';
import { getConfig } from './config/env.validator.js';
import apiRoutes from './routes/index.js';

const app = express();
const config = getConfig();

/**
 * Global Middleware
 */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * Swagger Documentation (Protected by Basic Auth)
 */
const swaggerAuth = basicAuth({
  users: { [config.SWAGGER_USER]: config.SWAGGER_PASSWORD },
  challenge: true,
});
app.use(`${API_PREFIX}/docs`, swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes
 * Modular routing handled in src/routes/index.ts
 */
app.use(API_PREFIX, rateLimiter(RATE_LIMIT.MAX_REQUESTS, RATE_LIMIT.WINDOW_MS), apiRoutes);

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;
