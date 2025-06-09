<script>
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils/styles';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { Tabs } from 'bits-ui';
	import { fade, fly } from 'svelte/transition';

	let isVisible = $state(false);
	let activeTab = $state('development');

	const features = {
		development: [
			{
				name: 'TypeScript',
				description: m['pages.home.features.list.development.items.ts'](),
				icon: 'simple-icons:typescript',
				color: 'text-blue-500',
				bgColor: 'bg-blue-500/10'
			},
			{
				name: 'ESLint',
				description: m['pages.home.features.list.development.items.eslint'](),
				icon: 'simple-icons:eslint',
				color: 'text-purple-500',
				bgColor: 'bg-purple-500/10'
			},
			{
				name: 'Prettier',
				description: m['pages.home.features.list.development.items.prettier'](),
				icon: 'simple-icons:prettier',
				color: 'text-pink-500',
				bgColor: 'bg-pink-500/10'
			}
		],
		frontend: [
			{
				name: 'SvelteKit',
				description: m['pages.home.features.list.frontend.items.svelteKit'](),
				icon: 'simple-icons:svelte',
				color: 'text-orange-500',
				bgColor: 'bg-orange-500/10'
			},
			{
				name: 'Tailwind CSS',
				description: m['pages.home.features.list.frontend.items.tailwind'](),
				icon: 'simple-icons:tailwindcss',
				color: 'text-cyan-400',
				bgColor: 'bg-cyan-400/10'
			},
			{
				name: 'Bits UI',
				description: m['pages.home.features.list.frontend.items.bitsUI'](),
				icon: 'lucide:puzzle',
				color: 'text-violet-600',
				bgColor: 'bg-violet-600/10'
			}
		],
		backend: [
			{
				name: 'Drizzle',
				description: m['pages.home.features.list.backend.items.drizzle'](),
				icon: 'simple-icons:drizzle',
				color: 'text-blue-600',
				bgColor: 'bg-blue-600/10'
			},
			{
				name: 'Hono',
				description: m['pages.home.features.list.backend.items.hono'](),
				icon: 'simple-icons:hono',
				color: 'text-yellow-600',
				bgColor: 'bg-yellow-600/10'
			},
			{
				name: 'Orval',
				description: m['pages.home.features.list.backend.items.orval'](),
				icon: 'material-icon-theme:openapi-light',
				color: 'text-green-600',
				bgColor: 'bg-green-600/10'
			},
			{
				name: 'Tanstack Query',
				description: m['pages.home.features.list.backend.items.tanstack'](),
				icon: 'logos:react-query-icon',
				color: 'text-red-500',
				bgColor: 'bg-red-500/10'
			}
		],
		workflow: [
			{
				name: 'Turborepo',
				description: m['pages.home.features.list.workflow.items.turborepo'](),
				icon: 'simple-icons:turborepo',
				color: 'text-emerald-500',
				bgColor: 'bg-emerald-500/10'
			},
			{
				name: 'pnpm',
				description: m['pages.home.features.list.workflow.items.pnpm'](),
				icon: 'simple-icons:pnpm',
				color: 'text-amber-500',
				bgColor: 'bg-amber-500/10'
			},
			{
				name: 'Docker',
				description: m['pages.home.features.list.workflow.items.docker'](),
				icon: 'simple-icons:docker',
				color: 'text-blue-500',
				bgColor: 'bg-blue-500/10'
			}
		]
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					isVisible = true;
				}
			},
			{ threshold: 0.3 }
		);

		const section = document.getElementById('features');
		if (section) observer.observe(section);

		return () => {
			if (section) observer.unobserve(section);
		};
	});
</script>

<section id="features" class="py-20 relative">
	<div class="container mx-auto px-4 relative z-10">
		<div class="text-center mb-12">
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-4">
				<Icon icon="lucide:package" class="w-4 h-4" />
				<span class="text-sm font-medium">{m['pages.home.features.whatsIncluded']()}</span>
			</div>
			<h2
				class={cn(
					'text-3xl md:text-4xl font-bold mb-4 transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				)}>
				{m['pages.home.features.whatYouNeed']()}
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
					{m['pages.home.features.buildAtScale']()}
				</span>
			</h2>
			<p
				class={cn(
					'text-lg text-slate-600 max-w-2xl mx-auto transition-all duration-700 delay-100',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				)}>
				{m['pages.home.features.subtitle']()}
			</p>
		</div>

		<!-- Tabs using Bits UI Tabs -->
		<div
			class={cn(
				'mb-20 md:mb-40 transition-all duration-700 delay-200',
				isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
			)}>
			<Tabs.Root value={activeTab} onValueChange={value => (activeTab = value)} class="w-full">
				<Tabs.List class="flex flex-wrap justify-center gap-2 md:gap-4 mb-5 relative">
					<Tabs.Trigger
						value="development"
						class={cn(
							'px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors relative',
							'data-[state=active]:text-emerald-600 data-[state=inactive]:hover:opacity-60'
						)}>
						<div class="flex items-center gap-2">
							<Icon icon="lucide:code" class="w-4 h-4" />
							<span>{m['pages.home.features.list.development.label']()}</span>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity">
						</div>
					</Tabs.Trigger>
					<Tabs.Trigger
						value="frontend"
						class={cn(
							'px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors relative',
							'data-[state=active]:text-emerald-600 data-[state=inactive]:hover:opacity-60'
						)}>
						<div class="flex items-center gap-2">
							<Icon icon="lucide:layout" class="w-4 h-4" />
							<span>{m['pages.home.features.list.frontend.label']()}</span>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity">
						</div>
					</Tabs.Trigger>
					<Tabs.Trigger
						value="backend"
						class={cn(
							'px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors relative',
							'data-[state=active]:text-emerald-600 data-[state=inactive]:hover:opacity-60'
						)}>
						<div class="flex items-center gap-2">
							<Icon icon="lucide:server" class="w-4 h-4" />
							<span>{m['pages.home.features.list.backend.label']()}</span>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity">
						</div>
					</Tabs.Trigger>
					<Tabs.Trigger
						value="workflow"
						class={cn(
							'px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors relative',
							'data-[state=active]:text-emerald-600 data-[state=inactive]:hover:opacity-60'
						)}>
						<div class="flex items-center gap-2">
							<Icon icon="lucide:git-branch" class="w-4 h-4" />
							<span>{m['pages.home.features.list.workflow.label']()}</span>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity">
						</div>
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="development" class="outline-none">
					<div
						class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-300"
						in:fly={{ y: 20, duration: 300, delay: 100 }}
						out:fade={{ duration: 200 }}>
						{#each features.development as feature}
							<div
								class="bg-muted rounded-lg p-6 shadow-sm border border-border-card hover:shadow-md transition-all duration-300 hover:-translate-y-1">
								<div
									class={cn(
										'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
										feature.bgColor,
										feature.color
									)}>
									<Icon icon={feature.icon} class="w-6 h-6" />
								</div>
								<h3 class="text-lg font-semibold mb-2">{feature.name}</h3>
								<p class="text-slate-600 text-sm">{feature.description}</p>
							</div>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="frontend" class="outline-none">
					<div
						class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-300"
						in:fly={{ y: 20, duration: 300, delay: 100 }}
						out:fade={{ duration: 200 }}>
						{#each features.frontend as feature}
							<div
								class="bg-muted rounded-lg p-6 shadow-sm border border-border-card hover:shadow-md transition-all duration-300 hover:-translate-y-1">
								<div
									class={cn(
										'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
										feature.bgColor,
										feature.color
									)}>
									<Icon icon={feature.icon} class="w-6 h-6" />
								</div>
								<h3 class="text-lg font-semibold mb-2">{feature.name}</h3>
								<p class="text-slate-600 text-sm">{feature.description}</p>
							</div>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="backend" class="outline-none">
					<div
						class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-300"
						in:fly={{ y: 20, duration: 300, delay: 100 }}
						out:fade={{ duration: 200 }}>
						{#each features.backend as feature}
							<div
								class="bg-muted rounded-lg p-6 shadow-sm border border-border-card hover:shadow-md transition-all duration-300 hover:-translate-y-1">
								<div
									class={cn(
										'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
										feature.bgColor,
										feature.color
									)}>
									<Icon icon={feature.icon} class="w-6 h-6" />
								</div>
								<h3 class="text-lg font-semibold mb-2">{feature.name}</h3>
								<p class="text-slate-600 text-sm">{feature.description}</p>
							</div>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="workflow" class="outline-none">
					<div
						class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-300"
						in:fly={{ y: 20, duration: 300, delay: 100 }}
						out:fade={{ duration: 200 }}>
						{#each features.workflow as feature}
							<div
								class="bg-muted rounded-lg p-6 shadow-sm border border-border-card hover:shadow-md transition-all duration-300 hover:-translate-y-1">
								<div
									class={cn(
										'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
										feature.bgColor,
										feature.color
									)}>
									<Icon icon={feature.icon} class="w-6 h-6" />
								</div>
								<h3 class="text-lg font-semibold mb-2">{feature.name}</h3>
								<p class="text-slate-600 text-sm">{feature.description}</p>
							</div>
						{/each}
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>

	<!-- Bottom wave -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-auto">
			<path
				fill="#0f172b"
				fill-opacity="1"
				d="M0,192L48,192C96,192,192,192,288,208C384,224,480,256,576,261.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
			></path>
		</svg>
	</div>
</section>
