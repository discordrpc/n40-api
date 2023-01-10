import { RequestHandler } from 'express';
import app from '../app';
import { Route } from '../types';

/**
 * Represents the controller used to assemble and deploy
 * {@link Express.Application} routes.
 */
export default class RouteController {
  /**
   * A map of route URLs to {@link Route}s.
   */
  private static routes: Map<string, Route> = new Map();

  /**
   * Creates a new {@link Route} using the given arguments.
   * If a route with the given path already exists, the
   * existing route is updated with the new HTTP
   * method(s) and corresponding handler.
   *
   * @param {string} path - The URL of the route
   * @param {string[] | string} methods - The HTTP methods the given handler
   *                                      should respond to
   * @param handler - The handler function used to respond to requests
   */
  public static addRoute(
    path: string,
    methods: string[] | string,
    handler?: RequestHandler
  ) {
    if (this.routes.has(path))
      this.routes.get(path).addHandler(methods, handler);
    else this.routes.set(path, new Route(methods, handler));
  }

  /**
   * Attempts to add middleware to a given {@link Route}.
   * If the route does not exist, it is created with no
   * request handlers and the middleware is then added
   * to this "empty" route.
   *
   * @param {string} path - The URL of the route
   * @param {string[] | string} methods - The HTTP methods the given middleware
   *                                      should respond to
   * @param {number} priority - The priority of the middleware, lower numbers
   *                            are executed first
   * @param {RequestHandler} handler - The middleware function
   */
  public static addMiddleware(
    path: string,
    methods: string[] | string,
    priority: number,
    handler: RequestHandler
  ) {
    if (!this.routes.has(path)) this.addRoute(path, methods);

    this.routes.get(path).addMiddleware(methods, priority, handler);
  }

  /**
   * Builds all routes and deploys them to the
   * {@link Express.Application}.
   */
  public static build() {
    this.routes.forEach((route, path) => {
      // Initialize endpoint
      const endpoint = app.route(path);

      // Get middleware
      const middleware = route.middleware;

      // Iterate over HTTP methods
      route.handlers.forEach((handler, method) => {
        // Get middleware for current HTTP method
        const methodMiddleware = middleware.get(method) || [];

        // Add middleware and handler to endpoint
        if (method === 'ALL') endpoint.all(...methodMiddleware, handler);
        else if (method === 'GET') endpoint.get(...methodMiddleware, handler);
        else if (method === 'POST') endpoint.post(...methodMiddleware, handler);

        // Log endpoint
        console.log(
          `Built endpoint: ${path} (${method}, ${methodMiddleware.length})`
        );
      });
    });

    // Clear route data
    this.routes.clear();
  }

  /**
   * Makes the {@link Express.Application} listen on
   * a specified port.
   */
  public static deploy() {
    // Build routes
    this.build();

    // Get server port
    const port = process.env.SERVER_PORT || 3000;

    // Initialize app
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
