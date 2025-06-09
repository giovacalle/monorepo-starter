import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@monorepo-starter/db';
import { emailOTP } from 'better-auth/plugins';

export const auth = betterAuth({
	baseURL: process.env.AUTH_BASE_URL,
	basePath: '/api/v1/auth',
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	trustedOrigins: process.env.CORS_ORIGINS!.split(','),
	plugins: [
		emailOTP({
			sendVerificationOTP: async ({ email, otp }) => {
				// TODO: Implement email sending logic here
				console.log(`Sending OTP ${otp} to ${email}`);
			}
		})
	],
	socialProviders: {
		google: {
			prompt: 'select_account',
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ['x-forwarded-for', 'x-client-ip', 'x-real-ip'],
			disableIpTracking: false
		},
		cookies: {
			session_token: {
				name: 'auth_v1_session_token'
			}
		},
		cookiePrefix: '',
		crossSubDomainCookies: {
			enabled: process.env.NODE_ENV === 'production',
			domain: process.env.LEADING_DOMAIN
		},
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: 'none',
			partitioned: true
		}
	}
});
