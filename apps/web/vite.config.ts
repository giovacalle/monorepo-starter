import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			// issue: https://github.com/opral/inlang-paraglide-js/issues/503
			// strategy: ['url', 'cookie', 'globalVariable', 'baseLocale']
			strategy: ['cookie', 'globalVariable', 'baseLocale']
		})
	]
});
