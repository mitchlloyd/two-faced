import Server from 'server';
import { User } from './records/user';

describe('using factories', function() {
  let server: Server;

  beforeEach(function() {
    server = new Server(router => {
      router.get('/users/:id', function({ id }) {
        return server.find(User, id);
      });
    });
  });

  test('creating a user with overridden attributes', async function() {
    server.create(User);
    const user = server.create(User, { name: 'Ellie' });

    expect(user).toEqual({
      id: 2,
      age: 42,
      name: 'Ellie',
      email: 'email2@example.com',
      isSuspended: false,
    });

    const request = new Request('/users/2');
    const response = await server.handleRequest(request);
    const json = await response.json();

    expect(json).toEqual(user);
  });

  test('creating a user with traits', async function() {
    server.create(User);
    const user = server.create(User, {
      isSuspended: true,
    });

    expect(user).toEqual({
      id: 2,
      age: 42,
      name: 'Name 2',
      email: 'email2@example.com',
      isSuspended: true,
      suspendedAt: user.suspendedAt,
    });

    const request = new Request('/users/2');
    const response = await server.handleRequest(request);
    const body = await response.text();

    expect(body).toEqual(JSON.stringify(user));
  });
});
