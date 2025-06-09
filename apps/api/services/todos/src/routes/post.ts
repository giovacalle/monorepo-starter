import { Hono } from 'hono';
import { z } from 'zod';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { db, schema } from '@monorepo-starter/db';

const todoCreateRequest = z.object({
	title: z.string(),
	description: z.string(),
	completed: z.boolean().optional().default(false)
});

const todoResponse = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	completed: z.boolean()
});

export const postRouter = new Hono();

postRouter.post(
	'/',
	describeRoute({
		description: 'Create a new todo',
		requestBody: {
			content: {
				'application/json': { schema: todoCreateRequest._def }
			}
		},
		responses: {
			201: {
				description: 'Success',
				content: {
					'application/json': { schema: resolver(todoResponse) }
				}
			}
		}
	}),
	validator('json', todoCreateRequest, (result, c) => {
		if (!result.success) {
			return c.json({ message: 'Schema not valid', errors: result.error.flatten() }, 400);
		}
	}),
	async (c) => {
		const newTodoData = c.req.valid('json');

		const [createdTodo] = await db.insert(schema.todos).values(newTodoData).returning({
			id: schema.todos.id,
			title: schema.todos.title,
			description: schema.todos.description,
			completed: schema.todos.completed
		});

		return c.json(createdTodo, 201);
	}
);
