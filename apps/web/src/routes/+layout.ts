import { browser } from '$app/environment';
import { QueryCache, QueryClient, MutationCache } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';
import { CustomError } from '@monorepo-starter/openapi-client';
import { toast } from 'svelte-sonner';
import { m } from '$lib/paraglide/messages';

function handleApiError(error: unknown) {
	if (error instanceof CustomError) {
		switch (error.status) {
			case 400:
				toast.error(m['common.responses.errors.400'](), {
					description: error.data?.message || undefined
				});
				break;
			case 401:
			case 404:
			case 429:
			case 499:
			case 500:
				toast.error(m[`common.responses.errors.${error.status}`]());
				break;
			default:
				toast.error(
					`${m['common.responses.errors.default']()} (${error.status}): ${error.message}`
				);
				break;
		}
	}

	return error;
}

function handleApiSuccess(data: unknown) {
	let status: number | undefined;

	// extract status from data if possible
	if (data && typeof data === 'object') {
		// case 'plain' { status: 200, ... }
		if ('status' in data && typeof (data as { status: number }).status === 'number') {
			status = (data as { status: number }).status;
		}
		// case 'infinite' { pages: [{ status: 200, ... }] }
		else if ('pages' in data && Array.isArray(data.pages)) {
			const dataInfinite = data as { pages: Array<{ status: number }> };
			if (dataInfinite.pages.length > 0) {
				status = dataInfinite.pages[0].status;
			}
		}
	}

	if (status) {
		switch (status) {
			case 200:
			case 201:
			case 204:
				toast.success(m[`common.responses.success.${status}`]());
				break;
			default:
				if (status >= 200 && status < 300) {
					toast.success(`${m['common.responses.success.200']()} (${status})`);
				}
				break;
		}
	}

	return data; // not sure but for consistency
}

export const load: LayoutLoad = async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 60 * 1000,
				retry: 3,
				refetchOnWindowFocus: false
			}
		},
		queryCache: new QueryCache({
			onError: (error) => {
				handleApiError(error);
			}
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				handleApiError(error);
			},
			onSuccess: (data) => {
				handleApiSuccess(data);
			}
		})
	});

	return { queryClient };
};
