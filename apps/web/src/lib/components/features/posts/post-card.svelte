<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import { Avatar, Button, Card } from '@monorepo-starter/ui';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils/styles';
	import Icon from '@iconify/svelte';
	import {
		createDeleteApiV1PostsById,
		createDeleteApiV1PostsVotesByPostId,
		createPostApiV1PostsVotes,
		getGetApiV1PostsQueryKey,
		type GetApiV1Posts200Item
	} from '@monorepo-starter/openapi-client';
	import { useQueryClient } from '@tanstack/svelte-query';

	let {
		id,
		title,
		content,
		author,
		createdAt,
		upvotesCount,
		downvotesCount,
		userVote
	}: GetApiV1Posts200Item = $props();

	let userVoteState = $state(userVote);
	let upvotesCountState = $state(upvotesCount);
	let downvotesCountState = $state(downvotesCount);

	const session = authClient.useSession();
	const queryClient = useQueryClient();

	const deletePost = createDeleteApiV1PostsById({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetApiV1PostsQueryKey() });
			}
		}
	});

	const votePost = createPostApiV1PostsVotes({
		mutation: {
			onSuccess: (res) => {
				userVoteState = res.data.vote;
				if (res.data.vote === 1) {
					upvotesCountState += 1;
					downvotesCountState = Math.max(downvotesCountState - 1, 0);
				} else {
					downvotesCountState += 1;
					upvotesCountState = Math.max(upvotesCountState - 1, 0);
				}
			}
		}
	});

	const deleteVotePost = createDeleteApiV1PostsVotesByPostId({
		mutation: {
			onSuccess: () => {
				userVoteState = undefined;
			}
		}
	});

	async function handleVote(vote: 'upvote' | 'downvote') {
		if (!$session.data) return;

		if (
			(userVoteState === -1 && vote === 'downvote') ||
			(userVoteState === 1 && vote === 'upvote')
		) {
			await $deleteVotePost.mutateAsync({
				postId: id,
				headers: {
					authorization: `Bearer ${$session.data!.session.token}`
				}
			});
			return;
		}

		$votePost.mutateAsync({
			data: {
				postId: id,
				vote
			},
			headers: {
				authorization: `Bearer ${$session.data!.session.token}`
			}
		});
	}
</script>

<Card class="w-full max-w-2xl">
	<!-- Author -->
	<div class="mb-4 flex items-center gap-3">
		<Avatar
			src={author.image ?? undefined}
			alt={author.username}
			fallback={author.username.charAt(0).toUpperCase()} />
		<div class="flex-1">
			<div class="flex items-center justify-between gap-2">
				<div>
					<h3 class="text-foreground font-semibold">{author.username}</h3>
					<p class="text-muted-foreground text-sm">{new Date(createdAt).toLocaleString()}</p>
				</div>
				{#if $session.data?.user.username === author.username}
					<Button
						variant="destructive"
						size="sm"
						class="text-white"
						onclick={() => {
							$deletePost.mutateAsync({
								id,
								headers: {
									authorization: `Bearer ${$session.data!.session.token}`
								}
							});
						}}
						disabled={$deletePost.isPending}>
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
				'text-muted-foreground gap-1',
				userVoteState === 1 && 'text-green-600',
				!$session.data && 'cursor-not-allowed'
			)}
			disabled={!$session.data || $deletePost.isPending || $votePost.isPending}
			onclick={() => handleVote('upvote')}>
			<Icon
				icon={userVoteState === 1 ? 'mdi:arrow-up-bold' : 'mdi:arrow-up-bold-outline'}
				class="h-4 w-4" />
			{upvotesCountState}
		</Button>
		<Button
			variant="ghost"
			size="sm"
			class={cn(
				'text-muted-foreground gap-1',
				userVoteState === -1 && 'text-red-600',
				!$session.data && 'cursor-not-allowed'
			)}
			disabled={!$session.data || $deletePost.isPending || $votePost.isPending}
			onclick={() => handleVote('downvote')}>
			<Icon
				icon={userVoteState === -1 ? 'mdi:arrow-down-bold' : 'mdi:arrow-down-bold-outline'}
				class="h-4 w-4" />
			{downvotesCountState}
		</Button>
	</div>
</Card>
