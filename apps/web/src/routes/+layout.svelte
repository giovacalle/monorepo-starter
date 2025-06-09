<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import Icon from '@iconify/svelte';
	import { siteConfig } from '$lib/config/site';
	import Login from '$lib/components/login.svelte';
	import LanguageSelector from '$lib/components/language-selector.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{siteConfig.name} - {siteConfig.description}</title>
	<meta name="description" content={siteConfig.description} />
	<meta property="og:title" content={siteConfig.name} />
	<meta property="og:description" content={siteConfig.description} />
	<meta property="og:image" content={siteConfig.ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<div class="flex min-h-screen flex-col">
		<header class="flex w-full items-center justify-between p-5 px-10">
			<a href="/" class="flex items-center gap-2">
				<Icon icon="fluent:fast-acceleration-24-regular" width={20} height={20} />
				<span class="font-bold">{siteConfig.name}</span>
			</a>
			<div class="flex items-center gap-2">
				<Login isAuthenticated={data.isAuthenticated} />
				<LanguageSelector />
			</div>
		</header>
		<main>
			{@render children()}
		</main>
		<footer class="flex w-full items-center justify-between border-t p-5 px-10">
			<span class="text-sm text-gray-500">
				&copy; {new Date().getFullYear()}
				{siteConfig.name}
			</span>
			<a
				href={siteConfig.github}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1 text-sm text-gray-500">
				<Icon icon="mdi:github" width={20} height={20} />
				<span>GitHub</span>
			</a>
		</footer>
	</div>
</QueryClientProvider>
