import { z } from 'zod';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { db, schema, drizzle } from '@monorepo-starter/db';

const notFoundResponse = z.object({
	message: z.string()
});

const todoResponse = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	completed: z.boolean()
});

export const getRouter = new Hono();

getRouter
	.get(
		'/',
		describeRoute({
			description: 'Get all todos',
			responses: {
				404: {
					description: 'Not found',
					content: {
						'application/json': { schema: resolver(notFoundResponse) }
					}
				},
				200: {
					description: 'Success',
					content: {
						'application/json': {
							schema: resolver(z.array(todoResponse))
						}
					}
				}
			}
		}),
		validator(
			'query',
			z.object({
				page: z.coerce.number().default(1),
				limit: z.coerce.number().default(10)
			}),
			(result, c) => {
				if (!result.success) {
					return c.json({ message: 'Schema not valid', errors: result.error.flatten() }, 400);
				}
			}
		),
		async (c) => {
			const { page, limit } = c.req.valid('query');

			const todos = await db
				.select({
					id: schema.todos.id,
					title: schema.todos.title,
					description: schema.todos.description,
					completed: schema.todos.completed
				})
				.from(schema.todos)
				.limit(limit)
				.offset((page - 1) * limit);

			return c.json(todos);
		}
	)
	.get(
		'/:id',
		describeRoute({
			description: 'Get a todo by id',
			responses: {
				404: {
					description: 'Not found',
					content: {
						'application/json': { schema: resolver(notFoundResponse) }
					}
				},
				200: {
					description: 'Success',
					content: {
						'application/json': { schema: resolver(todoResponse) }
					}
				}
			}
		}),
		validator(
			'param',
			z.object({
				id: z.string().transform((val, ctx) => {
					const parsed = Number(val);
					if (isNaN(parsed)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Must be a numeric string'
						});
						return z.NEVER;
					}
					return parsed;
				})
			}),
			(result, c) => {
				if (!result.success) {
					return c.json({ message: 'Schema not valid', errors: result.error.flatten() }, 400);
				}
			}
		),
		async (c) => {
			const { id } = c.req.valid('param');

			const todo = await db.query.todos.findFirst({
				where: drizzle.eq(schema.todos.id, id),
				columns: {
					id: true,
					title: true,
					description: true,
					completed: true
				}
			});

			if (!todo) return c.notFound();

			return c.json(todo);
		}
	);
