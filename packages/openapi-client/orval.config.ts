import 'dotenv/config';
import { defineConfig } from 'orval';

const todosOpenApiUrl = process.env.TODOS_OPENAPI_URL;

if (!todosOpenApiUrl) throw new Error('TODOS_OPENAPI_URL is not defined');

export default defineConfig({
	todos: {
		input: {
			target: todosOpenApiUrl
		},
		output: {
			baseUrl: todosOpenApiUrl.substring(0, todosOpenApiUrl.indexOf('/api')),
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
