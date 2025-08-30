import Redis from 'ioredis';

let _kv: Redis | null = null;

export function getKV() {
	if (_kv) return _kv;
	_kv = new Redis(process.env.REDIS_URL as string, {
		family: 0,
		connectTimeout: 5000,
		retryStrategy: (times) => Math.min(times * 1000, 30000),
		maxRetriesPerRequest: 3,
		showFriendlyErrorStack: true,
		reconnectOnError: (err) => {
			console.error('Redis reconnecting due to error', err);
			return false;
		}
	});

	_kv.on('error', (err) => {
		console.error('Redis error:', err);
	});

	return _kv;
}

// ---- Helpers JSON-safe ----
function toJSON(value: unknown): string {
	return typeof value === 'string' ? value : JSON.stringify(value);
}

function parseJSON<T>(raw: string | null): T | null {
	if (raw == null) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return raw as unknown as T;
	}
}

// ---- Operations ----
/** GET key -> T|null */
export async function kvGet<T = unknown>(key: string): Promise<T | null> {
	const raw = await getKV().get(key);
	return parseJSON<T>(raw);
}

/** SET key value (options: ex=seconds, px=milliseconds, nx=true) */
export async function kvSet<T = unknown>(
	key: string,
	value: T,
	opts?: { ex?: number; px?: number; nx?: boolean }
): Promise<'OK' | null> {
	const kv = getKV();
	const payload = toJSON(value);

	const args: (string | number)[] = [key, payload];
	if (opts?.ex) args.push('EX', opts.ex);
	if (opts?.px) args.push('PX', opts.px);
	if (opts?.nx) args.push('NX');

	// @ts-expect-error variadic types
	return kv.set(...args);
}

export async function kvDel(key: string | string[]): Promise<number> {
	const kv = getKV();
	return Array.isArray(key) ? kv.del(...key) : kv.del(key);
}
