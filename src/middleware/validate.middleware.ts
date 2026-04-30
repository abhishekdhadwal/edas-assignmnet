import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './error.middleware.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Validates a request against a Zod schema and overwrites req objects.
 * Uses z.AnyZodObject to allow flexible schemas (only body, only query, etc.)
 * while maintaining type safety for the transformation.
 */
export const validateRequest = <T extends z.ZodObject<any>>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request data
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Type assertion to a partial structure to safely access potentially missing fields
      const { body, query, params } = parsed as {
        body?: any;
        query?: any;
        params?: any;
      };

      // Only overwrite if the schema actually validated that field
      if (body) req.body = body;

      if (query) {
        Object.defineProperty(req, 'query', {
          value: query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      if (params) {
        Object.defineProperty(req, 'params', {
          value: params,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        return next(new AppError(message, HTTP_STATUS.BAD_REQUEST));
      }
      next(error);
    }
  };
};
