import * as v from 'valibot';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/valibot';
import { db, schema, drizzle } from '@monorepo-starter/db';
import {
	authOptionalHeaderSchema,
	badRequestResponseSchema,
	notFoundResponseSchema,
	numericIdParamSchema
} from '@/shared/schemas';

const querySchema = v.object({
	page: v.optional(
		v.pipe(
			v.string(),
			v.transform((val: string) => Number(val)),
			v.number(),
			v.integer('Page must be an integer'),
			v.minValue(1, 'Page must be at least 1')
		)
	),
	limit: v.optional(
		v.pipe(
			v.string(),
			v.transform((val: string) => Number(val)),
			v.number(),
			v.integer('Limit must be an integer'),
			v.minValue(1, 'Limit must be at least 1'),
			v.maxValue(100, 'Limit cannot exceed 100')
		)
	)
});

const responseSchema = v.object({
	id: v.number(),
	title: v.string(),
	content: v.string(),
	author: v.object({
		username: v.string(),
		image: v.optional(v.string())
	}),
	createdAt: v.string(),
	upvotesCount: v.number(),
	downvotesCount: v.number(),
	userVote: v.optional(v.nullable(v.number()))
});

export const getPostsRouter = new Hono();

getPostsRouter
	.get(
		'/',
		describeRoute({
			description: 'Get all posts',
			tags: ['posts'],
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: resolver(v.array(responseSchema))
						}
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
				404: {
					description: 'Not found',
					content: {
						'application/json': { schema: resolver(notFoundResponseSchema) }
					}
				}
			}
		}),
		validator('query', querySchema, (result, c) => {
			if (result.success === false) {
				return c.json({ message: 'Schema not valid', errors: result.issues }, 400);
			}
		}),
		validator('header', authOptionalHeaderSchema), // No callback = always passes
		async (c) => {
			const { page = 1, limit = 10 } = c.req.valid('query');
			const { authorization } = c.req.valid('header');

			let currentUserId: string | null = null;
			if (authorization?.startsWith('Bearer ')) {
				const token = authorization.replace('Bearer ', '');

				const userSession = await db.query.session.findFirst({
					where: drizzle.eq(schema.session.token, token)
				});

				if (userSession) currentUserId = userSession.userId;
			}

			const posts = await db
				.select({
					id: schema.posts.id,
					title: schema.posts.title,
					content: schema.posts.content,
					author: {
						username: schema.user.username,
						image: schema.user.image
					},
					createdAt: schema.posts.createdAt,
					upvotesCount: db
						.$count(
							schema.postsVotes,
							drizzle.and(
								drizzle.eq(schema.postsVotes.postId, schema.posts.id),
								drizzle.eq(schema.postsVotes.vote, 1)
							)
						)
						.as('upvotesCount'),
					downvotesCount: db
						.$count(
							schema.postsVotes,
							drizzle.and(
								drizzle.eq(schema.postsVotes.postId, schema.posts.id),
								drizzle.eq(schema.postsVotes.vote, -1)
							)
						)
						.as('downvotesCount'),
					...(currentUserId && {
						userVote: schema.postsVotes.vote
					})
				})
				.from(schema.posts)
				.innerJoin(schema.user, drizzle.eq(schema.posts.authorId, schema.user.id))
				// INFO: not sure this is the best way to handle optional user votes
				.leftJoin(
					schema.postsVotes,
					drizzle.and(
						drizzle.eq(schema.postsVotes.postId, schema.posts.id),
						drizzle.eq(schema.postsVotes.userId, currentUserId ?? '-')
					)
				)
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy(drizzle.desc(schema.posts.createdAt));

			return c.json(posts);
		}
	)
	.get(
		'/:id',
		describeRoute({
			description: 'Get a post by id',
			tags: ['posts'],
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
				404: {
					description: 'Not found',
					content: {
						'application/json': { schema: resolver(notFoundResponseSchema) }
					}
				}
			}
		}),
		validator('param', numericIdParamSchema, (result, c) => {
			if (result.success === false) {
				return c.json({ message: 'Schema not valid', errors: result.issues }, 400);
			}
		}),
		validator('header', authOptionalHeaderSchema),
		async (c) => {
			const { id } = c.req.valid('param');
			const { authorization } = c.req.valid('header');

			let currentUserId: string | null = null;
			if (authorization?.startsWith('Bearer ')) {
				const token = authorization.replace('Bearer ', '');

				const userSession = await db.query.session.findFirst({
					where: drizzle.eq(schema.session.token, token)
				});

				if (userSession) currentUserId = userSession.userId;
			}

			const [post] = await db
				.select({
					id: schema.posts.id,
					title: schema.posts.title,
					content: schema.posts.content,
					author: {
						username: schema.user.username,
						image: schema.user.image
					},
					createdAt: schema.posts.createdAt,
					upvotesCount: db
						.$count(
							schema.postsVotes,
							drizzle.and(
								drizzle.eq(schema.postsVotes.postId, id),
								drizzle.eq(schema.postsVotes.vote, 1)
							)
						)
						.as('upvotesCount'),
					downvotesCount: db
						.$count(
							schema.postsVotes,
							drizzle.and(
								drizzle.eq(schema.postsVotes.postId, id),
								drizzle.eq(schema.postsVotes.vote, -1)
							)
						)
						.as('downvotesCount'),
					...(currentUserId && {
						userVote: schema.postsVotes.vote
					})
				})
				.from(schema.posts)
				.innerJoin(schema.user, drizzle.eq(schema.posts.authorId, schema.user.id))
				// INFO: not sure this is the best way to handle optional user votes
				.leftJoin(
					schema.postsVotes,
					drizzle.and(
						drizzle.eq(schema.postsVotes.postId, id),
						drizzle.eq(schema.postsVotes.userId, currentUserId ?? '-')
					)
				)
				.where(drizzle.eq(schema.posts.id, id))
				.limit(1);

			if (!post) return c.notFound();

			return c.json(post);
		}
	);
