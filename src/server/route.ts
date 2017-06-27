import * as pathToRegExp from 'path-to-regexp';
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
    const handlerResponse = this.handler(params);
    const jsonResponse = JSON.stringify(handlerResponse);
    return new Response(jsonResponse, { status: 200 });
  }
}

export type Handler = (params: QueryParams) => {};

export { QueryParams };
