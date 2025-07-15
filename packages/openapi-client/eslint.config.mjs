import base from '@monorepo-starter/config-eslint/base';

export default [
	...base,
	{
		ignorePatterns: ['src/gen/**'] // we ignore rules for generated files by orval
	}
];
