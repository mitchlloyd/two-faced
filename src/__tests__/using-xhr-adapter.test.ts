import Server, { XMLHttpRequestAdapter } from 'server';
import 'whatwg-fetch';
import { polyfill } from 'es6-promise';
polyfill();

describe('using the xhr adapter', function() {
  let server: Server;

  beforeEach(function() {
    server = new Server(router => {
      router.get('http://example.com/foo', function() {
        return { a: 'b' };
      });
    }, {
      interceptWith: XMLHttpRequestAdapter,
    });
  });

  test('basic request using load event', async function() {
    const promise = new Promise(function(resolve) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function() {
        resolve(this.responseText);
      });
      xhr.open('GET', 'http://example.com/foo');
      xhr.send();
    });

    const response = await promise;
    expect(response).toEqual('{"a":"b"}');
  });
});
