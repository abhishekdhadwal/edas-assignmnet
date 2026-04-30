/**
 * @file auth.routes.ts
 * @description Routes for user authentication.
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 */
router.post('/register', validateRequest(registerSchema), AuthController.register);

/**
 * @route POST /api/v1/auth/login
 */
router.post('/login', validateRequest(loginSchema), AuthController.login);

export default router;
