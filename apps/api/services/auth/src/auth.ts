import { db } from '@monorepo-starter/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { sendLoginVerificationOtp } from '@monorepo-starter/transactional';
import { Locales, Locale } from '@monorepo-starter/transactional/shared';

export const auth = betterAuth({
	baseURL: process.env.AUTH_BASE_URL,
	basePath: process.env.AUTH_BASE_PATH,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	session: {
		cookieCache: {
			enabled: true
		}
	},
	plugins: [
		emailOTP({
			sendVerificationOTP(data, request) {
				const cookie = request?.headers.get('cookie');
				let locale: Locale = 'en';

				// this is a workaround to get the locale from the cookie (if available)
				// KEEP IN MIND: we are filtering for a cookie named 'locale' (since we force this name in paraglide-vite config)
				// 							 if you change the cookie name, you need to update this logic
				if (cookie) {
					const match = cookie.match(new RegExp(`locale=(${Locales.join('|')})`));
					if (match && match[1]) locale = match[1] as Locale;
				}

				return sendLoginVerificationOtp({
					to: data.email,
					otp: data.otp,
					locale
				});
			}
		})
	],
	socialProviders: {
		google: {
			prompt: 'select_account',
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}
	},
	trustedOrigins: process.env.TRUSTED_ORIGINS!.split(','),
	advanced: {
		ipAddress: {
			ipAddressHeaders: ['x-forwarded-for', 'x-client-ip', 'x-real-ip'],
			disableIpTracking: false
		},
		cookiePrefix: '',
		crossSubDomainCookies: {
			enabled: process.env.NODE_ENV === 'production',
			domain: process.env.CROSS_DOMAIN
		},
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: 'none',
			partitioned: true
		}
	}
});
