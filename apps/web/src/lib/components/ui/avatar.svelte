<script lang="ts">
	import { cn } from '$lib/utils/styles';
	import { Avatar, type WithoutChildrenOrChild } from 'bits-ui';

	interface Props extends WithoutChildrenOrChild<Avatar.RootProps> {
		size?: 'sm' | 'md' | 'lg';
		src?: string;
		alt?: string;
		fallback?: string;
		imageRef?: HTMLImageElement | null;
		fallbackRef?: HTMLElement | null;
	}

	let {
		class: className = '',
		size = 'md',
		src,
		alt = '',
		fallback = '?',
		ref = $bindable(null),
		imageRef = $bindable(null),
		fallbackRef = $bindable(null),
		...restProps
	}: Props = $props();

	const sizes = {
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-12 w-12 text-base'
	};
</script>

<Avatar.Root
	class={cn(
		'bg-muted text-muted-foreground data-[status=loaded]:border-foreground/20 relative flex shrink-0 overflow-hidden rounded-full border font-medium transition-colors',
		sizes[size],
		className
	)}
	{...restProps}
	bind:ref>
	<div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
		{#if src}
			<Avatar.Image
				{src}
				{alt}
				bind:ref={imageRef}
				class="data-[status=loading]:bg-muted-foreground aspect-square h-full w-full object-cover data-[status=loading]:animate-pulse" />
		{/if}
		<Avatar.Fallback
			bind:ref={fallbackRef}
			class="text-muted-foreground flex h-full w-full items-center justify-center">
			{fallback}
		</Avatar.Fallback>
	</div>
</Avatar.Root>
