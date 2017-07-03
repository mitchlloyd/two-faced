import RoutePath, { QueryParams } from './utils/route-path';

export default class Route {
  private path: RoutePath;
  private handler: Handler;

  constructor(path: string, handler: Handler) {
    this.path = new RoutePath(path);
    this.handler = handler;
  }

  public getMatchingParams(url: string) {
    return this.path.getParams(url);
  }

  public respondTo(request: Request, params: QueryParams) {
    return this.handler(params);
  }
}

export type Handler = (params: QueryParams) => {};

export { QueryParams };
