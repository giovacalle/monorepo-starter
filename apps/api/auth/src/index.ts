import './_load-env';
import { Hono } from 'hono';
import {
	createCorsMiddleware,
	createRequestIdMiddleware,
	createTimeoutMiddleware,
	createSecurityMiddleware,
	createRateLimitMiddleware
} from '@monorepo-starter/api-kit/middlewares';
import { auth } from './auth';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api/v1');

app.notFound((c) => c.json({ message: 'Not Found' }, 404));

app.use('*', createRequestIdMiddleware());
app.use('*', createSecurityMiddleware());
app.use(
	'*',
	createCorsMiddleware({
		credentials: true
	})
);
app.use('*', createTimeoutMiddleware());

app.use(
	'/email-otp/send-verification-otp',
	createRateLimitMiddleware({
		windowMs: 60 * 60 * 1000, // 1 hour
		max: 10, // max 10 OTP requests per IP per hour,
		keyGenerator: async (c) => {
			try {
				const clonedRequest = c.req.raw.clone();
				const body = await clonedRequest.json();
				const email = body?.email;

				if (email && typeof email === 'string') {
					return `otp:email:${email.toLowerCase()}`;
				}
			} catch {
				return;
			}
		}
	})
);
app.use(
	'/sign-in/email-otp',
	createRateLimitMiddleware({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 15,
		keyGenerator: async (c) => {
			try {
				const clonedRequest = c.req.raw.clone();
				const body = await clonedRequest.json();
				const email = body?.email;

				if (email && typeof email === 'string') {
					return `signin:email:${email.toLowerCase()}`;
				}
			} catch {
				return;
			}
		}
	})
);

app.on(['POST', 'GET'], '/*', async (c) => {
	return auth.handler(c.req.raw);
});

serve({
	port: Number(process.env.PORT),
	fetch: app.fetch
});
