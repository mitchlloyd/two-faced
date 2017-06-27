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
    const match = this.router.matchFor(request);

    if (!match) {
      throw new errors.NoMatchingRoute(`no matching route for ${request.method} ${request.url}`);
    }

    const routeResponse = match.route.respondTo(request, match.params);
    return Promise.resolve(routeResponse);
  }

  public prependRoutes(addRoutes: RouteBuilder) {
    this.router.prependRoutes(addRoutes);
  }
}
