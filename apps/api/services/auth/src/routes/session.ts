import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import z from 'zod';
import { resolver, validator } from 'hono-openapi/zod';
import { auth } from '@/auth';

export const sessionRouter = new Hono();

const sessionResponseSchema = z.object({
	session: z.object({
		id: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
		userId: z.string(),
		expiresAt: z.date(),
		token: z.string(),
		ipAddress: z.string().nullable().optional(),
		userAgent: z.string().nullable().optional()
	}),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		emailVerified: z.boolean(),
		createdAt: z.date(),
		updatedAt: z.date(),
		image: z.string().nullable().optional()
	})
});

sessionRouter.get(
	'/',
	describeRoute({
		description: 'Get current user session',
		responses: {
			401: {
				description: 'Unauthorized'
			},
			204: {
				description: 'Success',
				content: {
					'application/json': {
						schema: resolver(sessionResponseSchema)
					}
				}
			}
		}
	}),
	validator(
		'header',
		z.object({
			authorization: z.string().startsWith('Bearer ')
		}),
		(result, c) => {
			if (!result.success) {
				return c.json({ message: 'Schema not valid', errors: result.error.flatten() }, 400);
			}
		}
	),
	async (c) => {
		const { authorization } = c.req.valid('header');

		const newHeaders = new Headers();
		newHeaders.set(
			'cookie',
			`${auth.options.advanced.cookies.session_token.name}=${authorization.replace('Bearer ', '')}`
		);

		const session = await auth.api.getSession({ headers: newHeaders });

		if (!session) {
			return c.body(null, 401);
		}

		const { user, ...rest } = session;

		return c.json({
			session: rest.session,
			user
		});
	}
);
