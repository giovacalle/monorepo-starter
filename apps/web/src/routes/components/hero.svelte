<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/styles';
	import { m } from '$lib/paraglide/messages.js';
	import { Button } from 'bits-ui';
	import { siteConfig } from '$lib/config/site';

	let isVisible = browser;

	function scrollToSection(sectionId: string, duration: number = 1000) {
		if (!browser) return;

		const section = document.getElementById(sectionId);
		if (!section) return;

		const startPosition: number = window.scrollY;

		const targetPosition: number = section.getBoundingClientRect().top + window.scrollY;
		const distance: number = targetPosition - startPosition;
		let startTime: number | null = null;

		function easeInOutCubic(t: number): number {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		}

		// Funzione per l'animazione frame-by-frame
		function animateScroll(currentTime: number): void {
			if (startTime === null) {
				startTime = currentTime;
			}

			const timeElapsed: number = currentTime - startTime;
			const progress: number = Math.min(timeElapsed / duration, 1);
			const easedProgress: number = easeInOutCubic(progress);

			window.scrollTo(0, startPosition + distance * easedProgress);

			if (timeElapsed < duration) {
				requestAnimationFrame(animateScroll);
			}
		}

		requestAnimationFrame(animateScroll);
	}
</script>

<section
	class="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
	<div class="relative z-10 container mx-auto mb-5 px-4 py-16 md:py-24">
		<div class="flex flex-col items-center gap-12 lg:flex-row">
			<!-- Text content -->
			<div class="space-y-8 lg:w-1/2">
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400">
					<Icon icon="lucide:zap" class="h-4 w-4" />
					<span class="text-sm font-medium">{m['pages.home.hero.chip']()}</span>
				</div>
				<h1
					class={cn(
						'text-4xl leading-tight font-bold transition-all duration-700 md:text-5xl lg:text-6xl',
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
					)}>
					<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>Turbo</span
					>{m['pages.home.hero.chargeYourMonorepo']()}
					<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>monorepo</span>
				</h1>
				<p
					class={cn(
						'max-w-xl text-lg text-slate-300 transition-all delay-100 duration-700 md:text-xl',
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
					)}>
					{m['pages.home.hero.subtitle']()}
				</p>
				<div
					class={cn(
						'flex flex-wrap gap-4 transition-all delay-200 duration-700',
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
					)}>
					<Button.Root
						onclick={() => scrollToSection('features')}
						class="rounded-lg bg-emerald-500 p-2 font-medium text-white transition-colors hover:bg-emerald-600">
						{m['pages.home.hero.learnMore']()}
					</Button.Root>
					<Button.Root
						href={siteConfig.github}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 p-2 font-medium text-white transition-colors hover:bg-slate-600">
						<Icon icon="lucide:github" class="h-5 w-5" />
						GitHub
					</Button.Root>
				</div>
			</div>

			<!-- Visual representation -->
			<div
				class={cn(
					'transition-all delay-300 duration-1000 lg:w-1/2',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
				)}>
				<div class="relative">
					<!-- Main repo box -->
					<div
						class="relative z-20 rounded-xl border border-emerald-500/30 bg-slate-800 p-6 shadow-lg shadow-emerald-500/10">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Icon icon="lucide:folder" class="h-5 w-5 text-emerald-400" />
								<span class="font-mono text-emerald-400">monorepo-starter</span>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-3 w-3 rounded-full bg-red-400"></div>
								<div class="h-3 w-3 rounded-full bg-amber-400"></div>
								<div class="h-3 w-3 rounded-full bg-emerald-400"></div>
							</div>
						</div>

						<div class="space-y-3 font-mono text-sm">
							<div class="flex items-center gap-2">
								<Icon icon="lucide:folder" class="h-4 w-4 text-blue-400" />
								<span>apps/</span>
							</div>
							<div class="ml-6 flex items-center gap-2">
								<Icon icon="lucide:layout" class="h-4 w-4 text-purple-400" />
								<span>web</span>
							</div>
							<div class="ml-6 flex items-center gap-2">
								<Icon icon="lucide:smartphone" class="h-4 w-4 text-pink-400" />
								<span>mobile</span>
							</div>
							<div class="flex items-center gap-2">
								<Icon icon="lucide:folder" class="h-4 w-4 text-green-400" />
								<span>packages/</span>
							</div>
							<div class="ml-6 flex items-center gap-2">
								<Icon icon="lucide:layout-dashboard" class="h-4 w-4 text-amber-400" />
								<span>ui</span>
							</div>
							<div class="ml-6 flex items-center gap-2">
								<Icon icon="lucide:database" class="h-4 w-4 text-red-400" />
								<span>db</span>
							</div>
							<div class="ml-6 flex items-center gap-2">
								<Icon icon="lucide:settings" class="h-4 w-4 text-orange-400" />
								<span>config</span>
							</div>
							<div class="flex items-center gap-2">
								<Icon icon="lucide:file-text" class="h-4 w-4 text-slate-400" />
								<span>turbo.json</span>
							</div>
							<div class="flex items-center gap-2">
								<Icon icon="lucide:file-text" class="h-4 w-4 text-slate-400" />
								<span>package.json</span>
							</div>
						</div>
					</div>

					<!-- Decorative elements -->
					<div
						class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-3xl">
					</div>
					<div
						class="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-10 blur-3xl">
					</div>

					<!-- Speed lines -->
					<div class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 transform">
						<div
							class="motion-safe:animate-speed-line h-1 w-20 animate-pulse rounded-full bg-emerald-500/50 blur-sm">
						</div>
						<div
							class="motion-safe:animate-speed-line mt-3 h-1 w-16 animate-pulse rounded-full bg-emerald-500/40 blur-sm">
						</div>
						<div
							class="motion-safe:animate-speed-line mt-3 h-1 w-12 animate-pulse rounded-full bg-emerald-500/30 blur-sm">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Bottom wave -->
	<div class="absolute right-0 bottom-0 left-0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="h-auto w-full">
			<path
				class="fill-background"
				fill-opacity="1"
				d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
			></path>
		</svg>
	</div>
</section>

<style>
	.animate-speed-line {
		animation: speedLine 2s ease-in-out infinite;
	}
	.animate-speed-line:nth-child(2) {
		animation-duration: 3.5s;
	}
	.animate-speed-line:nth-child(3) {
		animation-duration: 4.5s;
	}

	@keyframes speedLine {
		0% {
			transform: translateX(0) scaleX(1);
			opacity: 0.2;
		}
		50% {
			transform: translateX(-30px) scaleX(1.3);
			opacity: 0.7;
		}
		100% {
			transform: translateX(0) scaleX(1);
			opacity: 0.2;
		}
	}
</style>
