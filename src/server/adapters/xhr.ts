import { fakeXhr, FakeXMLHttpRequest } from 'nise';
type RequestHandler = (request: Request) => Promise<Response>;

export default class XMLHttpRequestAdapter implements TransportAdapter {
  private xhr?: FakeXMLHttpRequest;

  constructor(private handleRequest: RequestHandler) {}

  public install() {
    this.xhr = fakeXhr.useFakeXMLHttpRequest();
    this.xhr.onCreate = (createdXHR: FakeXMLHttpRequest) => {
      createdXHR.onSend = (xhr: FakeXMLHttpRequest) => {
        const request = new Request(xhr.url, { method: xhr.method });
        const fetchResponse = this.handleRequest(request);

        fetchResponse.then(response => {
          return response.text().then(responseText => {
            return { responseText, response };
          });
        }).then(({ response, responseText }) => {
          xhr.respond(response.status, response.headers, responseText);
        });
      };
    };
  }
}

interface TransportAdapter {
  install: () => void;
}
