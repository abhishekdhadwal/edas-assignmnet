/**
 * @file database.ts
 * @description TypeORM Data Source configuration for PostgreSQL.
 * Manages connections, entity mapping, and migration registration.
 */

import { DataSource } from 'typeorm';
import { getConfig } from './env.validator.js';

const config = getConfig();

/**
 * Central Database Configuration
 * Note: 'synchronize' is set to false to ensure all schema changes are handled via migrations.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,

  // Security/Stability: Manual migrations only
  synchronize: false,
  logging: false,

  // Entity and Migration pathing for ESM compatibility
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],

  // Connection Pool Settings
  extra: {
    max: 10, // Maximum number of connections in the pool
    connectionTimeoutMillis: 2000,
  },
});
