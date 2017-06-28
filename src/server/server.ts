import 'whatwg-fetch';
import * as errors from 'errors';
import Router from './router';
import { RouteBuilder } from './router';

const noop = () => { /* noop */ };

export default class Server {
  private router: Router;

  constructor(addRoutes: RouteBuilder = noop) {
    this.router = new Router();
    addRoutes(this.router);
  }

  public handleRequest(request: Request): Promise<Response> {
    const response = this.router.respondTo(request);
    const jsonResponse = JSON.stringify(response);
    const fetchResponse = new Response(jsonResponse);
    return Promise.resolve(fetchResponse);
  }

  public prependRoutes(addRoutes: RouteBuilder) {
    this.router.prependRoutes(addRoutes);
  }
}
