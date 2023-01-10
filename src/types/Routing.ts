import { RequestHandler } from 'express';

/**
 * Interface used by the Route decorator when
 * defining a route.
 */
export interface RouteData {
  path: string;
  methods: string[] | string;
  handler: RequestHandler;
}

/**
 * Interface used by the Middleware decorator when
 * defining middleware.
 */
export interface MiddlewareData {
  path: string;
  methods: string[] | string;
  priority: number;
  handler: RequestHandler;
}
