<script lang="ts">
	import { cn } from '$lib/utils/styles';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class={cn('bg-background-alt shadow-card rounded-lg border p-6', className)}>
	{@render children?.()}
</div>
