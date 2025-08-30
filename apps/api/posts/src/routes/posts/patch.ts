import { Hono } from 'hono';
import * as v from 'valibot';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit';
import { db, and, eq } from '@monorepo-starter/db';
import { posts } from '@monorepo-starter/db/schema';
import {
	authHeaderSchema,
	badRequestResponseSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema,
	numericIdParamSchema
} from '@/shared/schemas';

const bodySchema = v.object({
	title: v.string(),
	content: v.string()
});

const responseSchema = v.object({
	updatedAt: v.string()
});

export const patchPostsRouter = new Hono();

patchPostsRouter.patch(
	'/:id',
	describeRoute({
		description: 'Update a post by id',
		tags: ['posts'],
		security: [{ bearerAuth: [] }],
		responses: {
			200: {
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
				description: 'Not found',
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
	validator('param', numericIdParamSchema, (result, c) => {
		if (result.success === false) {
			return c.json({ message: 'Schema not valid', errors: result.issues }, 400);
		}
	}),
	validator('json', bodySchema, (result, c) => {
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

		const { id } = c.req.valid('param');
		const updateData = c.req.valid('json');

		const [updatedPost] = await db
			.update(posts)
			.set({
				...updateData,
				updatedAt: new Date()
			})
			.where(and(eq(posts.id, id), eq(posts.authorId, userSession.session.userId)))
			.returning({
				updatedAt: posts.updatedAt
			});

		if (!updatedPost) return c.notFound();

		return c.json(updatedPost);
	}
);
