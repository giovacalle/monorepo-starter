import { authSchema } from '@monorepo-starter/openapi-client';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: authSchema.GetApiV1Session204User | null;
			session: authSchema.GetApiV1Session204Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
