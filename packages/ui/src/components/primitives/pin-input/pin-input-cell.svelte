<script lang="ts">
	import { PinInput } from 'bits-ui';
	import { cn } from '../../../lib/utils';

	interface Props extends PinInput.CellProps {}

	let { class: className = '', cell, children, ...restProps }: Props = $props();
</script>

<PinInput.Cell
	{cell}
	class={cn(
		'focus-override',
		'relative h-14 w-10 text-3xl',
		'flex items-center justify-center',
		'transition-all duration-75',
		'border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md',
		'text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40',
		'outline-0',
		'data-active:outline-contrast data-active:outline-1',
		className
	)}
	{...restProps}>
	{@render children?.()}
</PinInput.Cell>
