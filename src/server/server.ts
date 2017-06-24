import 'whatwg-fetch';
import * as errors from 'errors';
import Router from './router';
import { RouteBuilder } from './router';

export default class Server {
  router: Router;

  constructor(addRoutes: RouteBuilder) {
    this.router = new Router();
    addRoutes(this.router);
  }

  handleRequest(request: Request): Promise<Response> {
    const match = this.router.matchFor(request);

    if (!match) {
      throw new errors.NoMatchingRoute(`no matching route for ${request.method} ${request.url}`);
    }

    const routeResponse = match.route.respondTo(request, match.params);
    return Promise.resolve(routeResponse);
  }

  prependRoutes(addRoutes: RouteBuilder) {
    this.router.prependRoutes(addRoutes);
  }
}
