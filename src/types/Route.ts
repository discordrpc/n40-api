import { RequestHandler } from 'express';

export default class Route {

  // Handler functions
  private _handlers: Map<string, RequestHandler>;

  // Middleware functions
  private _middleware: Map<string, RequestHandler[]>;

  constructor(methods: string[] | string, handler?: RequestHandler) {
    this._handlers = new Map();
    this._middleware = new Map();

    if (handler) this.addHandler(methods, handler);
  }

  /**
   * Adds a handler method to the current route for the given
   * HTTP methods.
   *
   * @param method the HTTP methods the route will respond to
   * @param handler the method used to respond
   */
  public addHandler(method: string[] | string, handler: RequestHandler): void {
    // Convert string to array
    if (typeof method === 'string') method = method.toUpperCase().split(' ');

    // Iterate over each HTTP method (m)
    method.forEach((m) => {
      // Add the route handler for the current HTTP method
      this.handlers.set(m, handler);
    });
  }

  /**
   * Adds middleware to the current route for the given
   * HTTP methods.
   *
   * @param method the HTTP methods to add middleware to
   * @param handler the middleware method
   * @param priority the priority of the middleware, lower numbers are executed first
   */
  public addMiddleware(method: string[] | string, priority: number, handler: RequestHandler): void {
    // Convert string to array
    if (typeof method === 'string') method = method.toUpperCase().split(' ');

    // Iterate over each HTTP method (m)
    method.forEach((m) => {
      let middleware = this.middleware.get(m);

      // If there is no middleware, create an empty array
      if (!middleware) middleware = [];

      // Insert the middleware method at the given priority
      middleware.splice(priority || 0, 0, handler);
      this.middleware.set(m, middleware);
    });
  }

  /**
   * @returns the handlers
   */
  public get handlers() {
    return this._handlers;
  }

  /**
   * @returns the middleware
   */
  public get middleware() {
    return this._middleware;
  }
}