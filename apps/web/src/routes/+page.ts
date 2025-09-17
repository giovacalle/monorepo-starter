import {
	getGetApiV1PostsInfiniteQueryOptions,
	getGetApiV1PostsQueryKey
} from '@monorepo-starter/openapi-client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchInfiniteQuery(
		getGetApiV1PostsInfiniteQueryOptions(
			{
				page: 1,
				limit: 50
			},
			{
				authorization: data.token ? `Bearer ${data.token}` : undefined
			},
			{
				query: {
					queryKey: getGetApiV1PostsQueryKey()
				}
			}
		)
	);
};
