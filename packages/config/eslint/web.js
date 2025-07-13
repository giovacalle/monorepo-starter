import { defineConfig } from 'eslint/config';
import { generalRules, globalsRules, ignoreRules, turboRules } from './_common.js';
import css from '@eslint/css';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
	...ignoreRules,
	css.configs.recommended,
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	globalsRules,
	turboRules,
	generalRules,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	}
]);
