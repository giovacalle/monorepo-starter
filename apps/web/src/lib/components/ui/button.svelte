<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styles';

	type Props = ButtonPrimitive.RootProps & {
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
	};

	let {
		ref = $bindable(null),
		class: className = '',
		variant = 'default',
		size = 'default',
		children,
		...restProps
	}: Props = $props();

	const variants = {
		default: 'bg-foreground text-background hover:bg-foreground/90',
		destructive: 'bg-destructive text-contrast hover:bg-destructive/90',
		outline: 'border border-border-input bg-background hover:bg-muted hover:text-accent-foreground',
		secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		link: 'text-foreground underline-offset-4 hover:underline'
	};

	const sizes = {
		default: 'px-4 py-2',
		sm: 'rounded-md p-2',
		lg: 'rounded-md px-8',
		icon: 'h-10 w-10'
	};
</script>

<ButtonPrimitive.Root
	bind:ref
	class={cn(
		'ring-offset-background focus-visible:ring-foreground inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		variants[variant],
		sizes[size],
		className
	)}
	{...restProps}>
	{@render children?.()}
</ButtonPrimitive.Root>
