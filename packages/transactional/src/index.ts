import { Resend } from 'resend';
import type { Locale } from '@/shared/types';
import LoginVerificationOtpEmail from '@/src/emails/login-verification-otp';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendLoginVerificationOtp({
	from = process.env.FROM_EMAIL!,
	to,
	locale,
	otp
}: {
	from?: string;
	to: string;
	locale: Locale;
	otp: string;
}) {
	const { error } = await resend.emails.send({
		from,
		to,
		subject: {
			it: 'Verifica il tuo indirizzo email',
			en: 'Verify your email address'
		}[locale],
		react: LoginVerificationOtpEmail({
			otp,
			locale
		})
	});

	if (error) throw new Error('Failed to send email');
}
