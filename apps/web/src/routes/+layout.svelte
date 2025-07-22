<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import LanguageSwitcher from '$lib/components/features/settings/language-switcher.svelte';
	import type { LayoutProps } from './$types';
	import '../app.css';

	let { data, children }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<Toaster richColors position="top-center" />
	<div class="bg-background text-foreground min-h-screen">
		{@render children?.()}
	</div>
	<LanguageSwitcher />
</QueryClientProvider>
