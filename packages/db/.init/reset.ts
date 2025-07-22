import 'dotenv/config';
import { db } from '../src/db';
import * as schema from '../src/schema';
import { reset } from 'drizzle-seed';

async function main() {
	console.log('Resetting database...');
	await reset(db, schema);
	console.log('Database reset successfully!');
}

main();
