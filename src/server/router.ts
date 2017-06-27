import Route, {
  Handler,
  QueryParams,
} from './route';

export default class Router {
  private routes: RouteRegistry = {
    GET: [],
    PUT: [],
    POST: [],
    PATCH: [],
    OPTIONS: [],
    DELETE: [],
  };

  public get(url: string, handler: Handler) {
    const route = new Route(url, handler);
    this.routes.GET.push(route);
  }

  public matchFor(request: Request): RouteMatch {
    const method = request.method as HTTPVerb;
    const methodRoutes = this.routes[method];

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

  public prependRoutes(addRoutes: RouteBuilder) {
    const router = new Router();
    addRoutes(router);
    const newRoutes = router.routes;

    for (const verb in newRoutes) {
      this.routes[verb] = [ ...newRoutes[verb], ...this.routes[verb] ];
    }
  }
}

interface RouteRegistry {
  [key: string]: Route[];
}

export interface RouteMatch {
  route: Route;
  params: QueryParams;
}

export type RouteBuilder = (router: Router) => void;

export type HTTPVerb = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';
