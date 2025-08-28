<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '../../lib/utils';

	interface Props extends DropdownMenuPrimitive.ItemProps {}

	let {
		ref = $bindable(null),
		class: className = '',
		children,
		...restProps
	}: Props & Record<string, any> = $props();
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	class={cn(
		'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Item>
