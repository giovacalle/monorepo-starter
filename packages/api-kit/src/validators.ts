import type { Context } from 'hono';

/**
 * Standard validator function for authorization header validation
 * Returns 401 with standard message if validation fails
 */
export function validateAuthHeader(result: { success: boolean }, c: Context) {
	if (result.success === false) {
		return c.json({ message: 'Authorization header with Bearer token is required' }, 401);
	}
}

/**
 * Standard validator function for JSON body validation
 * Returns 400 with validation errors if validation fails
 */
export function validateJsonBody(result: { success: boolean; issues?: unknown }, c: Context) {
	if (result.success === false) {
		return c.json({ message: 'Schema not valid', errors: result.issues }, 400);
	}
}

/**
 * Standard validator function for query parameters validation
 * Returns 400 with validation errors if validation fails
 */
export function validateQueryParams(result: { success: boolean; issues?: unknown }, c: Context) {
	if (result.success === false) {
		return c.json({ message: 'Invalid query parameters', errors: result.issues }, 400);
	}
}

/**
 * Standard validator function for path parameters validation
 * Returns 400 with validation errors if validation fails
 */
export function validatePathParams(result: { success: boolean; issues?: unknown }, c: Context) {
	if (result.success === false) {
		return c.json({ message: 'Invalid path parameters', errors: result.issues }, 400);
	}
}
