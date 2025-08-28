<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '../lib/utils';

	interface Props extends HTMLTextareaAttributes {}

	let { value = $bindable(''), class: className = '', rows = 3, ...restProps }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'border-border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-foreground flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{rows}
	{...restProps}></textarea>
