import { Hono } from 'hono';
import * as v from 'valibot';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit/auth';
import { validateAuthHeader, validateJsonBody } from '@monorepo-starter/api-kit/validators';
import {
	authHeaderSchema,
	badRequestResponseSchema,
	notAuthorizedResponseSchema
} from '@monorepo-starter/api-kit/schemas';
import { db } from '@monorepo-starter/db';
import { posts } from '@monorepo-starter/db/schema';

const bodySchema = v.object({
	title: v.string(),
	content: v.string()
});

const responseSchema = v.object({
	id: v.number()
});

export const postPostsRouter = new Hono();

postPostsRouter.post(
	'/',
	describeRoute({
		description: 'Create a new post',
		tags: ['posts'],
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

		const newPostData = c.req.valid('json');

		const [createdPost] = await db
			.insert(posts)
			.values({
				title: newPostData.title,
				content: newPostData.content,
				authorId: userSession.session.userId
			})
			.returning({
				id: posts.id
			});

		return c.json(createdPost, 201);
	}
);
