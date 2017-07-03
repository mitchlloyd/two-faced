import { RecordDefinition } from 'db';

interface PostAttributes {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

export const Post: RecordDefinition<PostAttributes> = {
  type: 'post',
  attributes: i => ({
    title: `Post ${i}`,
    body: `Body content ${i}`,
  }),
};
