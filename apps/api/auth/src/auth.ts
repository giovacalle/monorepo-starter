import { getKV } from '@monorepo-starter/api-kit/kv';
import { kvSessionKey } from '@monorepo-starter/api-kit/auth';
import { db, eq } from '@monorepo-starter/db';
import { user as users } from '@monorepo-starter/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { sendLoginVerificationOtp } from '@monorepo-starter/transactional';
import { Locales, Locale } from '@monorepo-starter/transactional/shared';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
	NumberDictionary
} from 'unique-names-generator';

const redis = getKV();

export const auth = betterAuth({
	baseURL: process.env.AUTH_BASE_URL,
	basePath: process.env.AUTH_BASE_PATH,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	secondaryStorage: {
		get: async (key) => {
			return await redis.get(kvSessionKey(key));
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(kvSessionKey(key), value, 'EX', ttl);
			else await redis.set(kvSessionKey(key), value);
		},
		delete: async (key) => {
			await redis.del(kvSessionKey(key));
		}
	},
	session: {
		storeSessionInDatabase: true
	},
	user: {
		additionalFields: {
			username: {
				type: 'string',
				required: true,
				input: false
			}
		}
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					let username = user.email;

					try {
						let attempts = 0;

						do {
							const number = NumberDictionary.generate({
								min: 1,
								max: 99999
							});

							const randomUsername = uniqueNamesGenerator({
								dictionaries: [adjectives, animals, number],
								length: 3,
								separator: '_',
								style: 'lowerCase'
							});

							const [existingUser] = await db
								.select()
								.from(users)
								.where(eq(users.username, randomUsername))
								.limit(1);

							if (!existingUser) {
								username = randomUsername;
								break;
							}

							attempts++;

							if (attempts >= 3) {
								console.log(
									'User (before hook): reached max attempts for username generation, using email as fallback'
								);
							}
						} while (attempts < 3);
					} catch (error) {
						console.error('User (before hook): error generating username:', error);
					}

					return {
						data: {
							...user,
							username
						}
					};
				}
			}
		}
	},
	plugins: [
		emailOTP({
			otpLength: 8,
			expiresIn: 180,
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
