<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import CreatePost from '$lib/components/features/posts/create-post.svelte';
	import { Button, Card } from '@monorepo-starter/ui';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import PostCard from '$lib/components/features/posts/post-card.svelte';
	import {
		createGetApiV1PostsInfinite,
		getGetApiV1PostsQueryKey
	} from '@monorepo-starter/openapi-client';
	import { authClient } from '$lib/auth/client';

	const session = authClient.useSession();

	const posts = $derived.by(() =>
		createGetApiV1PostsInfinite(
			{
				limit: 50
			},
			{
				authorization: $session.data?.session.token
					? `Bearer ${$session.data.session.token}`
					: undefined
			},
			{
				query: {
					queryKey: getGetApiV1PostsQueryKey(),
					select: (data) => data.pages.flatMap((page) => page.data),
					getNextPageParam: (lastPage, allPages) => {
						const morePagesExist = lastPage.data.length === 50;
						if (!morePagesExist) return undefined;
						return allPages.length + 1;
					}
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
					{#each $posts.data ?? [] as post (post.id)}
						<div class="space-y-4">
							<PostCard {...post} />
						</div>
					{/each}
				{/if}
			</div>

			<!-- Pagination (to be implemented) -->
			{#if $posts.hasNextPage && !$posts.isLoading && !$posts.isError}
				<div class="flex justify-center">
					<Button variant="outline" size="sm" onclick={() => $posts.fetchNextPage()}>
						{m['common.loadMore']()}
					</Button>
				</div>
			{/if}

			<!-- Empty State -->
			{#if !$posts.isLoading && $posts.data?.length === 0}
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
