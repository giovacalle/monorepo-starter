import { Hono } from 'hono';
import { z } from 'zod';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { db, schema, drizzle } from '@monorepo-starter/db';

const notFoundResponse = z.object({
	message: z.string()
});

const todoUpdateRequest = z.object({
	title: z.string(),
	description: z.string(),
	completed: z.boolean()
});

const todoResponse = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	completed: z.boolean()
});

export const patchRouter = new Hono();

patchRouter.patch(
	'/:id',
	describeRoute({
		description: 'Update a todo by id',
		requestBody: {
			content: {
				'application/json': {
					schema: todoUpdateRequest._def
				}
			}
		},
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
	validator('json', todoUpdateRequest, (result, c) => {
		if (!result.success) {
			return c.json({ message: 'Schema not valid', errors: result.error.flatten() }, 400);
		}
	}),
	async (c) => {
		const { id } = c.req.valid('param');
		const updateData = c.req.valid('json');

		const [updatedTodo] = await db
			.update(schema.todos)
			.set({ ...updateData, updatedAt: new Date() })
			.where(drizzle.eq(schema.todos.id, id))
			.returning({
				id: schema.todos.id,
				title: schema.todos.title,
				description: schema.todos.description,
				completed: schema.todos.completed
			});

		if (!updatedTodo) return c.notFound();

		return c.json(updatedTodo);
	}
);
