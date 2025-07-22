import { Session } from '$lib/auth/client';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
		}
		interface PageState {
			email: string;
		}
	}
}

export {};
