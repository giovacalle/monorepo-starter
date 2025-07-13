<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styles';

	interface Props extends SelectPrimitive.TriggerProps {}

	let { ref = $bindable(null), class: className = '', children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'ring-offset-background focus-visible:ring-foreground hover:bg-muted inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}>
	{@render children?.()}
</SelectPrimitive.Trigger>
