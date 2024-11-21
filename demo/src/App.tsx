import { Suspense, use, useState } from 'react'
import { tokenizerPromise } from './kuromoji'

function App() {
	const [promise, setPromise] = useState<Promise<any[]> | null>(null)

	return (
		<>
			<div id="demo" className="row">
				<h1>@patdx/kuromoji demo</h1>
				<a href="https://github.com/patdx/kuromoji.js">GitHub</a>

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

						setPromise(
							tokenizerPromise.then((tokenizer) => {
								try {
									const tokens = tokenizer.tokenize(inputText)
									console.log(tokens)
									return tokens
								} catch (e) {
									console.log(e)
									return undefined as never
								}
							}),
						)
					}}
				>
					<label>
						解析対象
						<input
							type="text"
							name="inputText"
							placeholder="解析したい文字列を入力してください"
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
					<th>表層形</th>
					<th>品詞</th>
					<th>品詞細分類1</th>
					<th>品詞細分類2</th>
					<th>品詞細分類3</th>
					<th>活用型</th>
					<th>活用形</th>
					<th>基本形</th>
					<th>読み</th>
					<th>発音</th>
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
