import { env } from '$env/dynamic/public';
import { createAuthClient } from 'better-auth/svelte';
import { emailOTPClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_AUTH_URL,
	plugins: [emailOTPClient()]
});
