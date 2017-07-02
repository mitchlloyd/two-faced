import Server, { FetchAdapter } from 'server';
import 'whatwg-fetch';
import { polyfill } from 'es6-promise';
polyfill();

describe('using the fetch adapter', function() {
  let server: Server;

  beforeEach(function() {
    server = new Server(router => {
      router.get('http://example.com/foo', function() {
        return { a: 'b' };
      });
    }, {
      interceptWith: FetchAdapter,
    });
  });

  test('using the 2 argument form', async function() {
    const response = await fetch('http://example.com/foo', { method: 'GET' });
    const json = await response.json();
    expect(json).toEqual({ a: 'b' });
  });

  test('using URL only form', async function() {
    const response = await fetch('http://example.com/foo');
    const json = await response.json();
    expect(json).toEqual({ a: 'b' });
  });

  test('passing a Request object', async function() {
    const request = new Request('http://example.com/foo', { method: 'GET' });
    const response = await fetch(request);
    const json = await response.json();
    expect(json).toEqual({ a: 'b' });
  });
});
