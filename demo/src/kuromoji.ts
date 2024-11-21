import * as kuromoji from '@patdx/kuromoji'
import type { LoaderConfig } from '../../src/loader/types'

const myLoader: LoaderConfig = {
	async loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
		// strip off .gz
		url = url.replace('.gz', '')
		const res = await fetch(
			'https://cdn.jsdelivr.net/npm/@aiktb/kuromoji@1.0.2/dict/' + url,
		)
		if (!res.ok) {
			throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
		}
		return res.arrayBuffer()
	},
}

export const tokenizerPromise = new kuromoji.TokenizerBuilder({
	loader: myLoader,
}).build()
