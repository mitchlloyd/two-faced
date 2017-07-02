import 'whatwg-fetch';
import RouterDSL, { RouterDSLClient } from './router-dsl';
import { Handler } from './route';

describe('Router', function() {
  describe('http builder methods', function() {
    let router: RouterDSLClient;
    let routerDSL: RouterDSL;
    const handler: Handler = p => p;

    beforeEach(function() {
      router = {
        addRoute: jest.fn(),
      };

      routerDSL = new RouterDSL(router);
    });

    test('`get` adds a route that handles GET requests', function() {
      routerDSL.get('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('GET', '/', handler);
    });

    test('`put` adds a route that handles PUT requests', function() {
      routerDSL.put('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('PUT', '/', handler);
    });

    test('`post` adds a route that handles POST requests', function() {
      routerDSL.post('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('POST', '/', handler);
    });

    test('`patch` adds a route that handles PATCH requests', function() {
      routerDSL.patch('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('PATCH', '/', handler);
    });

    test('`delete` adds a route that handles DELETE requests', function() {
      routerDSL.delete('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('DELETE', '/', handler);
    });

    test('`options` adds a route that handles OPTIONS requests', function() {
      routerDSL.options('/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('OPTIONS', '/', handler);
    });

    test('`addRoute` forwards the call to the router', function() {
      routerDSL.addRoute('GET', '/', handler);
      expect(router.addRoute).toHaveBeenCalledWith('GET', '/', handler);
    });
  });
});
