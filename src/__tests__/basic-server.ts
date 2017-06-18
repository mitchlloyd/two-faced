import Server from 'server';
import 'whatwg-fetch';
import { polyfill } from 'es6-promise';
polyfill();

import * as errors from 'errors';

describe('basic server', function() {
  test('matching a route', function() {
    const server = new Server(router => {
      router.get('http://example.com/foo', function() {
        return { a: 'b' };
      });
    });

    const request = new Request('http://example.com/foo', { method: 'get' });

    return server.handleRequest(request).then(response => {
      return response.json();
    }).then(json => {
      expect(json).toEqual({ a: 'b' });
    });
  });

  test('errors with no matching route', function() {
    const server = new Server(r => {});
    const request = new Request('http://example.com/foo', { method: 'get' });

    expect(() => {
      server.handleRequest(request);
    }).toThrow(errors.NoMatchingRoute)
  });
});
