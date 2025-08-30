import { db, schema, drizzle } from '@monorepo-starter/db';
import { withErrorHandling } from '../errors';
import { kvGet } from '../kv';

export function kvSessionKey(token: string) {
	return `sess:${token}`;
}

export type Session = {
	session: typeof schema.session.$inferSelect;
	user: typeof schema.user.$inferSelect;
};

export async function getSessionByToken(token: string): Promise<Session | null> {
	return withErrorHandling(
		(async () => {
			if (!token) return null;

			const cached = await kvGet<Session>(kvSessionKey(token));
			if (cached) return cached;

			const fromDb = await db.query.session.findFirst({
				where: drizzle.and(
					drizzle.eq(schema.session.token, token),
					drizzle.gte(schema.session.expiresAt, new Date())
				),
				with: {
					user: true
				}
			});
			if (!fromDb) return null;

			return { session: fromDb, user: fromDb.user };
		})(),
		{
			errorMessage: 'Failed to get session by token',
			meta: { token: token.substring(0, 8) + '...' } // don't log full token
		}
	);
}
