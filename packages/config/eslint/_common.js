import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import globals from 'globals';
import turboPlugin from 'eslint-plugin-turbo';

const gitignorePath = fileURLToPath(new URL('../../../.gitignore', import.meta.url));

export const ignoreRules = includeIgnoreFile(gitignorePath);

export const globalsRules = {
	languageOptions: { globals: { ...globals.browser, ...globals.node } },
	rules: { 'no-undef': 'off' }
};

export const generalRules = {
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		semi: ['error', 'always'],
		quotes: ['error', 'single'],
		'no-unused-vars': 'warn',
		'no-console': 'warn'
	}
};

export const turboRules = {
	plugins: {
		turbo: turboPlugin
	},
	rules: {
		'turbo/no-undeclared-env-vars': 'warn'
	}
};
