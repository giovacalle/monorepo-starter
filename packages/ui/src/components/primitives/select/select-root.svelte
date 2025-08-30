<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';

	type Props = SelectPrimitive.RootProps;

	let { value = $bindable(), open = $bindable(false), children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Root bind:value={value as never} bind:open {...restProps}>
	{@render children?.()}
</SelectPrimitive.Root>
