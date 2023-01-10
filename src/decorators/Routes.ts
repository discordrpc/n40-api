import { RequestHandler } from 'express';
import { RouteController } from '../controllers';

/**
 * A TypeScript decorator that defines a new endpoint for
 * an Express application.
 *
 * @param data The route data to use for initialization
 */
export function Route(data: RouteData | string): any {
  if (!data) throw new Error('Missing route data');

  return (target: any, _: string, descriptor: PropertyDescriptor) => {
    if (typeof data === 'string') {
      data = { path: data, methods: 'ALL', handler: descriptor.value };
    }

    RouteController.addRoute(data.path, data.methods, descriptor.value);
  };
}

/**
 * A TypeScript decorator that defines a new GET endpoint for
 * an Express application.
 *
 * @param path the endpoint's url
 */
export function Get(path: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    RouteController.addRoute(path, 'GET', descriptor.value);
  };
}

/**
 * A TypeScript decorator that defines a new POST endpoint for
 * an Express application.
 *
 * @param path the endpoint's url
 */
export function Post(path: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    RouteController.addRoute(path, 'POST', descriptor.value);
  };
}

interface RouteData {
  path: string;
  methods: string[] | string;
  handler: RequestHandler;
}
