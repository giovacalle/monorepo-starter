<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '../../../lib/utils';

	interface Props extends DropdownMenuPrimitive.TriggerProps {}

	let { class: className = '', ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Trigger
	bind:ref
	class={cn(
		'ring-offset-background focus-visible:ring-foreground hover:bg-muted inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Trigger>
