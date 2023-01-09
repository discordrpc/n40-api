import { Middleware } from '../decorators';

export default class RawBody {

  @Middleware({ path: '/deploy', methods: 'POST' })
  private static RawBody(req: any, res: any, next: any) {
    let data = '';
    req.on('data', (chunk: string) => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody= data;
      next();
    });
  }
}