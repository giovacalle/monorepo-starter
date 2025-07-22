import * as v from 'valibot';
import { m } from '$lib/paraglide/messages';

export const createPostSchema = v.object({
	title: v.pipe(v.string(), v.trim(), v.nonEmpty(m['common.form.fields.title.errors.required']())),
	content: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty(m['common.form.fields.content.errors.required']())
	)
});

export type CreatePostForm = v.InferInput<typeof createPostSchema>;
