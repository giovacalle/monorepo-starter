import 'dotenv/config';

import { db } from '../src/db';
import { todosTable } from '../src/schema';

async function main() {
	console.log('Resetting database...');
	await db.delete(todosTable);
	console.log('Database reset successfully!');
}

main();
