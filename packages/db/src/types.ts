import * as schema from './schema';

// inferred types
export type User = typeof schema.user.$inferSelect;
export type NewUser = typeof schema.user.$inferInsert;
export type Session = typeof schema.session.$inferSelect;
export type NewSession = typeof schema.session.$inferInsert;
export type Post = typeof schema.posts.$inferSelect;
export type NewPost = typeof schema.posts.$inferInsert;

// drizzle-orm types
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
