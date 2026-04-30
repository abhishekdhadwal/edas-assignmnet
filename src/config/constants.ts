export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
};

export const API_PREFIX = '/api/v1';

export const CACHE_TTL = {
  SOCKET_SESSION: 86400, // 24 hours
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists',
    REQUIRED_FIELDS: 'Name, email, and password are required',
    LOGIN_FIELDS: 'Email and password are required',
  },
  COMMON: {
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    RATE_LIMIT: 'Too many requests, please try again later',
  },
};
