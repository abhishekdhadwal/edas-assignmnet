/**
 * @file env.validator.ts
 * @description Centralized environment variable validation using Zod.
 * Ensures that the application fails fast if critical configuration is missing.
 */

import { z } from 'zod';
import * as dotenv from 'dotenv';

// 1. Load .env file manually at the start of validation to handle ESM hoisting
dotenv.config();

/**
 * Zod Schema for Environment Variables
 * Defines types and default values for all configuration.
 */
const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database Configuration
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432').transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  // Redis Configuration
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().default('6379').transform(Number),

  // Security
  JWT_SECRET: z.string(),

  // Swagger Documentation Credentials
  SWAGGER_USER: z.string(),
  SWAGGER_PASSWORD: z.string(),
});

/**
 * Validates and exports the configuration object.
 * @throws {Error} if validation fails
 */
export const getConfig = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('CRITICAL: Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  return result.data;
};

export type Config = z.infer<typeof envSchema>;
