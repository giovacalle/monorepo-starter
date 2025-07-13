import * as v from 'valibot';
import { m } from '$lib/paraglide/messages';

export const signInSchema = v.object({
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty(m['common.form.fields.email.errors.required']()),
		v.email(m['common.form.fields.email.errors.format']())
	)
});

export type SignInForm = v.InferInput<typeof signInSchema>;
