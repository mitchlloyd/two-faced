declare module 'nise' {
  namespace fakeXhr {
    function useFakeXMLHttpRequest(): FakeXMLHttpRequest;
  }

  interface FakeXMLHttpRequest {
    url: string;
    method: string;
    respond(status: number, headers: {}, body: string): void;
    onCreate(xhr: FakeXMLHttpRequest): void;
    onSend(xhr: FakeXMLHttpRequest): void;
  }
}
