import { RouteController } from '../controllers';

export default function Middleware(data: MiddlewareData | string): any {
  if (!data) throw new Error('Missing middleware data');

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (typeof data === 'string') {
      data = { path: data, methods: 'ALL', priority: 0 };
    }

    RouteController.addMiddleware(
      data.path,
      data.methods,
      data.priority,
      descriptor.value
    );
  };
}

interface MiddlewareData {
  path: string;
  methods: string[] | string;
  priority?: number;
}
