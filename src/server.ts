import 'whatwg-fetch';
import * as pathToRegExp from 'path-to-regexp';
import * as errors from 'errors';
import * as qs from 'qs';

export default class Server {
  router: Router;

  constructor(addRoutes: (router: Router) => void) {
    this.router = new Router();
    addRoutes(this.router);
  }

  handleRequest(request: Request): Promise<Response> {
    const match: Match = this.router.matchFor(request);

    if (!match) {
      throw new errors.NoMatchingRoute(`no matching route for ${request.method} ${request.url}`);
    }

    const routeResponse = match.route.respondTo(request, match.params);
    return Promise.resolve(routeResponse);
  }
}

class Router {
  private routes: {
    [key in HTTPVerb]: Array<Route>
  } = {
    GET: [],
    PUT: [],
    POST: [],
    PATCH: [],
    OPTIONS: [],
    DELETE: [],
  };

  get(url: string, handler: Handler) {
    const route = new Route(url, handler);
    this.routes.GET.push(route);
  }

  matchFor(request: Request): Match {
    const method = request.method as HTTPVerb;
    const methodRoutes = this.routes[method];

    let match: Match;
    for (let i = 0; i < methodRoutes.length; i++) {
      const route = methodRoutes[i];
      const params = route.getMatchingParams(request.url);

      if (params) {
        match = { route, params };
        break;
      }
    }

    return match;
  }
}

class Route {
  private path: string;
  private handler: Handler;
  private matcher: RegExp;
  private paramKeys: Array<pathToRegExp.Key>;

  constructor(path: string, handler: Handler) {
    this.path = path;
    this.paramKeys = [];
    this.matcher = pathToRegExp(path, this.paramKeys);
    this.handler = handler;
  }

  getMatchingParams(url: string) {
    const [urlWithoutSearch, search] = url.split('?');

    const regexMatches = this.matcher.exec(urlWithoutSearch);

    if (!regexMatches) {
      return null;
    }

    const queryParams = qs.parse(search);

    const urlSegmentParams = this.paramKeys.reduce<QueryParams>((accum, key, index) => {
      accum[key.name] = regexMatches[index + 1];
      return accum;
    }, {});

    return { ...queryParams, ...urlSegmentParams };
  }

  respondTo(request: Request, params: QueryParams) {
    const handlerResponse = this.handler(params);
    const jsonResponse = JSON.stringify(handlerResponse);
    return new Response(jsonResponse, { status: 200 });
  }
}

type HTTPVerb = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';
type Handler = (params: QueryParams) => {};

interface Match {
  route: Route;
  params: QueryParams,
}

interface QueryParams {
  [key: string]: string;
}
