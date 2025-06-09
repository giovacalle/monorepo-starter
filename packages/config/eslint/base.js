import { defineConfig } from 'eslint/config';
import { generalRules, globalsRules, ignoreRules, turboRules } from './_common.js';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
	ignoreRules,
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	globalsRules,
	generalRules,
	turboRules
]);
