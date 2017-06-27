import * as pathToRegExp from 'path-to-regexp';
import * as qs from 'qs';

export default class RoutePath {
  private paramKeys: pathToRegExp.Key[];
  private matcher: RegExp;

  constructor(path: string) {
    this.paramKeys = [];
    this.matcher = pathToRegExp(path, this.paramKeys);
  }

  public getParams(url: string) {
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
}

export interface QueryParams {
  [key: string]: string;
}
