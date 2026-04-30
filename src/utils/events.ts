/**
 * @file events.ts
 * @description Centralized Event Emitter for the application.
 * Enables Event-Driven Architecture (EDA) to decouple side effects.
 */

import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}

const eventEmitter = new AppEventEmitter();

/**
 * Event Name Constants
 */
export const EVENTS = {
  USER: {
    REGISTERED: 'USER_REGISTERED',
    UPDATED: 'USER_UPDATED',
  },
} as const;

export default eventEmitter;
