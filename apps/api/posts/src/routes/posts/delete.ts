import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit';
import { db, schema, drizzle } from '@monorepo-starter/db';
import {
	authHeaderSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema,
	numericIdParamSchema
} from '@/shared/schemas';

export const deletePostsRouter = new Hono();

deletePostsRouter.delete(
	'/:id',
	describeRoute({
		description: 'Delete a post by id',
		tags: ['posts'],
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
	async (c) => {
		const token = c.req.valid('header').authorization!.replace('Bearer ', '');

		const userSession = await getSessionByToken(token);

		if (!userSession) {
			return c.json({ message: 'Invalid or expired token' }, 401);
		}

		const { id } = c.req.valid('param');

		const [deletedPost] = await db
			.delete(schema.posts)
			.where(
				drizzle.and(
					drizzle.eq(schema.posts.id, id),
					drizzle.eq(schema.posts.authorId, userSession.session.userId)
				)
			)
			.returning({
				id: schema.posts.id
			});

		if (!deletedPost) return c.notFound();

		return c.body(null, 204);
	}
);
