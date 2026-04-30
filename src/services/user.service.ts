/**
 * @file user.service.ts
 * @description Business logic for User account management, registration, and login.
 */

import { UserRepository } from '../repositories/index.js';
import { User } from '../entities/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { AppError } from '../middleware/error.middleware.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import eventEmitter, { EVENTS } from '../utils/events.js';

export class UserService {
  /**
   * Registers a new user in the system.
   * @param userData - Partial user object containing email, password, and name
   * @returns The registered user object (without password)
   */
  static async register(userData: Partial<User>) {
    const { email, password, name } = userData;

    // 1. Check if user already exists
    const existingUser = await UserRepository.findOneBy({ email: email! });
    if (existingUser) {
      throw new AppError(MESSAGES.AUTH.USER_EXISTS, HTTP_STATUS.BAD_REQUEST);
    }

    // 2. Hash the password for security
    const hashedPassword = await hashPassword(password!);

    // 3. Create and save the user
    const user = UserRepository.create({
      email: email!,
      name: name!,
      password: hashedPassword,
    });

    const savedUser = await UserRepository.save(user);
    logger.info(`User registered: ${savedUser.email}`);

    // Emit registration event for decoupled side effects
    eventEmitter.emit(EVENTS.USER.REGISTERED, { userId: savedUser.id, email: savedUser.email });

    // 4. Return user data without the password
    const { password: _, ...result } = savedUser;
    return result;
  }

  /**
   * Authenticates a user and generates a JWT token.
   * @param credentials - User email and password
   * @returns Object containing user info and access token
   */
  static async login(credentials: any) {
    const { email, password } = credentials;

    // 1. Find user by email (explicitly selecting password field)
    const user = await UserRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });

    // 2. Validate user existence and password
    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // 3. Generate JWT access token
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    // 4. Return user info and token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
