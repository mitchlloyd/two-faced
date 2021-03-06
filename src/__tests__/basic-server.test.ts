import Server from 'server';
import 'whatwg-fetch';
import { polyfill } from 'es6-promise';
polyfill();

import * as errors from 'errors';

describe('basic server', function() {
  test('matching a route', function() {
    const server = new Server(router => {
      router.get('http://example.com/nomatch', function() {
        throw new Error('should not match');
      });

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
    const server = new Server();
    const request = new Request('http://example.com/foo');

    expect(() => {
      server.handleRequest(request);
    }).toThrow(errors.NoMatchingRoute);
  });

  test('errors with unrecognized HTTP verb', function() {
    const server = new Server();
    const request = new Request('http://example.com/foo', { method: 'WAT' });

    expect(() => {
      server.handleRequest(request);
    }).toThrow(errors.InvalidHTTPMethod);
  });

  test('using params from URL segments', function() {
    const server = new Server(router => {
      router.get('http://example.com/users/:id', function(params) {
        return { id: params.id };
      });
    });

    const request = new Request('http://example.com/users/1');

    return server.handleRequest(request).then(response => {
      return response.json();
    }).then(json => {
      expect(json).toEqual({ id: '1' });
    });
  });

  test('using params from queryParams', function() {
    const server = new Server(router => {
      router.get('http://example.com/foo', function(params) {
        return { name: params.name };
      });
    });

    const request = new Request('http://example.com/foo?name=Ellie');

    return server.handleRequest(request).then(response => {
      return response.json();
    }).then(json => {
      expect(json).toEqual({ name: 'Ellie' });
    });
  });

  test('overriding existing routes', function() {
    const server = new Server(router => {
      router.get('http://example.com/foo', function() {
        throw new Error('should not be called');
      });
    });

    server.prependRoutes(router => {
      router.get('http://example.com/foo', function() {
        return { success: true };
      });
    });

    const request = new Request('http://example.com/foo');

    return server.handleRequest(request).then(response => {
      return response.json();
    }).then(json => {
      expect(json).toEqual({ success: true });
    });
  });
});
