import 'whatwg-fetch';
import * as errors from 'errors';
import Router from './router';
import RouterDSL from './router-dsl';
import { AdapterFactory } from './adapters/fetch';

const noop = () => { /* noop */ };

export default class Server {
  private router: Router;

  constructor(addRoutes: RouteBuilderDSL = noop, options: ServerOptions = {}) {
    this.router = new Router();
    const routerDSL = new RouterDSL(this.router);
    addRoutes(routerDSL);

    if (options.interceptWith) {
      const Adapter = options.interceptWith;
      const adapter = new Adapter(this.handleRequest.bind(this));
      adapter.install();
    }
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

interface ServerOptions {
  interceptWith?: AdapterFactory;
}
