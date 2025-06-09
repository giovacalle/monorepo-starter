import { Hono } from 'hono';
import { z } from 'zod';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { db, schema, drizzle } from '@monorepo-starter/db';

const notFoundResponse = z.object({
	message: z.string()
});

export const deleteRouter = new Hono();

deleteRouter.delete(
	'/:id',
	describeRoute({
		description: 'Delete a todo by id',
		responses: {
			404: {
				description: 'Not found',
				content: {
					'application/json': { schema: resolver(notFoundResponse) }
				}
			},
			204: {
				description: 'Success'
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

		const [deletedTodo] = await db
			.delete(schema.todos)
			.where(drizzle.eq(schema.todos.id, id))
			.returning({
				id: schema.todos.id
			});

		if (!deletedTodo) return c.notFound();

		return c.body(null, 204);
	}
);
