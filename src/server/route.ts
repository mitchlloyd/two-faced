import * as pathToRegExp from 'path-to-regexp';
import * as qs from 'qs';

export default class Route {
  private path: string;
  private handler: Handler;
  private matcher: RegExp;
  private paramKeys: pathToRegExp.Key[];

  constructor(path: string, handler: Handler) {
    this.path = path;
    this.paramKeys = [];
    this.matcher = pathToRegExp(path, this.paramKeys);
    this.handler = handler;
  }

  // TODO: extract as utility
  public getMatchingParams(url: string) {
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

  public respondTo(request: Request, params: QueryParams) {
    const handlerResponse = this.handler(params);
    const jsonResponse = JSON.stringify(handlerResponse);
    return new Response(jsonResponse, { status: 200 });
  }
}

export type Handler = (params: QueryParams) => {};

export interface QueryParams {
  [key: string]: string;
}
