import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	config();
	config({ path: '.env.local', override: true });
}
