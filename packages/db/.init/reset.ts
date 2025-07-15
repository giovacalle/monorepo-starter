import 'dotenv/config';
import { db } from '@/src/db';
import { todos } from '@/src/schema';

async function main() {
	console.log('Resetting database...');
	await db.delete(todos);
	console.log('Database reset successfully!');
}

main();
