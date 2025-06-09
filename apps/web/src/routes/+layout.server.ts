import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user && event.locals.session) {
		return {
			isAuthenticated: true
		};
	}

	return {
		isAuthenticated: false
	};
};
