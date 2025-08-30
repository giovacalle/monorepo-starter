import {
	boolean,
	check,
	index,
	integer,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// handle by better-auth
export const user = pgTable(
	'user',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		image: text('image'),
		username: text('username').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('user_id_index').on(table.id),
		index('user_email_index').on(table.email),
		index('user_username_index').on(table.username)
	]
);

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').notNull(),
		updatedAt: timestamp('updated_at').notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [index('session_token_index').on(table.token)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').notNull(),
		updatedAt: timestamp('updated_at').notNull()
	},
	(table) => [index('account_user_id_index').on(table.userId)]
);

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('verification_identifier_index').on(table.identifier)]
);
// end better-auth

export const posts = pgTable(
	'posts',
	{
		id: serial('id').primaryKey(),
		title: text('title').notNull(),
		content: text('content').notNull(),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('posts_author_id_index').on(table.authorId)]
);

export const postsVotes = pgTable(
	'posts_votes',
	{
		postId: integer('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		vote: smallint('vote').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		primaryKey({ columns: [table.postId, table.userId] }),
		index('posts_votes_post_id_index').on(table.postId),
		index('posts_votes_user_id_index').on(table.userId),
		check(
			'posts_votes_vote_check',
			sql`${table.vote} IN (1, -1)` // Ensure vote is either 1 (upvote) or -1 (downvote)
		)
	]
);

// relations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	posts: many(posts),
	votes: many(postsVotes)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const postRelations = relations(posts, ({ one, many }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id]
	}),
	votes: many(postsVotes)
}));

export const postsVotesRelations = relations(postsVotes, ({ one }) => ({
	post: one(posts, {
		fields: [postsVotes.postId],
		references: [posts.id]
	}),
	user: one(user, {
		fields: [postsVotes.userId],
		references: [user.id]
	})
}));
