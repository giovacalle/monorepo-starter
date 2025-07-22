<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import CreatePost from '$lib/components/features/posts/create-post.svelte';
	import { Button, Card } from '$lib/components/ui';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import PostCard from '$lib/components/features/posts/post-card.svelte';
	import { createGetApiV1Posts } from '@monorepo-starter/openapi-client';
	import { authClient } from '$lib/auth/client';

	let page = $state(1);
	let limit = $state(50);

	const session = authClient.useSession();

	// INFO: this is a workaround in order to use runes value
	const posts = $derived.by(() =>
		createGetApiV1Posts(
			{
				page,
				limit
			},
			{
				authorization: $session.data?.session.token
					? `Bearer ${$session.data.session.token}`
					: undefined
			},
			{
				query: {
					queryKey: ['posts-get']
				}
			}
		)
	);
</script>

<svelte:head>
	<title>Posts & Comments - {m['pages.home.meta.title']()}</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<!-- Header -->
	<Header />

	<!-- Main Content -->
	<main class="container mx-auto max-w-2xl px-4 py-6">
		<div class="space-y-6">
			<!-- Create Post Form  -->
			{#if $session.data}
				<CreatePost />
			{:else}
				<!-- Welcome message for non-logged users -->
				<Card class="w-full max-w-2xl text-center">
					<div class="py-8">
						<Icon
							icon="mdi:account-circle-outline"
							class="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
						<h2 class="text-foreground mb-2 text-xl font-semibold">
							{m['pages.home.welcome.title']()}
						</h2>
						<p class="text-muted-foreground mb-4">
							{m['pages.home.welcome.description']()}
						</p>
						<Button size="sm" href="/sign-in">
							<Icon icon="mdi:login" class="mr-2 h-4 w-4" />
							{m['common.signIn']()}
						</Button>
					</div>
				</Card>
			{/if}

			<!-- Posts Feed -->
			<div class="space-y-6">
				{#if $posts.isLoading}
					<div class="py-12 text-center">
						<Icon
							icon="mdi:loading"
							class="text-muted-foreground mx-auto mb-4 h-16 w-16 animate-spin" />
						<p class="text-muted-foreground">Loading posts...</p>
					</div>
				{:else if $posts.isError}
					<div class="py-12 text-center">
						<Icon
							icon="mdi:alert-circle-outline"
							class="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
						<span class="text-destructive">
							{m['pages.home.posts.errors.generic']()}
						</span>
					</div>
				{:else}
					{#each $posts.data?.data ?? [] as post (post.id)}
						<div class="space-y-4">
							<PostCard {...post} />
						</div>
					{/each}
				{/if}
			</div>

			<!-- Pagination (to be implemented) -->
				<!-- <div class="flex justify-center">
					<Button
						variant="outline"
						size="sm"
						onclick={() => {
							page += 1;
						}}>
						{m['common.loadMore']()}
					</Button>
				</div> -->

			<!-- Empty State -->
			{#if !$posts.isLoading && $posts.data?.data.length === 0}
				<div class="py-12 text-center">
					<Icon
						icon="mdi:post-outline"
						class="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
					<h2 class="text-foreground mb-2 text-xl font-semibold">
						{m['pages.home.posts.emptyState.title']()}
					</h2>
					<p class="text-muted-foreground mb-4">
						{m['pages.home.posts.emptyState.description']()}
					</p>
				</div>
			{/if}
		</div>
	</main>
</div>
