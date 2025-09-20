import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { getSessionByToken } from '@monorepo-starter/api-kit/auth';
import { validateAuthHeader, validatePathParams } from '@monorepo-starter/api-kit/validators';
import {
	authHeaderSchema,
	notAuthorizedResponseSchema,
	notFoundResponseSchema,
	numericIdParamSchema
} from '@monorepo-starter/api-kit/schemas';
import { db, and, eq } from '@monorepo-starter/db';
import { posts } from '@monorepo-starter/db/schema';

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
	validator('header', authHeaderSchema, validateAuthHeader),
	validator('param', numericIdParamSchema, validatePathParams),
	async (c) => {
		const token = c.req.valid('header').authorization!.replace('Bearer ', '');

		const userSession = await getSessionByToken(token);

		if (!userSession) {
			return c.json({ message: 'Invalid or expired token' }, 401);
		}

		const { id } = c.req.valid('param');

		const [deletedPost] = await db
			.delete(posts)
			.where(and(eq(posts.id, id), eq(posts.authorId, userSession.session.userId)))
			.returning({
				id: posts.id
			});

		if (!deletedPost) return c.notFound();

		return c.body(null, 204);
	}
);
