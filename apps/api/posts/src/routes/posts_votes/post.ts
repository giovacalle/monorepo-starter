import { Hono } from 'hono';
import * as v from 'valibot';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit/auth';
import { validateAuthHeader, validateJsonBody } from '@monorepo-starter/api-kit/validators';
import {
	authHeaderSchema,
	badRequestResponseSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema
} from '@monorepo-starter/api-kit/schemas';
import { db } from '@monorepo-starter/db';
import { postsVotes } from '@monorepo-starter/db/schema';

const bodySchema = v.object({
	postId: v.pipe(
		v.number(),
		v.integer('Post ID must be an integer'),
		v.minValue(1, 'Post ID must be at least 1')
	),
	vote: v.picklist(['upvote', 'downvote'])
});

const responseSchema = v.object({
	updatedAt: v.string(),
	vote: v.number()
});

export const postPostsVotesRouter = new Hono();

postPostsVotesRouter.post(
	'/',
	describeRoute({
		description: 'Vote for a post',
		tags: ['posts_votes'],
		security: [{ bearerAuth: [] }],
		responses: {
			201: {
				description: 'Success',
				content: {
					'application/json': { schema: resolver(responseSchema) }
				}
			},
			400: {
				description: 'Bad Request',
				content: {
					'application/json': {
						schema: resolver(badRequestResponseSchema)
					}
				}
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
				description: 'Post not found',
				content: {
					'application/json': { schema: resolver(notFoundResponseSchema) }
				}
			}
		}
	}),
	validator('header', authHeaderSchema, validateAuthHeader),
	validator('json', bodySchema, validateJsonBody),
	async (c) => {
		const token = c.req.valid('header').authorization!.replace('Bearer ', '');

		const userSession = await getSessionByToken(token);

		if (!userSession) {
			return c.json({ message: 'Invalid or expired token' }, 401);
		}

		const { postId, vote } = c.req.valid('json');

		const [postVote] = await db
			.insert(postsVotes)
			.values({
				postId: postId,
				userId: userSession.session.userId,
				vote: vote === 'upvote' ? 1 : -1
			})
			.onConflictDoUpdate({
				target: [postsVotes.postId, postsVotes.userId],
				set: {
					vote: vote === 'upvote' ? 1 : -1,
					updatedAt: new Date()
				}
			})
			.returning({
				updatedAt: postsVotes.updatedAt,
				vote: postsVotes.vote
			});

		if (!postVote) return c.notFound();

		return c.json(postVote, 201);
	}
);
