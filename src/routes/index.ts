/**
 * @file index.ts
 * @description Master router that combines all application route modules.
 */

import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

/**
 * Combine module routes
 */
router.use('/auth', authRoutes);

/**
 * Health Check Route
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
