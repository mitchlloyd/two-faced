type RequestHandler = (request: Request) => Promise<Response>;

export default class XMLHttpRequestAdapter implements TransportAdapter {
  constructor(private handleRequest: RequestHandler) {}

  public install() {
    (window as any).XMLHttpRequest = FakeXMLHttpRequestFactory(this.handleRequest);
  }
}

interface TransportAdapter {
  install: () => void;
}

function FakeXMLHttpRequestFactory(handleRequest: RequestHandler) {
  return class FakeXMLHTTPRequest {
    private eventListeners: {
      [key: string]: EventListener[];
    } = {
      load: [],
    };

    private method?: string;
    private url?: string;

    public addEventListener(eventName: string, callback: EventListener) {
      this.eventListeners[eventName].push(callback);
    }

    public open(method: string, url: string) {
      this.method = method;
      this.url = url;
    }

    public send(): void {
      const request = new Request(this.url, { method: this.method });
      const response = handleRequest(request);
      const responseText = response.then(res => res.text());
      this.eventListeners.load.forEach(l => l.call({ responseText }));
    }
  };
}

type EventListener = (this: Event) => void;
