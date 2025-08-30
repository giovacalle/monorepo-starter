import { Hono } from 'hono';
import { getPostsRouter } from './get';
import { postPostsRouter } from './post';
import { patchPostsRouter } from './patch';
import { deletePostsRouter } from './delete';

export const postsRouter = new Hono();
postsRouter.route('/', getPostsRouter);
postsRouter.route('/', postPostsRouter);
postsRouter.route('/', patchPostsRouter);
postsRouter.route('/', deletePostsRouter);
