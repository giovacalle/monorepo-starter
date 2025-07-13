<script lang="ts">
	import { Card, Button, Label, Input } from '$lib/components/ui';
	import Header from '$lib/components/layout/header.svelte';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInForm } from './form-schema';
	import { toast } from 'svelte-sonner';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { createUser } from '$lib/pocketbase/users';
	import { getLocale } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';

	// return to home if user is already authenticated
	onMount(() => {
		if (pb.authStore.isValid) {
			goto('/');
		}
	});

	const { form, errors, enhance, submitting } = superForm<SignInForm>(
		{ email: '' },
		{
			SPA: true,
			validators: valibot(signInSchema),
			onUpdated: async ({ form }) => {
				if (!form.valid) return;

				try {
					await createUser(form.data.email);
					const result = await pb.collection('users').requestOTP(form.data.email);

					goto('/sign-in/verify-otp', {
						state: {
							email: form.data.email,
							otpId: result.otpId
						}
					});
				} catch {
					toast.error(m['pages.signIn.errors.otp']());
				}
			}
		}
	);

	async function handleGoogleLogin() {
		try {
			await pb.collection('users').authWithOAuth2({
				provider: 'google',
				createData: {
					lang: getLocale()
				}
			});
			goto('/');
		} catch {
			toast.error(m['pages.signIn.errors.google']());
		}
	}
</script>

<svelte:head>
	<title>Posts & Comments - {m['pages.signIn.meta.title']()}</title>
</svelte:head>

<Header hideLoginButton />
<main class="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
	<Card class="w-full max-w-md space-y-6">
		<!-- Card Header -->
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold">{m['pages.signIn.title']()}</h1>
			<p class="text-muted-foreground">{m['pages.signIn.subtitle']()}</p>
		</div>

		<!-- OTP Email Form -->
		<form method="POST" use:enhance class="space-y-4">
			<div class="space-y-2">
				<Label for="email">
					{m['common.form.fields.email.label']()}
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					placeholder={m['common.form.fields.email.placeholder']()}
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email} />
				{#if $errors.email}
					<p class="text-destructive text-sm">{$errors.email[0]}</p>
				{/if}
			</div>

			<Button type="submit" class="w-full" disabled={$submitting || !$form.email}>
				{#if $submitting}
					<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
					{m['common.form.sending']()}
				{:else}
					<Icon icon="mdi:email-outline" class="mr-2 h-4 w-4" />
					{m['pages.signIn.submit']()}
				{/if}
			</Button>
		</form>

		<!-- Divider -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="border-border w-full border-t"></span>
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="text-muted-foreground bg-background-alt px-2">
					{m['pages.signIn.or']()}
				</span>
			</div>
		</div>

		<!-- Google Login -->
		<Button variant="outline" class="w-full" onclick={handleGoogleLogin}>
			<Icon icon="flat-color-icons:google" class="mr-2 h-4 w-4" />
			{m['pages.signIn.continueWithGoogle']()}
		</Button>
	</Card>
</main>
