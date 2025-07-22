<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styles';

	interface Props extends SelectPrimitive.ViewportProps {}

	let { ref = $bindable(null), class: className = '', children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Viewport bind:ref class={cn('p-1', className)} {...restProps}>
	{@render children?.()}
</SelectPrimitive.Viewport>
