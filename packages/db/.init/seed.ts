import 'dotenv/config';

import { seed } from 'drizzle-seed';
import { db } from '../src/db';
import { todosTable } from '../src/schema';

async function main() {
	console.log('Seeding database...');
	await seed(db, { todosTable });
	console.log('Database seeded successfully!');
}

main();
