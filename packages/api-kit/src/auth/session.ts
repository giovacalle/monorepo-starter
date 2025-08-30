import { session, user } from '@monorepo-starter/db/schema';
import { Session, User } from '@monorepo-starter/db/types';
import { db, and, eq, gte } from '@monorepo-starter/db';
import { withErrorHandling } from '../errors';
import { kvGet } from '../kv';

export function kvSessionKey(token: string) {
	return `sess:${token}`;
}

export async function getSessionByToken(
	token: string
): Promise<{ session: Session; user: User } | null> {
	return withErrorHandling(
		(async () => {
			if (!token) return null;

			const cached = await kvGet<{ session: Session; user: User }>(kvSessionKey(token));
			if (cached) return cached;

			const [fromDb] = await db
				.select({
					session,
					user
				})
				.from(session)
				.innerJoin(user, eq(session.userId, user.id))
				.where(and(eq(session.token, token), gte(session.expiresAt, new Date())))
				.limit(1);
			if (!fromDb) return null;

			return fromDb;
		})(),
		{
			errorMessage: 'Failed to get session by token',
			meta: { token: token.substring(0, 8) + '...' } // don't log full token
		}
	);
}
