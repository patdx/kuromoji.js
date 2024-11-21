import * as kuromoji from '@patdx/kuromoji'
import * as Comlink from 'comlink'
import { once } from 'lodash-es'

const myLoader: kuromoji.LoaderConfig = {
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

const getTokenizer = once(() =>
	new kuromoji.TokenizerBuilder({
		loader: myLoader,
	}).build(),
)

async function tokenize(text: string): Promise<kuromoji.IpadicFeatures[]> {
	const tokenizer = await getTokenizer()
	return tokenizer.tokenize(text)
}

const kuromojiWorker = { tokenize }
export type KuromojiWorker = typeof kuromojiWorker

Comlink.expose(kuromojiWorker)
