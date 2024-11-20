import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: './src/kuromoji.ts',
		browser: './src/loader/BrowserDictionaryLoader.ts',
		node: './src/loader/NodeDictionaryLoader.ts',
	},
	format: 'esm',
	dts: {
		compilerOptions: {
			// strict: false,
		},
	},
	// experimentalDts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
	outDir: 'build',
	/* 	outExtension({ format }) {
		return {
			// js: `.${format}.js`,
			js: `.js`,
		}
	}, */
	target: 'esnext',
	//	treeshake: true,
})
