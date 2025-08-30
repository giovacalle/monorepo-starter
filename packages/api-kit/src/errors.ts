import { ContentfulStatusCode } from 'hono/utils/http-status';

// Common error codes definition
export enum ErrorCode {
	BAD_REQUEST = 'BAD_REQUEST',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	CONFLICT = 'CONFLICT',
	UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
	TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
	INTERNAL = 'INTERNAL',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
	TIMEOUT = 'TIMEOUT'
}

// Structured metadata definition
export interface ErrorMeta {
	// Tracking identifiers
	requestId?: string;
	userId?: string;
	traceId?: string;

	// Error context
	endpoint?: string;
	method?: string;
	timestamp?: string;

	// Error specific details
	field?: string;
	constraint?: string;
	expected?: unknown;
	received?: unknown;

	// Additional information
	retryAfter?: number;
	documentation?: string;

	// Custom data
	[key: string]: unknown;
}

export class AppError extends Error {
	public readonly timestamp: string;

	constructor(
		public readonly code: string,
		public readonly status: ContentfulStatusCode,
		message?: string,
		public readonly meta: ErrorMeta = {}
	) {
		super(message ?? code);
		this.name = 'AppError';
		this.timestamp = new Date().toISOString();

		// Add timestamp to metadata if not present
		if (!this.meta.timestamp) {
			this.meta.timestamp = this.timestamp;
		}

		// Preserve stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}

	// Complete serialization for logging and API responses
	toJSON() {
		return {
			name: this.name,
			code: this.code,
			status: this.status,
			message: this.message,
			timestamp: this.timestamp,
			meta: this.meta,
			stack: this.stack
		};
	}

	// Client serialization (without stack trace)
	toClientResponse() {
		return {
			code: this.code,
			message: this.message,
			timestamp: this.timestamp,
			...(Object.keys(this.meta).length > 1 && { meta: this.meta })
		};
	}

	// Add context to the error
	withContext(context: Partial<ErrorMeta>): AppError {
		return new AppError(this.code, this.status, this.message, {
			...this.meta,
			...context
		});
	}

	// Log the error with different levels
	log(level: 'error' | 'warn' | 'info' = 'error') {
		logError(this, level);
		return this;
	}

	// Factory methods for common errors with metadata
	static badRequest(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.BAD_REQUEST, 400, message, meta);
	}

	static unauthorized(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.UNAUTHORIZED, 401, message, meta);
	}

	static forbidden(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.FORBIDDEN, 403, message, meta);
	}

	static notFound(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.NOT_FOUND, 404, message, meta);
	}

	static conflict(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.CONFLICT, 409, message, meta);
	}

	static unprocessableEntity(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.UNPROCESSABLE_ENTITY, 422, message, meta);
	}

	static tooManyRequests(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.TOO_MANY_REQUESTS, 429, message, meta);
	}

	static internal(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.INTERNAL, 500, message, meta);
	}

	static serviceUnavailable(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.SERVICE_UNAVAILABLE, 503, message, meta);
	}

	static timeout(message?: string, meta?: ErrorMeta) {
		return new AppError(ErrorCode.TIMEOUT, 504, message, meta);
	}

	// Factory methods for specific cases
	static validation(field: string, received: unknown, expected?: string, constraint?: string) {
		return AppError.unprocessableEntity(`Validation failed for field '${field}'`, {
			field,
			received,
			expected,
			constraint
		});
	}

	static database(operation: string, constraint?: string, details?: unknown) {
		return AppError.internal(`Database operation failed: ${operation}`, {
			operation,
			constraint,
			details
		});
	}

	static rateLimited(retryAfter?: number) {
		return AppError.tooManyRequests('Rate limit exceeded', {
			retryAfter,
			documentation: 'Please wait before making more requests'
		});
	}
}

export function toHttpError(err: unknown): AppError {
	if (err instanceof AppError) return err;

	const message = err instanceof Error ? err.message : 'Unknown error';
	const meta =
		err instanceof Error ? { originalError: err.name, stack: err.stack } : { originalValue: err };

	return AppError.internal(message, meta);
}

// Helper to wrap async operations with error handling
export async function withErrorHandling<T>(
	promise: Promise<T>,
	options?: {
		errorMessage?: string;
		meta?: ErrorMeta;
		logLevel?: 'error' | 'warn' | 'info' | false;
	}
): Promise<T> {
	try {
		return await promise;
	} catch (error) {
		const appError = toHttpError(error);

		// Add context if provided
		const contextualError =
			options?.errorMessage || options?.meta
				? appError.withContext({
						...(options.meta || {}),
						...(options.errorMessage && { wrappedMessage: options.errorMessage })
					})
				: appError;

		// Log the error if logging is enabled
		if (options?.logLevel !== false && options?.logLevel !== undefined) {
			contextualError.log(options.logLevel);
		}

		throw contextualError;
	}
}

// Type guard for AppError
export function isAppError(error: unknown): error is AppError {
	return error instanceof AppError;
}

// Helper for safe logging (to avoid lint error)
export function logError(error: AppError, level: 'error' | 'warn' | 'info' = 'error') {
	const logData = error.toJSON();
	// eslint-disable-next-line no-console
	console[level](`[${error.code}] ${error.message}`, logData);
}
