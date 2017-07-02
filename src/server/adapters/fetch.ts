type RequestHandler = (request: Request) => Promise<Response>;

export default class FetchAdapter implements TransportAdapter {
  constructor(private handleRequest: RequestHandler) {}

  public install() {
    window.fetch = this.fakeFetch.bind(this);
  }

  private fakeFetch(urlOrRequest: string | Request, init = {}) {
    if (urlOrRequest instanceof Request) {
      return this.handleRequest(urlOrRequest);
    }

    const request = new Request(urlOrRequest, init);
    return this.handleRequest(request);
  }
}

export interface AdapterFactory {
  new(handleRequest: RequestHandler): TransportAdapter;
}

interface TransportAdapter {
  install: () => void;
}
