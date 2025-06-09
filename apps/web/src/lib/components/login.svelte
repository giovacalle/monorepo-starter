<script lang="ts">
	import { Button } from 'bits-ui';
	import { authClient } from '$lib/auth/client';
	import { m } from '$lib/paraglide/messages.js';

	const {
		isAuthenticated
	}: {
		isAuthenticated: boolean;
	} = $props();
</script>

{#if isAuthenticated}
	<Button.Root
		aria-label="Sign out"
		onclick={async () => {
			await authClient.signOut({
				fetchOptions: {
					onError: () => {
						window.location.replace('/');
					},
					onSuccess: () => {
						window.location.replace('/login');
					}
				}
			});
		}}
		class="font-medium">
		{m['common.logOut']()}
	</Button.Root>
{:else}
	<Button.Root href="/login" aria-label="Sign in" class="font-medium">
		{m['common.logIn']()}
	</Button.Root>
{/if}
