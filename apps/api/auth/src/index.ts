import './_load-env';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api/v1');

app.notFound((c) => c.json({ message: 'Not Found' }, 404));

app.use(
	'*',
	cors({
		origin: process.env.TRUSTED_ORIGINS!.split(','),
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
);

app.on(['POST', 'GET'], '/*', async (c) => {
	return auth.handler(c.req.raw);
});

serve({
	port: Number(process.env.PORT),
	fetch: app.fetch
});
