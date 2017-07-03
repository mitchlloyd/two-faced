import 'whatwg-fetch';
import Router from './router';
import RouterDSL from './router-dsl';
import { AdapterFactory } from './adapters/fetch';
import DB, { RecordDefinition, RecordAttributes } from 'db';

const noop = () => { /* noop */ };

export default class Server {
  private router: Router;
  private db: DB = new DB();

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

  public create<A extends RecordAttributes, T = {}>(
    recordDefinition: RecordDefinition<A, T>,
    attrs?: Partial<A & T>,
  ): A {
    return this.db.create(recordDefinition, attrs);
  }

  public find<T extends RecordAttributes>(recordDefinition: RecordDefinition<T>, id: number | string): T {
    return this.db.find(recordDefinition, id);
  }
}

type RouteBuilderDSL = (router: RouterDSL) => void;

interface ServerOptions {
  interceptWith?: AdapterFactory;
}
