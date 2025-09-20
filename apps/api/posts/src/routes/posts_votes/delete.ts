import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit/auth';
import { validateAuthHeader, validatePathParams } from '@monorepo-starter/api-kit/validators';
import {
	authHeaderSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema,
	numericPostIdParamSchema
} from '@monorepo-starter/api-kit/schemas';
import { db, and, eq } from '@monorepo-starter/db';
import { postsVotes } from '@monorepo-starter/db/schema';

export const deletePostsVotesRouter = new Hono();

deletePostsVotesRouter.delete(
	'/:postId',
	describeRoute({
		description: 'Remove vote from a post',
		tags: ['posts_votes'],
		security: [{ bearerAuth: [] }],
		responses: {
			204: {
				description: 'Success'
			},
			401: {
				description: 'Unauthorized',
				content: {
					'application/json': {
						schema: resolver(notAuthorizedResponseSchema)
					}
				}
			},
			404: {
				description: 'Downvote not found',
				content: {
					'application/json': { schema: resolver(notFoundResponseSchema) }
				}
			}
		}
	}),
	validator('header', authHeaderSchema, validateAuthHeader),
	validator('param', numericPostIdParamSchema, validatePathParams),
	async (c) => {
		const token = c.req.valid('header').authorization!.replace('Bearer ', '');

		const userSession = await getSessionByToken(token);

		if (!userSession) {
			return c.json({ message: 'Invalid or expired token' }, 401);
		}

		const { postId } = c.req.valid('param');

		const [deletedPostVote] = await db
			.delete(postsVotes)
			.where(and(eq(postsVotes.postId, postId), eq(postsVotes.userId, userSession.session.userId)))
			.returning({
				postId: postsVotes.postId
			});

		if (!deletedPostVote) c.notFound();

		return c.body(null, 204);
	}
);
