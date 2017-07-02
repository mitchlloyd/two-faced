import Route, {
  Handler,
  QueryParams,
} from './route';
import * as errors from 'errors';

export default class Router {
  private routes = new RouteRegistry();

  public addRoute(verb: HTTPVerb, url: string, handler: Handler) {
    const route = new Route(url, handler);
    this.routes[verb].push(route);
  }

  public respondTo(request: Request) {
    const match = this.matchFor(request);

    if (!match) {
      throw new errors.NoMatchingRoute(`no matching route for ${request.method} ${request.url}`);
    }

    return match.route.respondTo(request, match.params);
  }

  public prependRoutes(addRoutes: RouteBuilder) {
    const router = new Router();
    addRoutes(router);
    const newRoutes = router.routes;

    for (const v in this.routes) {
      const verb = v as HTTPVerb;
      this.routes[verb] = [...newRoutes[verb], ...this.routes[verb]];
    }
  }

  private matchFor(request: Request): RouteMatch {
    const method = request.method;

    if (!(method in this.routes)) {
      throw new Error(`${method} is not a valid HTTP verb`);
    }

    const methodRoutes = this.routes[method as HTTPVerb];

    let match: RouteMatch;
    for (const route of methodRoutes) {
      const params = route.getMatchingParams(request.url);

      if (params) {
        match = { route, params };
        break;
      }
    }

    return match;
  }
}

export interface RouteMatch {
  route: Route;
  params: QueryParams;
}

export type RouteBuilder = (router: Router) => void;

class RouteRegistry {
  public GET: Route[] = [];
  public PUT: Route[] = [];
  public POST: Route[] = [];
  public PATCH: Route[] = [];
  public OPTIONS: Route[] = [];
  public DELETE: Route[] = [];
}

export type HTTPVerb = keyof RouteRegistry;
