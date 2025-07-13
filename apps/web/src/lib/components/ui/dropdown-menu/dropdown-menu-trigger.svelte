<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styles';

	interface Props extends DropdownMenuPrimitive.TriggerProps {}

	let { class: className = '', ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Trigger
	bind:ref
	class={cn(
		'ring-offset-background focus-visible:ring-foreground hover:bg-muted inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Trigger>
