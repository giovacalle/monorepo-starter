<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import { goto } from '$app/navigation';
	import { siteConfig } from '$lib/config/site';
	import { Label, Button } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages.js';

	let email = $state('');
	let isLoading = $state(false);
	let message = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			message = m['pages.logIn.errors.emailFormat']();
			return;
		}

		isLoading = true;
		message = '';

		try {
			await authClient.emailOtp.sendVerificationOtp({
				email,
				type: 'sign-in',
				fetchOptions: {
					onError: ({ error }) => {
						message = error.message ?? m['pages.logIn.errors.sendOtp']();
					},
					onSuccess: () => {
						goto('/login/verify-otp', {
							state: { email }
						});
					}
				}
			});
		} catch (error) {
			message = m['pages.logIn.errors.sendOtp']();
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{siteConfig.name} - Login</title>
</svelte:head>

<div class="flex min-h-[85vh] w-screen items-center justify-center text-white">
	<div class="h-max w-full max-w-md rounded-lg border p-8">
		<div class="mb-8 text-center">
			<div
				class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
				<Icon icon="tabler:user" class="h-8 w-8 text-white" />
			</div>
			<h1 class="mb-2 text-3xl font-bold">{m['pages.logIn.title']()}</h1>
			<p class="text-gray-300">{m['pages.logIn.subtitle']()}</p>
		</div>
		<div class="space-y-6">
			<!-- OTP Login Form -->
			<form onsubmit={handleSubmit} class="space-y-4">
				{#if message}
					<p class="text-sm font-medium text-red-500">{message}</p>
				{/if}
				<div class="space-y-2">
					<Label.Root for="email" class="text-sm font-medium text-gray-300">
						{m['common.form.fields.email.label']()}
					</Label.Root>
					<div class="relative">
						<Icon
							icon="tabler:mail"
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder={m['common.form.fields.email.placeholder']()}
							required
							disabled={isLoading}
							class="h-12 w-full rounded-lg border border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500" />
					</div>
				</div>
				<Button.Root
					type="submit"
					disabled={isLoading || !email}
					class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
					{#if isLoading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent">
						</div>
					{:else}
						{m['pages.logIn.sendOtp']()}
					{/if}
				</Button.Root>
			</form>
			<!-- Divider -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-background px-4 text-gray-400">
						{m['pages.logIn.or']()}
					</span>
				</div>
			</div>
			<!-- Google Login -->
			<Button.Root
				class="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-600 font-medium text-gray-300 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
				onclick={async () => {
					await authClient.signIn.social({
						provider: 'google',
						callbackURL: `${window.location.origin}/`
					});
				}}>
				<Icon icon="flat-color-icons:google" class="h-5 w-5" />
				{m['pages.logIn.continueWithGoogle']()}
			</Button.Root>
		</div>
	</div>
</div>
