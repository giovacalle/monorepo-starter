<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../lib/utils';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class={cn('bg-background-alt shadow-card rounded-lg border p-6', className)}>
	{@render children?.()}
</div>
