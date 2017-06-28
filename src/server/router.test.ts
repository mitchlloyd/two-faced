import 'whatwg-fetch';
import Router from './router';

describe('Router', function() {
  describe('http builder methods', function() {
    let router: Router;

    beforeEach(function() {
      router = new Router();
    });

    // TODO: move response wrapping to server
    test('`get` adds a route that handles GET requests', async function() {
      router.get('/', params => params);

      const response = router.respondTo(new Request('/', { method: 'GET' }));

      await expect(response.json()).resolves.toEqual({});
    });
  });

  // test('`put` adds a route that handles GET requests', async function() {
  //   const router = new Router();
  //   router.get('/:greeting', function(params) {
  //     return params;
  //   });

  //   const response = router.respondTo(new Request('/hello', { method: 'GET' }));

  //   await expect(response.json()).resolves.toEqual({ greeting: 'hello' });
  // });
});
