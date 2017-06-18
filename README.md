A simple example:

First setup some routes for your server.

```js
// routes.js
export default (server) => {
  server.get('/posts/:id', (db, request) => {
    return db.posts.find(request.params.id);
  });
}
```

You'll also want to create a factory to setup default properties in your
tests.

```js
// factories/user.js
export default (attrs, i) => ({
  attrs: {
    name: `name ${i}`,
    age: 23
  }
});
```

Adapting a hypothetical interface.

```js
export function connectFetch(server) {
  window.fetch = function(url, init) {
    const request = new Request(url, init);
    return server.handleRequest(request);
  }
}
```

Put it all together.

```js
const server = new Server({
  routes(router) {
    router.get('/posts/:id', (db, request) {
      return db.posts.find(request.params.id);
    });
  },
});

connectFetch(server);

const user = server.create('user', { name: 'mitch' });

api.get(`/users/${user.id}`)

server.settle().then(() => {

});
```

```js
export const attrs = (attrs, i) => ({
  attrs: {
    name: `name ${i}`,
    age: 23
  },
});

export const afterCreate = (user, server) {
  server.create('post', { user });
});

// later in index.js
export * as user from './user';
```
