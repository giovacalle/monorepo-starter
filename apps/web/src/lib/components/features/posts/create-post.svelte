<script lang="ts">
	import { Button, Card, Input, Textarea } from '$lib/components/ui';
	import { getAuthContext } from '$lib/context/auth.svelte';
	import { m } from '$lib/paraglide/messages';
	import { pb } from '$lib/pocketbase';
	import { toast } from 'svelte-sonner';

	let title = $state('');
	let content = $state('');
	let isExpanded = $state(false);
	const isValid = $derived(title.trim().length >= 10 && content.trim().length >= 10);

	const authCtx = getAuthContext();

	function handleFocus() {
		isExpanded = true;
	}

	function handleCancel() {
		title = '';
		content = '';
		isExpanded = false;
	}

	async function handleSubmit() {
		if (!isValid || !authCtx.user) return;

		try {
			await pb.collection('posts').create({
				author: authCtx.user.id,
				title: title.trim(),
				content: content.trim()
			});
			handleCancel();
		} catch {
			toast.error(m['pages.home.posts.createPost.errors.generic']());
		}
	}
</script>

<Card class="w-full max-w-2xl">
	<div class="flex gap-3">
		<div class="flex-1 space-y-3">
			{#if isExpanded}
				<Input
					placeholder={m['pages.home.posts.createPost.title']()}
					bind:value={title}
					class="text-lg font-medium" />
			{/if}

			<Textarea
				placeholder={isExpanded
					? m['pages.home.posts.createPost.placeholder']()
					: m['pages.home.posts.createPost.placeholderCollapsed']()}
				bind:value={content}
				rows={isExpanded ? 4 : 2}
				onfocus={handleFocus} />

			{#if isExpanded}
				<div class="border-border-card flex items-center justify-end gap-2 border-t pt-2">
					<Button variant="outline" size="sm" onclick={handleCancel}>Annulla</Button>
					<Button size="sm" disabled={!isValid} onclick={handleSubmit}>Pubblica</Button>
				</div>
			{/if}
		</div>
	</div>
</Card>
