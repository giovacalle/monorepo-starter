import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { authClient } from '$lib/auth/client';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const assetPattern = /\.(png|jpe?g|svg|gif|webp|ico|woff2?)$/i;

const handleAuth: Handle = async ({ event, resolve }) => {
	// skip auth for static assets
	if (assetPattern.test(event.url.pathname)) {
		return resolve(event);
	}

	const session = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers
		}
	});

	if (!session.error) {
		event.locals.session = session.data;

		// redirect to home if user is already logged in and trying to access sign-in page
		if (event.url.pathname.startsWith('/sign-in')) {
			throw redirect(302, '/');
		}
	} else {
		event.locals.session = null;
	}

	return await resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
