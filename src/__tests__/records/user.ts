import { RecordDefinition } from 'db';
import { Post } from './post';

interface UserAttributes {
  id: number;
  name: string;
  age: number;
  email: string;
  isSuspended: boolean;
  suspendedAt?: Date;
}

interface UserTraits {
  isSuspended: boolean;
  posts: number;
}

export const User: RecordDefinition<UserAttributes, UserTraits> = {
  type: 'user',
  attributes: i => ({
    name: `Name ${i}`,
    age: 42,
    email: `email${i}@example.com`,
    isSuspended: false,
    suspendedAt: undefined,
  }),
  traits: {
    isSuspended: (user, flag) => {
      user.isSuspended = flag;
      user.suspendedAt = new Date();
    },
    posts: (user, count, server) => {
      while (count > 0) {
        server.create(Post, { userId: user.id });
        count--;
      }
    },
  },
};
