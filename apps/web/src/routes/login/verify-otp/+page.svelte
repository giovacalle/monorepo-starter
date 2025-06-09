<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth/client';
	import { goto } from '$app/navigation';
	import { siteConfig } from '$lib/config/site';
	import { PinInput, REGEXP_ONLY_DIGITS, Button } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/styles';
	import { m } from '$lib/paraglide/messages.js';

	const { email } = page.state as { email: string };
	let otp = $state('');
	let isLoading = $state(false);
	let message = $state('');

	// nice try, but we need a valid email to proceed
	onMount(() => {
		if (!email) {
			goto('/login');
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!otp || !otp.match(REGEXP_ONLY_DIGITS)) {
			message = m['pages.verifyOtp.errors.otpFormat']();
			return;
		}

		isLoading = true;
		message = '';

		try {
			await authClient.signIn.emailOtp({
				email,
				otp,
				fetchOptions: {
					onError: ({ error }) => {
						message = error.message ?? m['pages.verifyOtp.errors.sendVerify']();
					},
					onSuccess: () => {
						window.location.replace('/');
					}
				}
			});
		} catch (error) {
			message = m['pages.verifyOtp.errors.sendVerify']();
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{siteConfig.name} - Verify OTP</title>
</svelte:head>

<div class="flex min-h-[85vh] w-screen items-center justify-center text-white">
	<div class="h-max w-full max-w-md rounded-lg border p-8">
		<div class="mb-8 text-center">
			<div
				class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
				<Icon icon="tabler:user" class="h-8 w-8 text-white" />
			</div>
			<h1 class="mb-2 text-3xl font-bold">{m['pages.verifyOtp.title']()}</h1>
			<p class="text-gray-300">{m['pages.verifyOtp.subtitle']()}il</p>
		</div>
		<div class="space-y-6">
			<!-- OTP Login Form -->
			<form onsubmit={handleSubmit} class="space-y-4">
				{#if message}
					<p class="text-sm font-medium text-red-500">{message}</p>
				{/if}
				<div class="space-y-2">
					<PinInput.Root
						bind:value={otp}
						class="group/pininput text-foreground flex items-center justify-center has-disabled:opacity-30"
						maxlength={6}
						pattern={REGEXP_ONLY_DIGITS}
						pasteTransformer={(text) => text.replace(/-/g, '')}>
						{#snippet children({ cells })}
							<div class="flex">
								{#each cells as cell}
									<PinInput.Cell
										{cell}
										class={cn(
											'focus-override',
											'relative h-14 w-10 text-[2rem]',
											'flex items-center justify-center',
											'transition-all duration-75',
											'border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md',
											'text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40',
											'outline-0',
											'data-active:outline-1 data-active:outline-white'
										)}>
										{#if cell.char !== null}
											<div>
												{cell.char}
											</div>
										{/if}
									</PinInput.Cell>
								{/each}
							</div>
						{/snippet}
					</PinInput.Root>
				</div>
				<Button.Root
					type="submit"
					disabled={isLoading || !otp}
					class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
					{#if isLoading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent">
						</div>
					{:else}
						{m['pages.verifyOtp.verify']()}
						<Icon icon="tabler:check-circle" class="h-4 w-4" />
					{/if}
				</Button.Root>
			</form>
		</div>
	</div>
</div>
