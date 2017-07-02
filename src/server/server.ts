import 'whatwg-fetch';
import * as errors from 'errors';
import Router from './router';
import RouterDSL from './router-dsl';

const noop = () => { /* noop */ };

export default class Server {
  private router: Router;

  constructor(addRoutes: RouteBuilderDSL = noop) {
    this.router = new Router();
    const routerDSL = new RouterDSL(this.router);
    addRoutes(routerDSL);
  }

  public handleRequest(request: Request): Promise<Response> {
    const response = this.router.respondTo(request);
    const jsonResponse = JSON.stringify(response);
    const fetchResponse = new Response(jsonResponse);
    return Promise.resolve(fetchResponse);
  }

  public prependRoutes(addRoutes: RouteBuilderDSL) {
    this.router.prependRoutes(router => {
      const routerDSL = new RouterDSL(router);
      addRoutes(routerDSL);
    });
  }
}

type RouteBuilderDSL = (router: RouterDSL) => void;
