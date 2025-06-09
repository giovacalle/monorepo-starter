import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { hideIfAuthenticatedPaths } from '$lib/config/paths';
import { auth } from '@monorepo-starter/openapi-client';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('auth_v1_session_token');

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}

	// if user is authenticated, we don't want to show the login page (or any other page that should be hidden)
	const isHiddenPath = hideIfAuthenticatedPaths.includes(event.url.pathname);
	if (isHiddenPath) {
		return Response.redirect(new URL('/', event.url.origin), 302);
	}

	try {
		const {
			data: { user, session }
		} = await auth.getApiV1Session({
			authorization: `Bearer ${sessionToken}`
		});

		if (!user || !session) {
			event.locals.user = null;
			event.locals.session = null;

			event.cookies.delete('auth_v1_session_token', {
				path: '/'
			});
		} else {
			event.locals.user = user;
			event.locals.session = session;

			event.cookies.set('auth_v1_session_token', sessionToken, {
				path: '/',
				sameSite: 'none',
				partitioned: true,
				expires: new Date(session.expiresAt)
			});
		}
		// eslint-disable-next-line no-empty
	} catch {}

	return await resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
