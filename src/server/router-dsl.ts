import Router, { HTTPVerb } from './router';
import { Handler } from './route';

export type RouterDSLClient = Pick<Router, 'addRoute'>;

export default class RouterDSL {
  private router: RouterDSLClient;

  constructor(router: RouterDSLClient) {
    this.router = router;
  }

  public get(url: string, handler: Handler) {
    this.router.addRoute('GET', url, handler);
  }

  public put(url: string, handler: Handler) {
    this.router.addRoute('PUT', url, handler);
  }

  public post(url: string, handler: Handler) {
    this.router.addRoute('POST', url, handler);
  }

  public patch(url: string, handler: Handler) {
    this.router.addRoute('PATCH', url, handler);
  }

  public options(url: string, handler: Handler) {
    this.router.addRoute('OPTIONS', url, handler);
  }

  public delete(url: string, handler: Handler) {
    this.router.addRoute('DELETE', url, handler);
  }

  public addRoute(verb: HTTPVerb, url: string, handler: Handler) {
    this.router.addRoute(verb, url, handler);
  }
}
