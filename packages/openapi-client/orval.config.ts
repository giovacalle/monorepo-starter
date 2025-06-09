import 'dotenv/config';
import { defineConfig } from 'orval';

export default defineConfig({
	auth: {
		input: {
			target: `${process.env.AUTH_BASE_URL}/api/v1/openapi`
		},
		output: {
			baseUrl: process.env.AUTH_BASE_URL,
			target: 'src/gen/auth/auth.ts',
			client: 'svelte-query',
			mode: 'split',
			prettier: true,
			headers: true,
			override: {
				mutator: {
					path: 'src/gen/auth/auth-custom-fetch.ts',
					name: 'authCustomFetch'
				}
			}
		}
	},
	todos: {
		input: {
			target: `${process.env.TODOS_BASE_URL}/api/v1/openapi`
		},
		output: {
			baseUrl: process.env.TODOS_BASE_URL,
			target: 'src/gen/todos/todos.ts',
			client: 'svelte-query',
			mode: 'split',
			prettier: true,
			headers: true,
			override: {
				mutator: {
					path: 'src/gen/todos/todos-custom-fetch.ts',
					name: 'todosCustomFetch'
				}
			}
		}
	}
});
