<script lang="ts">
	import { Card, Button } from '$lib/components/ui';
	import Header from '$lib/components/layout/header.svelte';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { verifyOtpSchema, type VerifyOtpForm } from './form-schema';
	import { PinInput, REGEXP_ONLY_DIGITS, type PinInputRootSnippetProps } from 'bits-ui';
	import { cn } from '$lib/utils/styles';
	import { useCountdownTimer } from '$lib/hooks/useCountdownTimer.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { authClient } from '$lib/auth/client';

	const email = $state<string>(page.state.email ?? '');
	const timer = useCountdownTimer(180);

	// return to sign-in if email is not provided
	onMount(() => {
		if (!email) {
			goto('/sign-in');
		}
		timer.startTimer();
	});

	const { form, errors, enhance, submitting } = superForm<VerifyOtpForm>(
		{ otp: '' },
		{
			SPA: true,
			validators: valibot(verifyOtpSchema),
			onUpdated: async ({ form }) => {
				if (!form.valid) return;

				await authClient.signIn.emailOtp({
					email,
					otp: form.data.otp,
					fetchOptions: {
						onError: () => {
							toast.error(m['pages.verifyOtp.errors.verification']());
						},
						onSuccess: () => {
							goto('/');
						}
					}
				});
			}
		}
	);

	async function handleResendOtp() {
		await authClient.emailOtp.sendVerificationOtp({
			email,
			type: 'sign-in',
			fetchOptions: {
				onError: () => {
					toast.error(m['pages.verifyOtp.resend.error']());
				},
				onSuccess: () => {
					toast.success(m['pages.verifyOtp.resend.success']());
					timer.startTimer();
				}
			}
		});
	}
</script>

<svelte:head>
	<title>Posts & Comments - {m['pages.verifyOtp.meta.title']()}</title>
</svelte:head>

<Header hideLoginButton />
<main class="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
	<Card class="w-full max-w-md space-y-6">
		<!-- Card Header -->
		<div class="space-y-2 text-center">
			<Icon icon="mdi:email-check-outline" class="text-primary mx-auto h-12 w-12" />
			<h1 class="text-2xl font-bold">{m['pages.verifyOtp.title']()}</h1>
			<p class="text-muted-foreground">
				{m['pages.verifyOtp.subtitle']({ email })}
			</p>

			<!-- Timer -->
			<div class="text-muted-foreground flex items-center justify-center gap-2 pt-2">
				<Icon icon="mdi:timer-outline" class="h-4 w-4" />
				<span class={cn('font-mono text-sm', timer.isWarning && 'text-destructive')}>
					{timer.formattedTime}
				</span>
			</div>
		</div>

		<!-- OTP Verification Form -->
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="otp" bind:value={$form.otp} />
			<div class="space-y-4">
				<div class="space-y-2">
					<PinInput.Root
						bind:value={$form.otp}
						class="group/pininput text-foreground flex items-center justify-center has-disabled:opacity-30"
						maxlength={8}
						pattern={REGEXP_ONLY_DIGITS}>
						{#snippet children({ cells })}
							<div class="flex">
								{#each cells.slice(0, 4) as cell, i (i)}
									{@render Cell(cell)}
								{/each}
							</div>

							<!-- Divider -->
							<div class="flex w-10 items-center justify-center">
								<div class="bg-border h-1 w-3 rounded-full"></div>
							</div>

							<div class="flex">
								{#each cells.slice(4, 8) as cell, i (i)}
									{@render Cell(cell)}
								{/each}
							</div>
						{/snippet}
					</PinInput.Root>
					{#if $errors.otp}
						<p class="text-destructive text-center text-sm">{$errors.otp[0]}</p>
					{/if}
				</div>

				<Button type="submit" class="w-full" disabled={$submitting || !$form.otp}>
					{#if $submitting}
						<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
						{m['common.form.submitting']()}
					{:else}
						<Icon icon="mdi:check-circle-outline" class="mr-2 h-4 w-4" />
						{m['pages.verifyOtp.submit']()}
					{/if}
				</Button>
			</div>
		</form>

		<!-- Resend Section -->
		<div class="flex items-center justify-center gap-1">
			<p class="text-muted-foreground text-sm">{m['pages.verifyOtp.resend.label']()}</p>
			<Button
				variant="ghost"
				size="sm"
				onclick={handleResendOtp}
				disabled={$submitting || timer.isActive}>
				<Icon icon="mdi:refresh" class="mr-2 h-4 w-4" />
				{m['pages.verifyOtp.resend.action']({
					time: timer.isActive ? `in ${timer.formattedTime}` : ''
				})}
			</Button>
		</div>

		<!-- Back to Sign In -->
		<div class="text-center">
			<Button variant="link" size="sm" href="/sign-in">
				<Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
				{m['pages.verifyOtp.backToSignIn']()}
			</Button>
		</div>
	</Card>
</main>

{#snippet Cell(cell: PinInputRootSnippetProps['cells'][0])}
	<PinInput.Cell
		{cell}
		class={cn(
			'focus-override',
			'relative h-14 w-10 text-3xl',
			'flex items-center justify-center',
			'transition-all duration-75',
			'border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md',
			'text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40',
			'outline-0',
			'data-active:outline-contrast data-active:outline-1'
		)}>
		{#if cell.char !== null}
			<div>
				{cell.char}
			</div>
		{/if}
		{#if cell.hasFakeCaret}
			<div
				class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="bg-contrast h-8 w-px"></div>
			</div>
		{/if}
	</PinInput.Cell>
{/snippet}
