import { Hono } from 'hono';
import { openAPISpecs } from 'hono-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { getRouter } from '@/routes/get';
import { postRouter } from '@/routes/post';
import { patchRouter } from '@/routes/patch';
import { deleteRouter } from '@/routes/delete';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api/v1');

app.notFound((c) => c.json({ message: 'Not Found' }, 404));

app
	.get(
		'/openapi',
		openAPISpecs(app, {
			documentation: {
				info: {
					title: 'Todos API',
					version: '1.0.0',
					description: 'API for managing todos'
				}
			}
		})
	)
	.get('/docs', swaggerUI({ url: '/api/v1/openapi' }))
	.route('/todos', getRouter)
	.route('/todos', postRouter)
	.route('/todos', patchRouter)
	.route('/todos', deleteRouter);

serve({
	port: Number(process.env.PORT),
	fetch: app.fetch
});
