<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import LanguageSwitcher from '$lib/components/features/settings/language-switcher.svelte';
	import { setAuthContext } from '$lib/context/auth.svelte';
	import type { LayoutProps } from './$types';
	import '../app.css';

	let { children }: LayoutProps = $props();

	setAuthContext();
</script>

<ModeWatcher />
<Toaster richColors position="top-center" />
<div class="bg-background text-foreground min-h-screen">
	{@render children?.()}
</div>
<LanguageSwitcher />
