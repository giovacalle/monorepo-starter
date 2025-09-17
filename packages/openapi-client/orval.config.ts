import 'dotenv/config';
import { defineConfig } from 'orval';

const postsOpenApiUrl = process.env.POSTS_OPENAPI_URL;

if (!postsOpenApiUrl) throw new Error('POSTS_OPENAPI_URL is not defined');

export default defineConfig({
	posts: {
		input: {
			target: postsOpenApiUrl
		},
		output: {
			baseUrl: postsOpenApiUrl.substring(0, postsOpenApiUrl.indexOf('/api')),
			target: 'src/gen/posts/posts.ts',
			client: 'svelte-query',
			mode: 'split',
			prettier: true,
			headers: true,
			override: {
				mutator: {
					path: 'src/base-custom-fetch.ts',
					name: 'baseCustomFetch'
				},
				operations: {
					getApiV1Posts: {
						query: {
							useQuery: true,
							useInfinite: true,
							useInfiniteQueryParam: 'page'
						}
					}
				}
			}
		}
	}
});
