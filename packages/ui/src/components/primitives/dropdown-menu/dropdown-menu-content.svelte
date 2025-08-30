<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '../../../lib/utils';

	interface Props extends DropdownMenuPrimitive.ContentProps {}

	let {
		ref = $bindable(null),
		class: className = '',
		sideOffset = 4,
		side = 'bottom',
		align = 'start',
		alignOffset = 0,
		children,
		...restProps
	}: Props & Record<string, any> = $props();
</script>

<DropdownMenuPrimitive.Content
	bind:ref
	class={cn(
		'bg-background-alt text-foreground shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1',
		className
	)}
	{sideOffset}
	{side}
	{align}
	{alignOffset}
	{...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Content>
