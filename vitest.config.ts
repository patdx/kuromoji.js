import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		include: [
			'test/**/*.{js,ts}',
			'src/vendor/doublearray/doublearray.test.ts',
		],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,ts}'],
			// provider: 'istanbul' // or 'v8'
		},
	},
})
