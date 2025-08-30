import { Hono } from 'hono';
import { postPostsVotesRouter } from './post';
import { deletePostsVotesRouter } from './delete';

export const postsVotesRouter = new Hono();
postsVotesRouter.route('/', postPostsVotesRouter);
postsVotesRouter.route('/', deletePostsVotesRouter);
