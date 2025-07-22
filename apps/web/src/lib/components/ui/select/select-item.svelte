<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styles';

	interface Props extends SelectPrimitive.ItemProps {}

	let { ref = $bindable(null), class: className = '', children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	class={cn(
		'focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-muted relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}>
	{#snippet children(snippetProps)}
		{@render children?.(snippetProps)}
	{/snippet}
</SelectPrimitive.Item>
