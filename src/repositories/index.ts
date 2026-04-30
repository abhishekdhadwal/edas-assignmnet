/**
 * @file index.ts
 * @description Centralized repository exports for the application.
 */

import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';

export const UserRepository = AppDataSource.getRepository(User);
