import { getLocale } from '$lib/paraglide/runtime';
import { ClientResponseError } from 'pocketbase';
import { pb } from '..';

const generateRandomishPassword = () => {
	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const symbols = '!@#$%^&*()_+-=';
	const all = upper + lower + numbers + symbols;

	// Ensure at least one character from each set
	let password = [
		upper[Math.floor(Math.random() * upper.length)],
		lower[Math.floor(Math.random() * lower.length)],
		numbers[Math.floor(Math.random() * numbers.length)],
		symbols[Math.floor(Math.random() * symbols.length)]
	];

	// Fill the rest with random characters
	for (let i = password.length; i < 16; i++) {
		password.push(all[Math.floor(Math.random() * all.length)]);
	}

	// Shuffle the password array
	for (let i = password.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[password[i], password[j]] = [password[j], password[i]];
	}

	return password.join('');
};

export const createUser = async (email: string) => {
	try {
		// REMEMBER:this is just to fill password with something 'more secure' than a simple string
		//          BUT email+password auth is disabled in pb dashboard, otherwise you should not use this (clearly)
		const password = generateRandomishPassword();

		await pb.collection('users').create(
			{
				email,
				password,
				passwordConfirm: password,
				lang: getLocale()
			},
			{
				fields: 'id'
			}
		);
	} catch (error) {
		if (error instanceof ClientResponseError && error.status === 400) {
			// user already exists -> ignore
			return;
		}
		throw error;
	}
};
