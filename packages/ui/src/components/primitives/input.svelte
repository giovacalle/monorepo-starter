<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '../../lib/utils';

	interface Props extends HTMLInputAttributes {}

	let {
		type = 'text',
		value = $bindable(''),
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<input
	{type}
	bind:value
	class={cn(
		'border-border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-foreground aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps} />
