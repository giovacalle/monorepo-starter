import { getGetApiV1PostsQueryOptions } from '@monorepo-starter/openapi-client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(
		getGetApiV1PostsQueryOptions(
			{
				page: 1,
				limit: 50
			},
			{
				authorization: data.token ? `Bearer ${data.token}` : undefined
			},
			{
				query: {
					queryKey: ['posts-get']
				}
			}
		)
	);
};
