<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import LanguageSwitcher from '$lib/components/features/settings/language-switcher.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<SvelteQueryDevtools />
	<ModeWatcher />
	<Toaster richColors position="top-center" />
	<div class="bg-background text-foreground min-h-screen">
		{@render children?.()}
	</div>
	<LanguageSwitcher />
</QueryClientProvider>
