<script lang="ts">
	import { Avatar, Button, Card } from '$lib/components/ui';
	import { getAuthContext } from '$lib/context/auth.svelte';
	import { pb } from '$lib/pocketbase';
	import { cn } from '$lib/utils/styles';
	import Icon from '@iconify/svelte';

	interface Props {
		id: string;
		title: string;
		content: string;
		author: {
			avatar: string;
			avatarURL: string;
			username: string;
		};
		likes: number;
		postLikeId?: string;
	}

	let { id, title, content, author, likes, postLikeId }: Props = $props();

	let likeId = $state(postLikeId);
	let liked = $derived(!!likeId);
	let likesCount = $derived(likes + (liked ? 1 : 0));

	const authCtx = getAuthContext();

	async function handleLike() {
		if (!authCtx.user) return;

		if (liked) {
			await pb.collection('posts_likes').delete(likeId!);
			likeId = '';
		} else {
			const res = await pb.collection('posts_likes').create({
				author: authCtx.user.id,
				post: id
			});
			likeId = res.id;
		}
	}
</script>

<Card class="w-full max-w-2xl">
	<!-- Author -->
	<div class="mb-4 flex items-center gap-3">
		<Avatar
			src={author.avatar ? pb.files.getURL(author, author.avatar) : author.avatarURL}
			alt={author.username}
			fallback={author.username.charAt(0).toUpperCase()} />
		<div class="flex-1">
			<div class="flex items-center justify-between gap-2">
				<h3 class="text-foreground font-semibold">{author.username}</h3>
				{#if authCtx.user && authCtx.user.username === author.username}
					<Button
						variant="destructive"
						size="sm"
						class="text-white"
						onclick={() => {
							pb.collection('posts').delete(id);
						}}>
						<Icon icon="mdi:delete" class="h-4 w-4" />
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="mb-4">
		<h2 class="text-foreground mb-2 text-lg font-semibold">{title}</h2>
		<p class="text-foreground-alt leading-relaxed">{content}</p>
	</div>

	<!-- Actions -->
	<div class="border-border-card flex items-center gap-4 border-t pt-3">
		<Button
			variant="ghost"
			size="sm"
			class={cn(
				'text-muted-foreground gap-2',
				liked && 'text-destructive',
				!authCtx.user && 'cursor-not-allowed'
			)}
			onclick={handleLike}>
			<Icon icon={liked ? 'mdi:heart' : 'mdi:heart-outline'} class="h-4 w-4" />
			{likesCount > 0 ? likesCount : ''}
		</Button>
	</div>
</Card>
