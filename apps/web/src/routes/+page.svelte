<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import CreatePost from '$lib/components/features/posts/create-post.svelte';
	import { Button, Card } from '$lib/components/ui';
	import Icon from '@iconify/svelte';
	import { getAuthContext } from '$lib/context/auth.svelte';
	import { m } from '$lib/paraglide/messages';
	import { pb } from '$lib/pocketbase';
	import type { PostWithExpand } from '$lib/pocketbase/types';
	import PostCard from '$lib/components/features/posts/post-card.svelte';

	let page = $state(1);
	let perPage = $state(50);
	let posts = $state<PostWithExpand[]>([]);

	$effect(() => {
		const fetchPosts = async () => {
			return await pb.collection('posts').getList<PostWithExpand>(page, perPage, {
				expand: 'posts_details_via_post,posts_likes_via_post',
				fields: 'id,title,content,expand.posts_details_via_post.*,expand.posts_likes_via_post.id'
			});
		};

		fetchPosts()
			.then((res) => {
				posts = [...res.items];
			})
			.catch((error) => {
				console.log('error fetching posts:', error);
			});
	});

	$effect(() => {
		pb.collection('posts').subscribe<PostWithExpand>(
			'*',
			(e) => {
				if (e.action === 'create') {
					posts = [e.record, ...posts];
				} else if (e.action === 'update') {
					posts = posts.map((post) => (post.id === e.record.id ? e.record : post));
				} else if (e.action === 'delete') {
					posts = posts.filter((post) => post.id !== e.record.id);
				}
			},
			{
				expand: 'posts_details_via_post,posts_likes_via_post',
				fields: 'id,title,content,expand.posts_details_via_post.*,expand.posts_likes_via_post.id'
			}
		);

		return () => {
			pb.collection('posts').unsubscribe('*');
		};
	});

	const authCtx = getAuthContext();
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
			{#if authCtx.user}
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
				{#each posts as post (post.id)}
					<div class="space-y-4">
						<PostCard
							id={post.id}
							title={post.title}
							content={post.content}
							author={{
								...post.expand.posts_details_via_post[0]
							}}
							likes={post.expand.posts_details_via_post[0].likes}
							postLikeId={post.expand['posts_likes_via_post']?.[0].id} />
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if posts.length >= perPage}
				<div class="flex justify-center">
					<Button
						variant="outline"
						size="sm"
						onclick={() => {
							page += 1;
						}}>
						{m['common.loadMore']()}
					</Button>
				</div>
			{/if}

			<!-- Empty State -->
			{#if posts.length === 0}
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
