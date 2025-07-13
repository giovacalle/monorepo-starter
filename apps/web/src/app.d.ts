import type { TypedPocketBase } from '$lib/pocketbase/pb-schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase;
		}
		// interface PageData {}
		interface PageState {
			email: string;
			otpId: string;
		}
		// interface Platform {}
	}
}

export {};
