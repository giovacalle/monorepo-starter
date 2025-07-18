import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		isAuthenticated: event.locals.session !== null
	};
};
