<script lang="ts">
	import { Button, Card, Input, Label, Textarea } from '$lib/components/ui';
	import { m } from '$lib/paraglide/messages';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { createPostSchema, type CreatePostForm } from './form-schema';
	import Icon from '@iconify/svelte';
	import { createPostApiV1Posts } from '@monorepo-starter/openapi-client';
	import { authClient } from '$lib/auth/client';
	import { toast } from 'svelte-sonner';
	import { useQueryClient } from '@tanstack/svelte-query';

	let isExpanded = $state(false);

	const queryClient = useQueryClient();
	const newPost = createPostApiV1Posts({
		mutation: {
			onError: () => {
				toast.error(m['pages.home.posts.createPost.errors.generic']());
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['posts-get'] });
				toast.success(m['pages.home.posts.createPost.success']());
			}
		}
	});

	const session = authClient.useSession();
	const { form, errors, enhance, submitting } = superForm<CreatePostForm>(
		{ title: '', content: '' },
		{
			invalidateAll: false,
			SPA: true,
			validators: valibot(createPostSchema),
			onUpdate: ({ form }) => {
				if (!form.valid) return;

				isExpanded = false;

				$newPost.mutateAsync({
					data: form.data,
					headers: {
						authorization: `Bearer ${$session.data!.session.token}`
					}
				});
			}
		}
	);

	function handleCancel() {
		$form.title = '';
		$form.content = '';
		isExpanded = false;
	}
</script>

<Card class="w-full max-w-2xl">
	<form method="POST" use:enhance>
		<div class="flex gap-3">
			<div class="flex-1 space-y-3">
				{#if isExpanded}
					<div class="space-y-1">
						<Label for="title">
							{m['common.form.fields.title.label']()}
						</Label>
						<Input
							id="title"
							name="title"
							placeholder={m['common.form.fields.title.placeholder']()}
							bind:value={$form.title}
							class="text-lg font-medium"
							aria-invalid={$errors.title ? 'true' : undefined} />
						{#if $errors.title}
							<p class="text-destructive text-sm">{$errors.title}</p>
						{/if}
					</div>
				{/if}

				<div class="space-y-1">
					{#if isExpanded}
						<Label for="content">
							{m['common.form.fields.content.label']()}
						</Label>
					{/if}
					<Textarea
						id="content"
						name="content"
						placeholder={isExpanded
							? m['common.form.fields.content.placeholder']()
							: m['pages.home.posts.createPost.placeholderCollapsed']()}
						bind:value={$form.content}
						rows={isExpanded ? 4 : 2}
						onfocus={() => (isExpanded = true)}
						aria-invalid={$errors.content ? 'true' : undefined} />
					{#if isExpanded && $errors.content}
						<p class="text-destructive text-sm">{$errors.content}</p>
					{/if}
				</div>

				{#if isExpanded}
					<div class="border-border-card flex items-center justify-end gap-2 border-t pt-2">
						<Button type="button" variant="outline" size="sm" onclick={handleCancel}>
							{m['common.form.cancel']()}
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={$submitting || $newPost.isPending || !$form.title || !$form.content}>
							{#if $submitting}
								<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
								{m['common.form.submitting']()}
							{:else}
								<Icon icon="mdi:send" class="mr-2 h-4 w-4" />
								{m['pages.home.posts.createPost.submit']()}
							{/if}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</form>
</Card>
