import { PUBLIC_AUTH_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: PUBLIC_AUTH_URL,
	plugins: [
		emailOTPClient(),
		inferAdditionalFields({
			user: {
				username: {
					type: 'string'
				}
			}
		})
	]
});

export type Session = typeof authClient.$Infer.Session;
