import { pb } from '$lib/pocketbase';
import type { UsersRecord } from '$lib/pocketbase/pb-schema';
import { getContext, setContext } from 'svelte';

interface AuthContext {
	user: UsersRecord | null;
	getAvatar: () => string | undefined;
	updateLang: (lang: string) => Promise<void>;
	logout: () => void;
}

class AuthContextClass implements AuthContext {
	user = $state<AuthContext['user']>(pb.authStore.record as UsersRecord | null);

	constructor() {
		$effect(() => {
			const authSubscriber = pb.authStore.onChange((_, record) => {
				this.user = record as UsersRecord | null;
			});

			return () => {
				authSubscriber();
			};
		});
	}

	getAvatar = () => {
		if (!this.user) return;
		return this.user.avatar ? pb.files.getURL(this.user, this.user.avatar) : this.user.avatarURL;
	};

	updateLang = async (lang: string) => {
		if (!this.user) return;

		try {
			await pb.collection('users').update(this.user.id, {
				lang
			});
		} catch {
			// silently fail
		}
	};

	logout = () => {
		pb.authStore.clear();
	};
}

const AUTH_CONTEXT_KEY = Symbol('auth_context');

export function setAuthContext() {
	const authState = new AuthContextClass();
	return setContext(AUTH_CONTEXT_KEY, authState);
}

export function getAuthContext() {
	return getContext<AuthContext>(AUTH_CONTEXT_KEY);
}
