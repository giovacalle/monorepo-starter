<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props extends DropdownMenuPrimitive.RootProps {}

	let { open = $bindable(false), onOpenChange, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {onOpenChange} {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Root>
