import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendResponse } from '../utils/response.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

export class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - name
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.register(req.body);
      return sendResponse(res, HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user and get token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Unauthorized
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.login(req.body);
      return sendResponse(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, data);
    } catch (error) {
      next(error);
    }
  }
}
