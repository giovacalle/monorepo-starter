import { authClient } from '$lib/auth/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: typeof authClient.$Infer.Session | null;
		}
	}
}

export {};
