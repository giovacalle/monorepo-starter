import * as v from 'valibot';

export const notFoundResponseSchema = v.object({
	message: v.string()
});

export const badRequestResponseSchema = v.object({
	message: v.string(),
	errors: v.array(v.any())
});

export const authHeaderSchema = v.pipe(
	v.object({
		authorization: v.string()
	}),
	v.check(
		(input: { authorization: string }) => input.authorization.startsWith('Bearer '),
		'Authorization header must start with "Bearer "'
	)
);

export const authOptionalHeaderSchema = v.object({
	authorization: v.optional(v.string())
});

export const notAuthorizedResponseSchema = v.object({
	message: v.string()
});

export const numericIdParamSchema = v.object({
	id: v.pipe(
		v.string(),
		v.transform((val: string) => Number(val)),
		v.number(),
		v.integer('Id must be an integer'),
		v.minValue(1, 'Id must be at least 1')
	)
});

export const numericPostIdParamSchema = v.object({
	postId: v.pipe(
		v.string(),
		v.transform((val: string) => Number(val)),
		v.number(),
		v.integer('Post ID must be an integer'),
		v.minValue(1, 'Post ID must be at least 1')
	)
});
