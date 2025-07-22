import { baseCustomFetch } from '../../base-custom-fetch';

export const customFetch = <T>(args: Parameters<typeof baseCustomFetch>[0]) =>
	baseCustomFetch<T>(args);
