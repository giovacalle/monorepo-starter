<script lang="ts">
	import { PinInput } from 'bits-ui';
	import { cn } from '../../lib/utils';

	interface Props extends PinInput.RootProps {}

	let { class: className = '', value = $bindable(''), children, ...restProps }: Props = $props();
</script>

<PinInput.Root
	bind:value
	class={cn(
		'group/pininput text-foreground has-disabled:opacity-30 flex items-center justify-center',
		className
	)}
	{...restProps}>
	{#snippet children(props)}
		{@render children?.(props)}
	{/snippet}
</PinInput.Root>
