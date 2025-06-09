<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/styles';
	import { Button } from 'bits-ui';
	import { fly, fade } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages.js';
	import { siteConfig } from '$lib/config/site';

	let isVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					isVisible = true;
				}
			},
			{ threshold: 0.3 }
		);

		const section = document.getElementById('contributions');
		if (section) observer.observe(section);

		return () => {
			if (section) observer.unobserve(section);
		};
	});
</script>

<section
	id="contributions"
	class="py-20 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
	<!-- Decorative elements -->
	<div
		class="absolute top-40 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-30 animate-pulse">
	</div>
	<div
		class="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-20">
	</div>
	<div class="container mx-auto px-4 relative z-10">
		<div class="text-center mb-12">
			<h2
				class={cn(
					'text-3xl md:text-4xl font-bold mb-4 transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				)}>
				{m['pages.home.contributions.theJourney']()}
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500"
					>{m['pages.home.contributions.continues']()}</span>
			</h2>
			<p
				class={cn(
					'text-lg text-slate-300 max-w-2xl mx-auto transition-all duration-700 delay-100',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				)}>
				{m['pages.home.contributions.subtitle']()}
			</p>
		</div>
		<div
			class="bg-card rounded-lg p-8 shadow-sm border border-border-card"
			in:fly={{ y: 20, duration: 300, delay: 100 }}
			out:fade={{ duration: 200 }}>
			<div class="max-w-3xl mx-auto">
				<div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
					<div class="w-full md:w-1/3 flex justify-center">
						<div class="w-48 h-48 rounded-full bg-emerald-100 flex items-center justify-center">
							<Icon icon="lucide:users" class="w-24 h-24 text-emerald-500" />
						</div>
					</div>
					<div class="w-full md:w-2/3">
						<p class="text-slate-300 mb-6">
							{m['pages.home.contributions.community']()}
						</p>
						<div class="space-y-4">
							<div class="flex items-start gap-3">
								<div
									class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
									<Icon icon="lucide:code" class="w-4 h-4 text-emerald-500" />
								</div>
								<div>
									<h4 class="font-medium">{m['pages.home.contributions.code.label']()}</h4>
									<p class="text-slate-400 text-sm">
										{m['pages.home.contributions.code.text']()}
									</p>
								</div>
							</div>
							<div class="flex items-start gap-3">
								<div
									class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
									<Icon icon="lucide:message-square" class="w-4 h-4 text-blue-500" />
								</div>
								<div>
									<h4 class="font-medium">{m['pages.home.contributions.feedback.label']()}</h4>
									<p class="text-slate-400 text-sm">
										{m['pages.home.contributions.feedback.text']()}
									</p>
								</div>
							</div>
							<div class="flex items-start gap-3">
								<div
									class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
									<Icon icon="lucide:share-2" class="w-4 h-4 text-purple-500" />
								</div>
								<div>
									<h4 class="font-medium">
										{m['pages.home.contributions.spreadTheWord.label']()}
										<p class="text-slate-400 text-sm">
											{m['pages.home.contributions.spreadTheWord.text']()}
										</p>
									</h4>
								</div>
							</div>
						</div>
						<Button.Root
							href={siteConfig.github}
							target="_blank"
							rel="noopener noreferrer"
							class="w-max p-2 mt-10 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg flex items-center gap-2 border border-slate-600 transition-colors">
							<Icon icon="lucide:github" class="w-5 h-5" />
							GitHub Repository
						</Button.Root>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
