// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	eslint.configs.recommended,
	tseslint.configs.strict,
	//	tseslint.configs.stylistic,
	/* 	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	}, */
	{
		ignores: ['build/**/*', 'vitest.config.ts'],
	},
)
