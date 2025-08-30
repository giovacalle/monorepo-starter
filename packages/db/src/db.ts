import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool() {
	if (!_pool) {
		_pool = new Pool({
			connectionString: process.env.DATABASE_URL
		});
	}
	return _pool;
}

export function getDb() {
	if (!_db) {
		_db = drizzle({ client: getPool(), schema });
	}
	return _db;
}

// Lazy initialization
export const db = getDb();

// Cleanup utility
export async function closeDb() {
	if (_pool) {
		await _pool.end();
		_pool = null;
		_db = null;
	}
}
