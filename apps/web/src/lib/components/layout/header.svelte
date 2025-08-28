<script lang="ts">
	import { Avatar, Button, DropdownMenu } from '@monorepo-starter/ui';
	import Icon from '@iconify/svelte';
	import { toggleMode } from 'mode-watcher';
	import { m } from '$lib/paraglide/messages';
	import { authClient } from '$lib/auth/client';

	interface Props {
		hideLoginButton?: boolean;
	}

	let { hideLoginButton = false }: Props = $props();

	const session = authClient.useSession();
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
	<div class="container mx-auto flex items-center p-2">
		<!-- Title -->
		<div class="flex items-center gap-3">
			<Icon icon="mdi:post-outline" class="text-foreground h-6 w-6" />
			<a href="/" class="text-lg font-semibold hover:underline">Posts & Comments</a>
		</div>

		<!-- Actions -->
		<div class="ml-auto flex items-center gap-2">
			<!-- Theme Toggle -->
			<Button
				variant="ghost"
				size="icon"
				class="h-9 w-9"
				onclick={toggleMode}
				title={m['common.toggleTheme']()}
				aria-label={m['common.toggleTheme']()}>
				<Icon
					icon="lucide:sun"
					class="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Icon
					icon="lucide:moon"
					class="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			</Button>

			<!-- User Button / Login -->
			{#if $session.data}
				<!-- User Menu -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="h-9 gap-2 p-1">
						<Avatar
							src={$session.data.user.image ?? undefined}
							alt={$session.data.user.username}
							fallback={$session.data.user.username.charAt(0).toUpperCase()}
							size="sm"
							class="h-6 w-6" />
						<span class="hidden font-medium sm:inline">{$session.data.user.username}</span>
						<Icon icon="lucide:chevron-down" class="h-3 w-3 opacity-50" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-40">
						<DropdownMenu.Item
							onclick={async () => {
								await authClient.signOut();
							}}>
							<Icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
							{m['common.signOut']()}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else if !hideLoginButton}
				<!-- Login Button -->
				<Button size="sm" href="/sign-in">
					<Icon icon="mdi:login" class="mr-2 h-4 w-4" />
					{m['common.signIn']()}
				</Button>
			{/if}
		</div>
	</div>
</header>
