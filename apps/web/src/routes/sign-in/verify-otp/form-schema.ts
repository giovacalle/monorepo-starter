import * as v from 'valibot';
import { m } from '$lib/paraglide/messages';

export const verifyOtpSchema = v.object({
	otp: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty(m['pages.verifyOtp.errors.required']()),
		v.length(8, m['pages.verifyOtp.errors.length']()),
		v.regex(/^\d{8}$/, m['pages.verifyOtp.errors.format']())
	)
});

export type VerifyOtpForm = v.InferInput<typeof verifyOtpSchema>;
