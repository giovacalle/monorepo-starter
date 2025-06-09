import { Hono } from 'hono';
import { openAPISpecs } from 'hono-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { sessionRouter } from '@/routes/session';
import { auth } from './auth';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api/v1');

app.notFound((c) => c.json({ message: 'Not Found' }, 404));

app.use(
	'*',
	cors({
		origin: process.env.CORS_ORIGINS!.split(','),
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
);

app
	.get(
		'/openapi',
		openAPISpecs(app, {
			documentation: {
				info: {
					title: 'Auth API',
					version: '1.0.0',
					description: 'API for managing authentication'
				},
				components: {
					securitySchemes: {
						session: {
							type: 'apiKey',
							description: 'Bearer token for authentication',
							name: 'Authorization',
							in: 'header'
						}
					}
				},
				security: [
					{
						session: []
					}
				]
			}
		})
	)
	.get('/docs', swaggerUI({ url: '/api/v1/openapi' }))
	.route('/session', sessionRouter)
	.on(['POST', 'GET'], '/auth/*', async (c) => {
		return auth.handler(c.req.raw);
	});

serve({
	port: Number(process.env.PORT),
	fetch: app.fetch
});
