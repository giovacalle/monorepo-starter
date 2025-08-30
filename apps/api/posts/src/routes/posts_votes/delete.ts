import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit';
import { db, schema, drizzle } from '@monorepo-starter/db';
import {
	authHeaderSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema,
	numericPostIdParamSchema
} from '@/shared/schemas';

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
	validator('header', authHeaderSchema, (result, c) => {
		if (result.success === false) {
			return c.json({ message: 'Authorization header with Bearer token is required' }, 401);
		}
	}),
	validator('param', numericPostIdParamSchema, (result, c) => {
		if (result.success === false) {
			return c.json({ message: 'Schema not valid', errors: result.issues }, 400);
		}
	}),
	async (c) => {
		const token = c.req.valid('header').authorization!.replace('Bearer ', '');

		const userSession = await getSessionByToken(token);

		if (!userSession) {
			return c.json({ message: 'Invalid or expired token' }, 401);
		}

		const { postId } = c.req.valid('param');

		const [deletedPostVote] = await db
			.delete(schema.postsVotes)
			.where(
				drizzle.and(
					drizzle.eq(schema.postsVotes.postId, postId),
					drizzle.eq(schema.postsVotes.userId, userSession.session.userId)
				)
			)
			.returning({
				postId: schema.postsVotes.postId
			});

		if (!deletedPostVote) c.notFound();

		return c.body(null, 204);
	}
);
