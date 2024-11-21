import { Suspense, use, useState, useTransition } from 'react'
import * as Comlink from 'comlink'
import type { KuromojiWorker } from './kuromoji-worker'
import type { IpadicFeatures } from '../../build/index.mjs'

const kuromojiWorker = new Worker(
	new URL('./kuromoji-worker.ts', import.meta.url),
	{
		type: 'module',
	},
)
const kuromoji = Comlink.wrap<KuromojiWorker>(kuromojiWorker)

function App() {
	const [isPending, startTransition] = useTransition()
	const [promise, setPromise] = useState<Promise<IpadicFeatures[]> | null>(null)

	return (
		<>
			<div id="demo" className="row">
				<h1>@patdx/kuromoji demo</h1>
				<ul>
					<li>
						<a href="https://github.com/patdx/kuromoji.js">GitHub</a>
					</li>
					<li>
						<a href="https://www.npmjs.com/package/@patdx/kuromoji">npm</a>
					</li>
				</ul>

				<form
					v-show="!isLoading"
					onSubmit={(event) => {
						console.log('submit')
						event.preventDefault()
						const form = new FormData(event.target as HTMLFormElement)

						const inputText = form.get('inputText')

						if (typeof inputText !== 'string') {
							return alert('Missing input')
						}

						async function action() {
							try {
								const tokens = await kuromoji.tokenize(inputText as string)
								console.log(tokens)
								return tokens
							} catch (e) {
								console.log(e)
								return undefined as never
							}
						}

						startTransition(() => {
							setPromise(action())
						})
					}}
				>
					<label>
						<div>解析対象 Enter a Japanese sentence or word</div>
						<input
							type="text"
							name="inputText"
							placeholder="これはぺんです。"
						/>
						<input type="text" name="dummy" style={{ display: 'none' }} />
					</label>
					<button type="submit">Submit</button>
				</form>

				{promise ? (
					<Suspense fallback={<div>Loading...</div>}>
						<TokenTable promise={promise} />
					</Suspense>
				) : null}

				<svg
					v-bind:style="{ visibility: svgStyle }"
					width="100%"
					height="800px"
				>
					<g id="lattice" transform="translate(20,20)"></g>
				</svg>
			</div>
		</>
	)
}

function TokenTable({ promise }) {
	const tokens = use(promise) as any[] | undefined

	return (
		<table width="100%">
			<thead>
				<tr>
					<th>表層形 Surface Form</th>
					<th>品詞 Part of Speech</th>
					<th>品詞細分類1 Part of Speech Detail 1</th>
					<th>品詞細分類2 Part of Speech Detail 2</th>
					<th>品詞細分類3 Part of Speech Detail 3</th>
					<th>活用型 Conjugated Type</th>
					<th>活用形 Conjugated Form</th>
					<th>基本形 Basic Form</th>
					<th>読み Reading</th>
					<th>発音 Pronunciation</th>
				</tr>
			</thead>
			<tbody>
				{tokens?.map((token, index) => (
					<tr key={index}>
						<td>{token.surface_form}</td>
						<td>{token.pos}</td>
						<td>{token.pos_detail_1}</td>
						<td>{token.pos_detail_2}</td>
						<td>{token.pos_detail_3}</td>
						<td>{token.conjugated_type}</td>
						<td>{token.conjugated_form}</td>
						<td>{token.basic_form}</td>
						<td>{token.reading}</td>
						<td>{token.pronunciation}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default App
