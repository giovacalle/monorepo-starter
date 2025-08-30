import { cors } from 'hono/cors';
import { timeout } from 'hono/timeout';
import { HTTPException } from 'hono/http-exception';
import type { MiddlewareHandler, Context, Next } from 'hono';
import { AppError, isAppError } from './errors';
import { kvGet, kvSet } from './kv';

// Configurable CORS middleware
export function createCorsMiddleware(options?: Partial<Parameters<typeof cors>[0]>) {
	const { origin, allowHeaders, allowMethods, maxAge, ...rest } = options || {};

	return cors({
		origin: origin || process.env.TRUSTED_ORIGINS!.split(','),
		allowHeaders: allowHeaders || ['Content-Type', 'Authorization'],
		allowMethods: allowMethods || ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
		exposeHeaders: ['Content-Length', 'X-Request-ID'],
		maxAge: maxAge || 600,
		...rest
	});
}

// Request ID middleware (enhanced)
export function createRequestIdMiddleware(): MiddlewareHandler {
	return async (c: Context, next: Next) => {
		const requestId =
			c.req.header('X-Request-ID') ||
			crypto.randomUUID?.() ||
			Math.random().toString(36).substring(2, 15);

		c.set('requestId', requestId);
		c.header('X-Request-ID', requestId);

		await next();
	};
}

// Configurable timeout middleware
export function createTimeoutMiddleware(ms: number = 30000): MiddlewareHandler {
	return timeout(ms, () => {
		const error = AppError.timeout('Request timeout', {
			timeout: ms,
			timestamp: new Date().toISOString()
		});
		error.log('warn');
		return new HTTPException(408, { message: error.message });
	});
}

// Security headers middleware
export function createSecurityMiddleware(): MiddlewareHandler {
	return async (c: Context, next: Next) => {
		c.header('X-Frame-Options', 'DENY');
		c.header('X-Content-Type-Options', 'nosniff');
		c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
		c.header('X-Permitted-Cross-Domain-Policies', 'none');
		await next();
	};
}

// Global error handler middleware
export function createErrorHandlerMiddleware(): MiddlewareHandler {
	return async (c: Context, next: Next) => {
		try {
			await next();
		} catch (error) {
			// Convert to AppError if not already
			const appError = isAppError(error)
				? error
				: AppError.internal(error instanceof Error ? error.message : 'Unknown error', {
						originalError: error instanceof Error ? error.name : typeof error,
						endpoint: c.req.path,
						method: c.req.method,
						requestId: c.get('requestId')
					});

			// Log the error
			appError.log(appError.status >= 500 ? 'error' : 'warn');

			// Return structured error response
			return c.json(appError.toClientResponse(), {
				status: appError.status
			});
		}
	};
}

// Rate limiting middleware
export function kvRateLimitKey(key: string) {
	return `rl:${key}`;
}

// Sliding window rate limiter with KV storage (most performant)
export function createRateLimitMiddleware(options: {
	windowMs: number;
	max: number;
	service?: string;
	keyGenerator?: (c: Context) => Promise<string | undefined>;
	skipSuccessfulRequests?: boolean;
	skipFailedRequests?: boolean;
}): MiddlewareHandler {
	return async (c: Context, next: Next) => {
		const baseKey =
			(await options.keyGenerator?.(c)) ||
			c.req.header('x-forwarded-for') ||
			c.req.header('x-client-ip') ||
			c.req.header('x-real-ip') ||
			'anonymous';

		const key = kvRateLimitKey(`${options.service ?? ''}:${baseKey}`);
		const now = Date.now();

		try {
			const requestCount = await slidingWindowRateLimit(key, now, options.windowMs);
			const isLimited = requestCount > options.max;

			if (isLimited) {
				const resetTime = now + options.windowMs;
				const error = AppError.rateLimited(Math.ceil((resetTime - now) / 1000));

				error
					.withContext({
						currentCount: requestCount,
						limit: options.max,
						windowMs: options.windowMs,
						key: baseKey
					})
					.log('warn');

				c.header('X-RateLimit-Limit', options.max.toString());
				c.header('X-RateLimit-Remaining', '0');
				c.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

				return c.json(error.toClientResponse(), 429);
			}

			// Add informative headers
			c.header('X-RateLimit-Limit', options.max.toString());
			c.header('X-RateLimit-Remaining', Math.max(0, options.max - requestCount).toString());

			await next();

			// Skip counting if requested
			if (options.skipSuccessfulRequests && c.res.status < 400) {
				await decrementRateLimit(key);
			}
		} catch (error) {
			// If KV fails, fallback to permissive rate limiting
			const kvError = AppError.internal('Rate limit KV storage failed', {
				originalError: error instanceof Error ? error.message : 'Unknown KV error',
				key: baseKey,
				fallback: 'allowing_request'
			});
			kvError.log('warn');

			await next();

			if (options.skipFailedRequests && c.res.status >= 400) {
				// Don't count failed requests
				return;
			}
		}
	};
}

// Sliding window rate limiting with Redis-like operations
async function slidingWindowRateLimit(key: string, now: number, windowMs: number): Promise<number> {
	// Use timestamp list instead of sorted set
	const requestsKey = `${key}:requests`;
	const requests = (await kvGet<number[]>(requestsKey)) || [];

	// Remove requests outside the window
	const windowStart = now - windowMs;
	const validRequests = requests.filter((timestamp) => timestamp > windowStart);

	// Add current request
	validRequests.push(now);

	// Save with window TTL
	await kvSet(requestsKey, validRequests, { ex: Math.ceil(windowMs / 1000) });

	return validRequests.length;
}

// Helper to decrement rate limit
async function decrementRateLimit(key: string) {
	const requestsKey = `${key}:requests`;
	const requests = (await kvGet<number[]>(requestsKey)) || [];
	if (requests.length > 0) {
		requests.pop(); // Remove last request
		await kvSet(requestsKey, requests, { ex: 3600 }); // 1 hour TTL
	}
}
