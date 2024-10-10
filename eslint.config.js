import prettier from 'eslint-config-prettier';
import globals from 'globals';
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	}
];
