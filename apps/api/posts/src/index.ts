import { Hono } from 'hono';
import {
	createCorsMiddleware,
	createRequestIdMiddleware,
	createTimeoutMiddleware,
	createSecurityMiddleware
} from '@monorepo-starter/api-kit/middlewares';
import { openAPISpecs } from 'hono-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { postsRouter } from './routes/posts/_router';
import { postsVotesRouter } from './routes/posts_votes/_router';
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

app
	.get(
		'/openapi',
		openAPISpecs(app, {
			documentation: {
				info: {
					title: 'Posts API',
					version: '1.0.0',
					description: 'API for managing posts'
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'token'
						}
					}
				}
			}
		})
	)
	.get('/docs', swaggerUI({ url: '/api/v1/openapi' }))
	.route('/posts', postsRouter)
	.route('/posts_votes', postsVotesRouter);

serve({
	port: Number(process.env.PORT),
	fetch: app.fetch
});
