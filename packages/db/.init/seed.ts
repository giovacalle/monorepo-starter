import 'dotenv/config';
import { seed } from 'drizzle-seed';
import { db } from '../src/db';
import * as schema from '../src/schema';

async function main() {
	console.log('Seeding database...');
	await seed(db, schema);
	console.log('Database seeded successfully!');
}

main();
